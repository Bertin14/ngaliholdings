import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ImageUpload from '../../components/ImageUpload'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
}

const API = import.meta.env.VITE_API_URL

export default function AdminSubsidiaries() {
  const { token, logout } = useAuth()
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Subsidiary | null>(null)
  const [form, setForm] = useState({ id: '', name: '', description: '', image: '' })

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    fetchSubsidiaries()
  }, [])

  async function fetchSubsidiaries() {
    const res = await fetch(`${API}/api/subsidiaries`)
    const data = await res.json()
    setSubsidiaries(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await fetch(`${API}/api/subsidiaries/${editing.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ name: form.name, description: form.description, image: form.image }),
      })
    } else {
      await fetch(`${API}/api/subsidiaries`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      })
    }
    setShowForm(false)
    setEditing(null)
    setForm({ id: '', name: '', description: '', image: '' })
    fetchSubsidiaries()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this subsidiary?')) return
    await fetch(`${API}/api/subsidiaries/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    fetchSubsidiaries()
  }

  function handleEdit(sub: Subsidiary) {
    setEditing(sub)
    setForm({ id: sub.id, name: sub.name, description: sub.description, image: sub.image })
    setShowForm(true)
  }

  function handleAdd() {
    setEditing(null)
    setForm({ id: '', name: '', description: '', image: '' })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-ngali-black text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-lg">Subsidiaries</h1>
        </div>
        <button onClick={() => { logout(); window.location.href = '/admin/login' }}
          className="bg-ngali-orange px-4 py-1.5 rounded text-sm hover:opacity-90">
          Sign out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Subsidiaries ({subsidiaries.length})</h2>
          <button onClick={handleAdd}
            className="bg-ngali-orange text-white px-4 py-2 rounded hover:opacity-90 text-sm font-medium">
            + Add Subsidiary
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              {editing ? 'Edit Subsidiary' : 'Add New Subsidiary'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug, e.g. "ngali-energy")</label>
                  <input type="text" value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required rows={3} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
               <ImageUpload
                folder="subsidiaries"
                currentImage={form.image}
                onUpload={(url) => setForm({ ...form, image: url })}
               />
              </div>
              <div className="flex gap-3">
                <button type="submit"
                  className="bg-ngali-orange text-white px-4 py-2 rounded hover:opacity-90 text-sm">
                  {editing ? 'Save changes' : 'Add subsidiary'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subsidiaries list */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="space-y-3">
            {subsidiaries.map((sub) => (
              <div key={sub.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <img src={sub.image} alt={sub.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{sub.name}</p>
                  <p className="text-sm text-gray-500 line-clamp-1">{sub.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">ID: {sub.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(sub)}
                    className="text-blue-600 text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(sub.id)}
                    className="text-red-500 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}