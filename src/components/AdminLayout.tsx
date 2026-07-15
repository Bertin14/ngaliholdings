import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Dashboard', link: '/admin', icon: '⊞' },
  { label: 'Subsidiaries', link: '/admin/subsidiaries', icon: '🏢' },
  { label: 'Blog Posts', link: '/admin/blogs', icon: '📝' },
  { label: 'Job Openings', link: '/admin/jobs', icon: '💼' },
  { label: 'About Us Page', link: '/admin/about', icon: '👥' },
  { label: 'Messages', link: '/admin/contacts', icon: '✉️' },
  { label: 'Applications', link: '/admin/applications', icon: '📋' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-56 bg-ngali-black text-white flex flex-col z-50">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ngali-orange rounded flex items-center justify-center font-bold text-sm">N</div>
            <div>
              <p className="font-bold text-sm">Ngali Holdings</p>
              <p className="text-xs text-gray-400">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* User profile */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ngali-orange flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.link}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                location.pathname === item.link
                  ? 'bg-ngali-orange text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-1">
          <a
            href="https://ngaliholdings.vercel.app"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <span>🌐</span>
            View Live Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-900 hover:text-white transition"
          >
            <span>⎋</span>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content offset by sidebar */}
      <div className="ml-56 flex-1 min-h-screen">
        {children}
      </div>
    </div>
  )
}