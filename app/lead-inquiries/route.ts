import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { listing_id, name, email, message, website, form_started_at } =
      await req.json();

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!form_started_at || Date.now() - Number(form_started_at) < 3000) {
      return NextResponse.json(
        { ok: false, error: "Please wait a moment before submitting." },
        { status: 400 }
      );
    }

    if (!listing_id || !name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("lead_inquiries").insert([
      {
        listing_id,
        name,
        email,
        message,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, message: "Inquiry sent." });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 }
    );
  }
}
