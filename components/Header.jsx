export default function Header({ user }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <div className="flex items-center gap-3">
        <div className="text-2xl font-bold">The Wealth App™</div>
        <div className="text-sm text-gray-500">Market-Moves.com</div>
      </div>
      <div>
        {user ? (
          <div className="text-sm text-gray-700">Hello, {user.email}</div>
        ) : (
          <div className="text-sm text-gray-500">Not signed in</div>
        )}
      </div>
    </header>
  )
}
