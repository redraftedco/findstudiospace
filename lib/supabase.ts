import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://vnjsczhqhnzrplrdkolb.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'sb_publishable_BNjt2IcsKgSqatPUGKIghg_PJLJpQMF'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
