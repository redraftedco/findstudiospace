#!/usr/bin/env python3
"""
Scrape Craigslist Portland for photo/music studio listings → Supabase.

Usage:
    pip install -r requirements.txt
    cp .env.example .env  # fill in keys
    python scrape.py
"""

import os, time
import requests
from bs4 import BeautifulSoup
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

db = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; studio-scraper/1.0)"}

# (search category, query) pairs — craigslist Portland
SEARCHES = [
    ("off", "photo studio"),
    ("off", "photography studio"),
    ("off", "music studio"),
    ("off", "recording studio"),
    ("off", "rehearsal space"),
    ("sub", "photo studio"),
    ("sub", "music studio"),
    ("reb", "photo studio"),
    ("reb", "music studio"),
]

TYPE_KEYWORDS = {
    "photo": ["photo studio", "photography studio", "backdrop", "cyclorama", "strobe", "seamless"],
    "music": ["music studio", "recording studio", "rehearsal", "soundproof", "vocal booth", "pro tools"],
}


def classify(title: str, description: str) -> str:
    text = f"{title} {description}".lower()
    for t, keywords in TYPE_KEYWORDS.items():
        if any(k in text for k in keywords):
            return t
    return "general"


def search_craigslist(category: str, query: str) -> list[str]:
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
        for a in soup.select("a.posting-title, a.cl-app-anchor.text-only")
        if a.get("href", "").startswith("https://")
    ]


def fetch_listing(url: str) -> dict:
    r = requests.get(url, headers=HEADERS, timeout=10)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")

    title = (soup.select_one("#titletextonly") or soup.select_one(".postingtitletext")).get_text(strip=True)

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


def already_exists(url: str) -> bool:
    res = db.from_("listings").select("id").eq("external_url", url).execute()
    return bool(res.data)


def main():
    seen: set[str] = set()

    for category, query in SEARCHES:
        print(f"\n→ {category}: {query}")
        try:
            urls = search_craigslist(category, query)
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
                listing = fetch_listing(url)
                listing["type"] = classify(listing["title"] or "", listing["description"] or "")
                db.from_("listings").insert(listing).execute()
                print(f"  added [{listing['type']}] {listing['title']}")
                time.sleep(1.5)
            except Exception as e:
                print(f"  error {url}: {e}")


if __name__ == "__main__":
    main()
