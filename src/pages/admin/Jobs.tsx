import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  deadline: string
}

const API = import.meta.env.VITE_API_URL

export default function AdminJobs() {
  const { token, logout } = useAuth()
  const [jobs, setJobs] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<JobOpening | null>(null)
  const [form, setForm] = useState({
    id: '', title: '', department: '', location: '', type: '', description: '', deadline: ''
  })

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    const res = await fetch(`${API}/api/jobs`)
    const data = await res.json()
    setJobs(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await fetch(`${API}/api/jobs/${editing.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          title: form.title, department: form.department, location: form.location,
          type: form.type, description: form.description, deadline: form.deadline
        }),
      })
    } else {
      await fetch(`${API}/api/jobs`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      })
    }
    setShowForm(false)
    setEditing(null)
    setForm({ id: '', title: '', department: '', location: '', type: '', description: '', deadline: '' })
    fetchJobs()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this job opening?')) return
    await fetch(`${API}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    fetchJobs()
  }

  function handleEdit(job: JobOpening) {
    setEditing(job)
    setForm({ id: job.id, title: job.title, department: job.department,
      location: job.location, type: job.type, description: job.description, deadline: job.deadline })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-ngali-black text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-lg">Job Openings</h1>
        </div>
        <button onClick={() => { logout(); window.location.href = '/admin/login' }}
          className="bg-ngali-orange px-4 py-1.5 rounded text-sm hover:opacity-90">
          Sign out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Jobs ({jobs.length})</h2>
          <button onClick={() => { setEditing(null); setForm({ id: '', title: '', department: '', location: '', type: '', description: '', deadline: '' }); setShowForm(true) }}
            className="bg-ngali-orange text-white px-4 py-2 rounded hover:opacity-90 text-sm font-medium">
            + Add Job
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{editing ? 'Edit Job' : 'Add New Job'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug, e.g. "senior-developer")</label>
                  <input type="text" value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input type="text" value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="Full-time, Part-time, Contract..."
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (YYYY-MM-DD)</label>
                  <input type="date" value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required rows={4} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="flex gap-3">
                <button type="submit"
                  className="bg-ngali-orange text-white px-4 py-2 rounded hover:opacity-90 text-sm">
                  {editing ? 'Save changes' : 'Add job'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? <p className="text-gray-500">Loading...</p> : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.department} · {job.location} · {job.type}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Deadline: {job.deadline}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(job)} className="text-blue-600 text-sm hover:underline">Edit</button>
                    <button onClick={() => handleDelete(job.id)} className="text-red-500 text-sm hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}