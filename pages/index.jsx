import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'

export default function Home() {
  const [user, setUser] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch or create demo data
  useEffect(() => {
    const init = async () => {
      try {
        // Listen to Supabase auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
        })

        // TEMP: sign in demo user automatically
        const { data: { user: demoUser }, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'demo1@market-moves.app',
          password: 'demo123'
        })

        if (signInError) console.warn('Demo user sign-in failed:', signInError.message)
        if (demoUser) setUser(demoUser)

        // Fetch sample portfolio (or placeholder if empty)
        const { data: holdings, error } = await supabase.from('holdings').select('*').limit(10)
        if (error) console.warn('Error loading holdings:', error.message)

        setPortfolio(
          holdings?.length
            ? holdings.map((h) => ({
                id: h.id,
                label: h.asset_name || 'Unknown asset',
                balance: h.amount || 0
              }))
            : [
                { id: 1, label: 'Cash (GBP)', balance: 4200.12 },
                { id: 2, label: 'Bitcoin', balance: 0.4321 },
                { id: 3, label: 'Stocks', balance: 15420.8 }
              ]
        )
      } catch (err) {
        console.error('Init error:', err)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  // Demo sign-in fallback button
  const signInAnonymously = () => {
    setUser({ email: 'demo@market-moves.app' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="p-6 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Portfolio Dashboard</h1>
          {!user ? (
            <button
              onClick={signInAnonymously}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Demo sign in
            </button>
          ) : (
            <div className="text-sm text-gray-600">Signed in as {user.email}</div>
          )}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {portfolio.map((item, idx) => (
            <DashboardCard key={item.id} title={item.label}>
              <div
                className={`text-2xl font-semibold text-white p-4 rounded-xl ${
                  idx === 0
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : idx === 1
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                }`}
              >
                {typeof item.balance === 'number'
                  ? item.balance.toLocaleString()
                  : item.balance}
              </div>
            </DashboardCard>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mt-8">
          <DashboardCard title="Quick Actions">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Top up</button>
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">Trade</button>
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition">More</button>
            </div>
          </DashboardCard>
        </section>
      </main>
    </div>
  )
}
