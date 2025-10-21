import { useEffect, useState } from 'react'
import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'
import { supabase } from '../lib/supabaseClient'
import useCountUp from '../hooks/useCountUp'

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [portfolio, setPortfolio] = useState([])

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Dummy portfolio
    setPortfolio([
      { id: 1, label: 'Cash (GBP)', balance: 4200.12 },
      { id: 2, label: 'Bitcoin', balance: 0.4321 },
      { id: 3, label: 'Stocks', balance: 15420.8 }
    ])

    return () => listener?.unsubscribe()
  }, [])

  const signInAnonymously = () => setUser({ email: 'demo@market-moves.app' })

  return (
    <div className="min-h-scr
