<main className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
  <div className="flex justify-between items-center">
    <h1 className="text-3xl font-bold tracking-tight text-gray-800">
      Portfolio Dashboard
    </h1>
    {!user ? (
      <button
        onClick={signInAnonymously}
        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
      >
        Demo sign in
      </button>
    ) : (
      <div className="text-sm text-gray-600">Signed in</div>
    )}
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {portfolio.map((item) => (
      <DashboardCard key={item.id} title={item.label}>
        <div className="text-2xl font-semibold text-gray-900">
          {typeof item.balance === 'number'
            ? item.balance.toLocaleString('en-GB', {
                style: 'currency',
                currency: item.label.includes('GBP') ? 'GBP' : 'USD',
              })
            : item.balance}
        </div>
      </DashboardCard>
    ))}
  </div>
</main>

