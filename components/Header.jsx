export default function Header({ user }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold tracking-tight">Wealth App™</h1>
        <div className="flex items-center gap-3">
          {user ? (
            <span className="text-sm opacity-90">{user.email}</span>
          ) : (
            <span className="text-sm opacity-75">Guest</span>
          )}
          <img
            src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
            alt="User"
            className="w-8 h-8 rounded-full border border-white/30"
          />
        </div>
      </div>
    </header>
  )
}
