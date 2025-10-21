export default function Header({ user }) {
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-md py-4 mb-6">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        {/* App Name */}
        <h1 className="text-xl font-bold text-white">The Wealth App™</h1>

        {/* User Info */}
        {user ? (
          <span className="text-white font-medium">{user.email}</span>
        ) : (
          <span className="text-white/80 text-sm">Not signed in</span>
        )}
      </div>
    </header>
  )
}
