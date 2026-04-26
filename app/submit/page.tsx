import { redirect } from 'next/navigation'

// Marketing-facing /submit URL aliases the existing /list-your-space submission
// form. Keeps the canonical submission code in one place (list-your-space) while
// surfacing the cleaner "Submit your studio" CTA wording recommended by the
// landlord-conversion analysis. Server-side 308 redirect preserves SEO equity
// for any inbound /submit link without forking the form code.
export default function SubmitPage() {
  redirect('/list-your-space')
}
