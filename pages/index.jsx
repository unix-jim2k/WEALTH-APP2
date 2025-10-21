import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'

export default function Home() {
  const [user, setUser] = useState(null)
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    const s = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    // fetch dummy portfolio
    setPortfolio([
      { id: 1, label: 'Cash (GBP)', balance: 14200.12 },
      { id: 2, label: 'Bitcoin', balance: 14.4321 },
      { id: 3, label: 'Stocks', balance: 75420.8 }
    ])
    return () => s.data?.unsubscribe?.()
  }, [])

  const signInAnonymously = async () => {
    // demo: sign in with a random magic link email or anon sign-in depends on Supabase config.
    // For MVP we just set a dummy user locally to avoid surprising auth setup:
    setUser({ email: 'james@market-moves.app' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="p-6 max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Portfolio Dashboard</h1>
          {!user ? (
            <button onClick={signInAnonymously} className="px-3 py-1 rounded bg-blue-600 text-white">Demo sign in</button>
          ) : (
            <div className="text-sm text-gray-600">Signed in</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {portfolio.map(item => (
            <DashboardCard key={item.id} title={item.label}>
              <div className="text-xl font-medium">
                {typeof item.balance === 'number' ? item.balance.toLocaleString() : item.balance}
              </div>
            </DashboardCard>
          ))}
        </div>

        <section className="mt-6">
          <DashboardCard title="Quick Actions">
            <div className="flex gap-3">
              <button className="px-3 py-2 rounded bg-green-600 text-white">Top up</button>
              <button className="px-3 py-2 rounded bg-indigo-600 text-white">Trade</button>
              <button className="px-3 py-2 rounded bg-gray-200">More</button>
            </div>
          </DashboardCard>
        </section>
      </main>
    </div>
  )
}
