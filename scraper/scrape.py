#!/usr/bin/env python3
"""
Scrape Craigslist + Yelp for studio/workspace listings in Portland -> Supabase.

Usage:
    pip install -r requirements.txt
    cp .env.example .env  # fill in keys
    python scrape.py
"""

import os, time, json
import requests
from bs4 import BeautifulSoup
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

db = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
GOOGLE_KEY = os.environ.get("GOOGLE_PLACES_KEY")

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; studio-scraper/1.0)"}

CRAIGSLIST_SEARCHES = [
    # office/commercial
    ("off", "photo studio"),
    ("off", "photography studio"),
    ("off", "music studio"),
    ("off", "recording studio"),
    ("off", "rehearsal space"),
    ("off", "darkroom"),
    ("off", "art studio"),
    ("off", "artist studio"),
    ("off", "workshop space"),
    ("off", "maker space"),
    ("off", "dance studio"),
    ("off", "yoga studio"),
    ("off", "fitness studio"),
    ("off", "podcast studio"),
    ("off", "soundproof"),
    # creative gigs/services
    ("cre", "photo studio"),
    ("cre", "music studio"),
    ("cre", "recording studio"),
    ("cre", "rehearsal"),
    ("cre", "art studio"),
    ("cre", "dance studio"),
    # sublets/temp
    ("sub", "studio space"),
    ("sub", "art studio"),
    ("sub", "photo studio"),
    ("sub", "rehearsal"),
]

# Google Places text search queries -> our type
GOOGLE_SEARCHES = [
    ("photo studio rental Portland OR", "photo"),
    ("photography studio rental Portland OR", "photo"),
    ("recording studio Portland OR", "music"),
    ("music rehearsal space Portland OR", "music"),
    ("podcast studio rental Portland OR", "music"),
    ("art studio rental Portland OR", "art"),
    ("artist studio space Portland OR", "art"),
    ("dance studio rental Portland OR", "fitness"),
    ("yoga studio rental Portland OR", "fitness"),
    ("coworking space Portland OR", "office"),
    ("workshop space rental Portland OR", "workshop"),
    ("makerspace Portland OR", "workshop"),
    ("retail space for rent Portland OR", "retail"),
]

TYPE_KEYWORDS = {
    "photo": ["photo studio", "photography studio", "backdrop", "cyclorama", "strobe", "seamless", "lightroom", "darkroom"],
    "music": ["music studio", "recording studio", "rehearsal", "soundproof", "vocal booth", "pro tools", "podcast"],
    "art": ["art studio", "artist studio", "ceramics", "kiln", "painting studio", "printmaking"],
    "fitness": ["dance studio", "yoga studio", "fitness studio", "movement studio", "pilates"],
    "workshop": ["workshop", "maker space", "makerspace", "woodworking", "fabrication", "welding"],
    "office": ["coworking", "co-working", "shared office", "desk rental", "office suite"],
    "retail": ["retail space", "storefront", "showroom", "pop-up"],
}


def classify(title: str, description: str) -> str:
    text = f"{title} {description}".lower()
    for t, keywords in TYPE_KEYWORDS.items():
        if any(k in text for k in keywords):
            return t
    return "general"


def already_exists(url: str) -> bool:
    res = db.from_("listings").select("id").eq("external_url", url).execute()
    return bool(res.data)


# ── Craigslist ────────────────────────────────────────────────────────────────

def craigslist_search(category: str, query: str) -> list[str]:
    r = requests.get(
        f"https://portland.craigslist.org/search/{category}",
        params={"query": query},
        headers=HEADERS,
        timeout=10,
    )
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    return [
        a["href"]
        for a in soup.find_all("a", href=True)
        if "/d/" in a["href"] and "craigslist.org" in a["href"]
    ]


def craigslist_fetch(url: str) -> dict:
    r = requests.get(url, headers=HEADERS, timeout=10)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    title_el = soup.select_one("#titletextonly") or soup.select_one(".postingtitletext")
    title = title_el.get_text(strip=True) if title_el else "Untitled"

    price_el = soup.select_one(".price")
    price = price_el.get_text(strip=True) if price_el else None

    body = soup.select_one("#postingbody")
    if body:
        for el in body.select(".print-qrcode-container"):
            el.decompose()
        description = body.get_text(separator="\n", strip=True)
    else:
        description = None

    neighborhood = None
    for sel in [".breadcrumbs .crumb.area + .crumb", ".postingtitletext small"]:
        el = soup.select_one(sel)
        if el:
            neighborhood = el.get_text(strip=True).strip("() ")
            break

    images = [img["src"] for img in soup.select("#thumbs img") if img.get("src")]

    return {
        "title": title,
        "price_display": price,
        "description": description,
        "neighborhood": neighborhood,
        "images": images or None,
        "external_url": url,
        "city": "Portland",
        "status": "active",
    }


def run_craigslist(seen: set[str]):
    for category, query in CRAIGSLIST_SEARCHES:
        print(f"\n> craigslist/{category}: {query}")
        try:
            urls = craigslist_search(category, query)
        except Exception as e:
            print(f"  search failed: {e}")
            continue

        for url in urls:
            if url in seen:
                continue
            seen.add(url)
            if already_exists(url):
                print(f"  skip  {url}")
                continue
            try:
                listing = craigslist_fetch(url)
                listing["type"] = classify(listing["title"], listing["description"] or "")
                db.from_("listings").insert(listing).execute()
                print(f"  added [{listing['type']}] {listing['title']}")
                time.sleep(1.5)
            except Exception as e:
                print(f"  error {url}: {e}")


# ── Google Places ─────────────────────────────────────────────────────────────

def run_google(seen: set[str]):
    if not GOOGLE_KEY:
        print("\n> google: skipped (no GOOGLE_PLACES_KEY in .env)")
        return

    for query, listing_type in GOOGLE_SEARCHES:
        print(f"\n> google: {query}")
        try:
            r = requests.get(
                "https://maps.googleapis.com/maps/api/place/textsearch/json",
                params={"query": query, "key": GOOGLE_KEY},
                timeout=10,
            )
            r.raise_for_status()
            results = r.json().get("results", [])
        except Exception as e:
            print(f"  search failed: {e}")
            continue

        for place in results:
            place_id = place.get("place_id")
            url = f"https://maps.google.com/?cid={place_id}"
            if not place_id or url in seen:
                continue
            seen.add(url)
            if already_exists(url):
                print(f"  skip  {place.get('name')}")
                continue

            try:
                location = place.get("geometry", {}).get("location", {})
                address = place.get("formatted_address", "")
                neighborhood = address.split(",")[1].strip() if "," in address else None
                photo_ref = (place.get("photos") or [{}])[0].get("photo_reference")
                image_url = (
                    f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference={photo_ref}&key={GOOGLE_KEY}"
                    if photo_ref else None
                )

                listing = {
                    "title": place["name"],
                    "description": f"Rating: {place.get('rating', 'N/A')}/5 ({place.get('user_ratings_total', 0)} reviews). {address}",
                    "type": listing_type,
                    "neighborhood": neighborhood,
                    "address": address,
                    "images": [image_url] if image_url else None,
                    "external_url": url,
                    "city": "Portland",
                    "status": "active",
                }
                db.from_("listings").insert(listing).execute()
                print(f"  added [{listing_type}] {place['name']}")
                time.sleep(0.3)
            except Exception as e:
                print(f"  error {place.get('name')}: {e}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    seen: set[str] = set()
    run_craigslist(seen)
    run_google(seen)
    print("\nDone.")


if __name__ == "__main__":
    main()
