import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const LEADS_DB_ID = process.env.NOTION_LEADS_DATABASE_ID!

type LeadInput = {
  fullName: string
  email: string
  listingTitle: string
  listingUrl?: string
  listingType?: string | null
  message?: string
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}

export async function createNotionLead(lead: LeadInput): Promise<{ ok: boolean; pageId?: string; error?: string }> {
  if (!process.env.NOTION_API_KEY || !LEADS_DB_ID) {
    return { ok: false, error: 'Missing Notion env vars' }
  }

  try {
    const listingText = lead.listingUrl
      ? `${lead.listingTitle} (${lead.listingUrl})`
      : lead.listingTitle

    const properties: Record<string, unknown> = {
      'Lead Name': { title: [{ text: { content: (lead.fullName ?? 'Unknown').slice(0, 200) } }] },
      'Email': { email: lead.email || null },
      'Submitted At': { date: { start: new Date().toISOString() } },
      'Routing Status': { select: { name: 'New' } },
      'Lead Quality': { select: { name: 'Warm' } },
      'Revenue Status': { select: { name: 'Eligible' } },
      'Follow-Up Needed': { checkbox: true },
    }

    if (listingText) {
      properties['Listing Requested'] = {
        rich_text: [{ text: { content: listingText.slice(0, 1900) } }],
      }
    }

    if (lead.listingType) {
      properties['Use Type'] = {
        rich_text: [{ text: { content: lead.listingType.slice(0, 200) } }],
      }
    }

    if (lead.message) {
      properties['Notes'] = {
        rich_text: [{ text: { content: lead.message.slice(0, 1900) } }],
      }
    }

    const utmParts = [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ')
    if (utmParts) {
      properties['Source'] = {
        rich_text: [{ text: { content: utmParts.slice(0, 200) } }],
      }
    }

    const response = await notion.pages.create({
      parent: { database_id: LEADS_DB_ID },
      properties: properties as never,
    })

    return { ok: true, pageId: response.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[notion-leads] Failed to create lead:', message)
    return { ok: false, error: message }
  }
}
