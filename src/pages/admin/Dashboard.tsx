import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  const sections = [
    { title: 'Subsidiaries', description: 'Add, edit or remove subsidiary companies', link: '/admin/subsidiaries', color: 'bg-blue-50 border-blue-200' },
    { title: 'Blog Posts', description: 'Manage news and insights articles', link: '/admin/blogs', color: 'bg-green-50 border-green-200' },
    { title: 'Job Openings', description: 'Post and manage career opportunities', link: '/admin/jobs', color: 'bg-orange-50 border-orange-200' },
    { title: 'Contact Messages', description: 'View messages from the contact form', link: '/admin/contacts', color: 'bg-purple-50 border-purple-200' },
    { title: 'Job Applications', description: 'Review submitted job applications', link: '/admin/applications', color: 'bg-red-50 border-red-200' },
    { title: 'About Us Page', description: 'Edit background, vision, mission, values and team members', link: '/admin/about', color: 'bg-yellow-50 border-yellow-200' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin navbar */}
      <nav className="bg-ngali-black text-white px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Ngali Holdings — Admin</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-sm">Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-ngali-orange px-4 py-1.5 rounded text-sm hover:opacity-90"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.link}
              className={`border rounded-lg p-6 hover:shadow-md transition ${section.color}`}
            >
              <h3 className="font-semibold text-gray-800 mb-1">{section.title}</h3>
              <p className="text-sm text-gray-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}