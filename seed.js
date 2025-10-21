import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// Prevent accidental production seeding
if (process.env.NODE_ENV === 'production') {
  console.log('✅ Seeding disabled in production!')
  process.exit(0)
}

// Helper: random balance
const getRandomBalance = (max, decimals = 2) =>
  parseFloat((Math.random() * max).toFixed(decimals))

async function seed() {
  try {
    console.log('🧹 Deleting old demo users and related data...')
    const demoUserIds = (
      await supabase
        .from('profiles')
        .select('id')
        .ilike('email', 'demo%@market-moves.app')
    ).data?.map(u => u.id) || []

    if (demoUserIds.length) {
      await supabase.from('trades').delete().in('user_id', demoUserIds)
      await supabase.from('portfolios').delete().in('user_id', demoUserIds)
      await supabase.from('profiles').delete().in('id', demoUserIds)
    }

    console.log('👥 Creating 30 demo users...')
    const demoEmails = Array.from({ length: 30 }, (_, i) => `demo${i + 1}@market-moves.app`)

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .insert(demoEmails.map(email => ({ email })))
      .select('id,email')

    if (profilesError) throw profilesError

    console.log('💰 Populating portfolios and trades...')
    for (const profile of profiles) {
      const { id } = profile

      // Portfolios
      await supabase.from('portfolios').insert([
        { user_id: id, asset_type: 'cash', asset_label: 'Cash (GBP)', balance: getRandomBalance(10000) },
        { user_id: id, asset_type: 'crypto', asset_label: 'Bitcoin', balance: getRandomBalance(2, 4) },
        { user_id: id, asset_type: 'stocks', asset_label: 'Stocks', balance: getRandomBalance(50000) }
      ])

      // Demo trades
      await supabase.from('trades').insert([
        { user_id: id, asset_type: 'crypto', amount: getRandomBalance(0.5, 4), price: getRandomBalance(40000), trade_type: 'buy' },
        { user_id: id, asset_type: 'stocks', amount: getRandomBalance(100, 2), price: getRandomBalance(500), trade_type: 'buy' }
      ])
    }

    console.log('✅ Demo seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error seeding data:', err)
    process.exit(1)
  }
}

seed()
