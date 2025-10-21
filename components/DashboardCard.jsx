export default function DashboardCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  )
}
