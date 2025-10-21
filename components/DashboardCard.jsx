export default function DashboardCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      <h2 className="text-lg font-medium text-gray-700 mb-3">{title}</h2>
      {children}
    </div>
  )
}
