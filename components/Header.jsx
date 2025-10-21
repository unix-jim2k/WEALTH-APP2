export default function Header({ user }) {
  return (
    <header className="relative overflow-hidden shadow-md py-4 mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 animate-gradient-x opacity-70"></div>
      <div className="relative max-w-5xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white z-10">The Wealth App™</h1>
        {user ? (
          <span className="text-white z-10">{user.email}</span>
        ) : (
          <span className="text-white/80 text-sm z-10">Not signed in</span>
        )}
      </div>
    </header>
  )
}
