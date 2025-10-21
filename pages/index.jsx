import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)

  // Listen for auth changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener?.unsubscribe()
  }, [])

  // Load portfolio data from Supabase
  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true)
      try {
        // If not signed in yet, use demo user as fallback
        const email = user?.email || 'demo1@market-moves.app'

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()

        if (profileError) {
          console.warn('Profile load error:', profileError)
          setLoading(false)
          return
        }

        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolios')
          .select('asset_label, balance')
          .eq('user_id', profileData.id)

        if (portfolioError) throw portfolioError
        setPortfolio(portfolioData || [])
      } catch (err) {
        console.error('Error loading portfolio:', err.message)
      } finally {
        setLoading(false)
      }
    }

    loadPortfolio()
  }, [user])

  // Demo sign-in
  const signInAnonymously = async () => {
    setUser({ email: 'demo1@market-moves.app' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <main className="p-6 max-w-5xl mx-auto">
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

        {loading ? (
          <div className="text-gray-500 text-center py-10">Loading portfolio...</div>
        ) : portfolio.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {portfolio.map((item, idx) => (
              <DashboardCard key={idx} title={item.asset_label}>
                <div className="text-2xl font-semibold text-gray-800">
                  {item.balance.toLocaleString()}
                </div>
              </DashboardCard>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-10">No portfolio data found.</div>
        )}
      </main>
    </div>
  )
}
