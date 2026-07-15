import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

interface Stats {
  subsidiaries: number
  blogs: number
  jobs: number
  contacts: number
  applications: number
}

interface RecentMessage {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

interface RecentApplication {
  id: number
  name: string
  email: string
  jobId: string
  createdAt: string
}

const API = import.meta.env.VITE_API_URL

export default function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([])
  const [loading, setLoading] = useState(true)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    async function fetchDashboardData() {
      const [subs, blogs, jobs, contacts, applications] = await Promise.all([
        fetch(`${API}/api/subsidiaries`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/blogs`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/jobs`).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/admin/contacts`, { headers: authHeaders }).then(r => r.json()).catch(() => []),
        fetch(`${API}/api/admin/applications`, { headers: authHeaders }).then(r => r.json()).catch(() => []),
      ])

      setStats({
        subsidiaries: subs.length,
        blogs: blogs.length,
        jobs: jobs.length,
        contacts: contacts.length,
        applications: applications.length,
      })
      setRecentMessages(contacts.slice(0, 3))
      setRecentApplications(applications.slice(0, 3))
      setLoading(false)
    }
    fetchDashboardData()
  }, [])

  const statCards = [
    { label: 'Subsidiaries', value: stats?.subsidiaries ?? 0, link: '/admin/subsidiaries', icon: '🏢' },
    { label: 'Blog Posts', value: stats?.blogs ?? 0, link: '/admin/blogs', icon: '📝' },
    { label: 'Job Openings', value: stats?.jobs ?? 0, link: '/admin/jobs', icon: '💼' },
    { label: 'Messages', value: stats?.contacts ?? 0, link: '/admin/contacts', icon: '✉️' },
    { label: 'Applications', value: stats?.applications ?? 0, link: '/admin/applications', icon: '📋' },
  ]

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-t-4 border-ngali-orange"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold mb-1 text-ngali-black">
              {loading ? '—' : card.value}
            </p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Recent Messages */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Recent Messages</h2>
            <Link to="/admin/contacts" className="text-ngali-orange text-sm hover:underline">View all →</Link>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : recentMessages.length === 0 ? (
            <p className="text-gray-400 text-sm">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800 text-sm">{msg.name}</p>
                      <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs text-gray-500">{msg.email}</p>
                    <p className="text-sm text-gray-600 mt-0.5 truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Recent Applications</h2>
            <Link to="/admin/applications" className="text-ngali-orange text-sm hover:underline">View all →</Link>
          </div>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : recentApplications.length === 0 ? (
            <p className="text-gray-400 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-ngali-orange font-bold text-sm shrink-0">
                    {app.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800 text-sm">{app.name}</p>
                      <p className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs text-gray-500">{app.email}</p>
                    <p className="text-xs text-ngali-orange mt-0.5">Applied for: {app.jobId}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick overview */}
        <div className="bg-ngali-black text-white rounded-xl p-4">
          <h2 className="font-semibold mb-4">Site Overview</h2>
          <div className="space-y-3">
            {statCards.map((card) => (
              <div key={card.label} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{card.icon} {card.label}</span>
                <span className="font-bold">{loading ? '—' : card.value}</span>
              </div>
            ))}
          </div>
          <a
            href="https://ngaliholdings.vercel.app"
            target="_blank"
            className="block mt-6 text-center bg-ngali-orange px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
            🌐 Visit Live Site
          </a>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Add Subsidiary', link: '/admin/subsidiaries', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { label: 'Add Blog Post', link: '/admin/blogs', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { label: 'Add Job Opening', link: '/admin/jobs', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { label: 'Edit About Us', link: '/admin/about', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className={`${action.color} rounded-lg px-3 py-3 text-sm font-medium text-center transition`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}