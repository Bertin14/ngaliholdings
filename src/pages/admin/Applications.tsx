import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface JobApplication {
  id: number
  jobId: string
  name: string
  email: string
  coverLetter: string
  createdAt: string
}

const API = import.meta.env.VITE_API_URL

export default function AdminApplications() {
  const { token, logout } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchApplications() }, [])

  async function fetchApplications() {
    const res = await fetch(`${API}/api/admin/applications`, {
      headers: authHeaders,
    })
    const data = await res.json()
    setApplications(data)
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this application?')) return
    await fetch(`${API}/api/admin/applications/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    fetchApplications()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-ngali-black text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-lg">Job Applications</h1>
        </div>
        <button onClick={() => { logout(); window.location.href = '/admin/login' }}
          className="bg-ngali-orange px-4 py-1.5 rounded text-sm hover:opacity-90">
          Sign out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          All Applications ({applications.length})
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{app.name}</p>
                    <p className="text-sm text-gray-500">{app.email}</p>
                    <p className="text-xs text-ngali-orange mt-0.5">
                      Applied for: {app.jobId}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                      className="text-blue-600 text-sm hover:underline">
                      {expanded === app.id ? 'Hide letter' : 'Read letter'}
                    </button>
                    <button onClick={() => handleDelete(app.id)}
                      className="text-red-500 text-sm hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
                {expanded === app.id && (
                  <div className="mt-3 bg-gray-50 rounded p-3 text-sm text-gray-700">
                    <p className="font-medium text-gray-600 mb-1">Cover Letter:</p>
                    {app.coverLetter}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}