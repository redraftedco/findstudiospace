import { NextResponse } from 'next/server'

// Studio Pro tier retired. Placement ads use /api/checkout/visibility instead.
export async function POST() {
  return NextResponse.json(
    { error: 'This checkout endpoint has been retired. Use /api/checkout/visibility.' },
    { status: 410 }
  )
}
