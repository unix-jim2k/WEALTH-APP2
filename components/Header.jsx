export default function Header({ user }) {
  return (
    <header className="bg-white shadow-md py-4 mb-6">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">The Wealth App™</h1>
        {user && <span className="text-gray-600">{user.email}</span>}
      </div>
    </header>
  )
}
