export default function DashboardCard({ title, children }) {
  return (
    <div className="bg-white hover:shadow-lg transition-shadow duration-200 rounded-2xl border border-gray-100 p-5">
      <h2 className="text-gray-700 font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  )
}
