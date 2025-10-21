import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// Only run in dev/staging
if (process.env.NODE_ENV === 'production') {
  console.log('Seeding disabled in production!')
  process.exit(0)
}

// Utility to generate random balances
const getRandomBalance = (max, decimals = 2) =>
  parseFloat((Math.random() * max).toFixed(decimals))

// Seed function
async function seed() {
  try {
    console.log('Deleting old demo data...')
    // Remove demo users, portfolios, trades
    await supabase.from('trades').delete().ilike('user_id', '%demo%')
    await supabase.from('portfolios').delete().ilike('user_id', '%demo%')
    await supabase.from('profiles').delete().ilike('email', 'demo%@market-moves.app')

    console.log('Creating demo users...')
    const demoEmails = Array.from({ length: 30 }, (_, i) => `demo${i + 1}@market-moves.app`)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .insert(demoEmails.map(email => ({ email })))
      .select('id,email')

    if (profilesError) throw profilesError

    console.log('Populating portfolios and trades...')
    for (const profile of profiles) {
      const { id } = profile

      // Portfolios
      await supabase.from('portfolios').insert([
        { user_id: id, asset_type: 'cash', asset_label: 'Cash (GBP)', balance: getRandomBalance(10000) },
        { user_id: id, asset_type: 'crypto', asset_label: 'Bitcoin', balance: getRandomBalance(2, 4) },
        { user_id: id, asset_type: 'stocks', asset_label: 'Stocks', balance: getRandomBalance(50000) }
      ])

      // Trades
      await supabase.from('trades').insert([
        { user_id: id, asset_type: 'crypto', amount: getRandomBalance(0.5, 4), price: getRandomBalance(40000), trade_type: 'buy' },
        { user_id: id, asset_type: 'stocks', amount: getRandomBalance(100, 2), price: getRandomBalance(500), trade_type: 'buy' }
      ])
    }

    console.log('✅ Seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error seeding data:', err)
    process.exit(1)
  }
}

seed() 
