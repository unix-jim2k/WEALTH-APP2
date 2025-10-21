import { supabase } from '../../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { user_id, asset_type, asset_label, balance } = req.body

  if (!user_id || !asset_type || !asset_label || balance == null)
    return res.status(400).json({ error: 'Missing fields' })

  const { data, error } = await supabase
    .from('portfolios')
    .upsert({ user_id, asset_type, asset_label, balance }, { onConflict: ['user_id', 'asset_type'] })
    .select()

  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json(data)
}
