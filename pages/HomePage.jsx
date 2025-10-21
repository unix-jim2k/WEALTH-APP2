import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [portfolio, setPortfolio] = useState([])

  // Listen to auth changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener?.unsubscribe()
  }, [])

  // Fetch portfolio when user changes
  useEffect(() => {
    if (!user) return

    const fetchPortfolio = async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)

      if (error) console.error('Error fetching portfolio:', error)
      else setPortfolio(data)
    }

    fetchPortfolio()
  }, [user])

  // Demo sign-in
  const signInAnonymously = async () => {
    const { data: anonUser } = await supabase.auth.signInWithOtp({
      email: `demo+${Date.now()}@market-moves.app`
    })
    // fallback: if anon sign-in is blocked, just use dummy user
    setUser({ id: 'demo-user-id', email: 'demo@market-moves.app' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Portfolio Dashboard</h1>

        {!user && (
          <button
            onClick={signInAnonymously}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Demo sign in
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {portfolio.map((item) => (
            <DashboardCard key={item.id} title={item.asset_label}>
              <div className="text-2xl font-semibold">
                {item.balance.toLocaleString()}
              </div>
            </DashboardCard>
          ))}
        </div>
      </main>
    </div>
  )
}
