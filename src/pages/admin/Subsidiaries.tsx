import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import ImageUpload from '../../components/ImageUpload'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
  sector?: string
}

const API = import.meta.env.VITE_API_URL

export default function AdminSubsidiaries() {
  const { token } = useAuth()
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Subsidiary | null>(null)
  const [form, setForm] = useState({ id: '', name: '', description: '', image: '', sector: '' })
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchSubsidiaries() }, [])

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
        body: JSON.stringify({ name: form.name, description: form.description, image: form.image, sector: form.sector }),
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
    setForm({ id: '', name: '', description: '', image: '', sector: '' })
    fetchSubsidiaries()
  }

  async function handleDelete(id: string) {
    await fetch(`${API}/api/subsidiaries/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    setDeleteConfirm(null)
    fetchSubsidiaries()
  }

  function handleEdit(sub: Subsidiary) {
    setEditing(sub)
    setForm({ id: sub.id, name: sub.name, description: sub.description, image: sub.image, sector: sub.sector ?? '' })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const sectors = ['All', ...Array.from(new Set(subsidiaries.map(s => s.sector ?? 'General').filter(Boolean)))]

  const filtered = subsidiaries.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.description.toLowerCase().includes(search.toLowerCase())
    const matchesSector = sectorFilter === 'All' || (sub.sector ?? 'General') === sectorFilter
    return matchesSearch && matchesSector
  })

  const sectorColors: Record<string, string> = {
    Mining: 'bg-amber-900 text-amber-200',
    Healthcare: 'bg-teal-900 text-teal-200',
    Aerospace: 'bg-blue-900 text-blue-200',
    Industrial: 'bg-orange-900 text-orange-200',
    Energy: 'bg-green-900 text-green-200',
    Technology: 'bg-purple-900 text-purple-200',
    General: 'bg-gray-700 text-gray-200',
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 text-gray-900 px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-4xl font-bold">Subsidiaries</h1>
            <p className="text-gray-500 mt-1">
              {subsidiaries.length} companies across {sectors.length - 1} sectors
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ id: '', name: '', description: '', image: '', sector: '' }); setShowForm(true) }}
            className="flex items-center gap-2 bg-ngali-orange text-gray-900 px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition"
          >
            + Add subsidiary
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6 mt-6">
          <input
            type="text"
            placeholder="Search subsidiaries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange shadow-sm"
          />
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange shadow-sm"
          >
            {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All sectors' : s}</option>)}
          </select>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              {editing ? `Edit — ${editing.name}` : 'Add New Subsidiary'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
                  <input type="text" value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="e.g. ngali-energy"
                    required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <select value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange">
                    <option value="">Select sector</option>
                    {['Mining', 'Healthcare', 'Aerospace', 'Industrial', 'Energy', 'Technology'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <ImageUpload
                  folder="subsidiaries"
                  currentImage={form.image}
                  onUpload={(url) => setForm({ ...form, image: url })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-ngali-orange text-gray-900 px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition">
                  {editing ? 'Save changes' : 'Add subsidiary'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }}
                  className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cards Grid */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No subsidiaries found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((sub) => (
              <div key={sub.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-ngali-orange shadow-sm hover:shadow-md transition group">
                {/* Image */}
                <div className="relative h-40 bg-gray-100">
                  {sub.image ? (
                    <img src={sub.image} alt={sub.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl text-gray-400">🏢</span>
                    </div>
                  )}
                  {/* Sector badge */}
                  {sub.sector && (
                    <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${sectorColors[sub.sector] ?? 'bg-gray-700 text-gray-200'}`}>
                      {sub.sector}
                    </span>
                  )}
                  {/* Action buttons on hover */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(sub)}
                      className="w-8 h-8 bg-gray-50/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-blue-600 transition text-sm">
                      ✏️
                    </button>
                    <button onClick={() => setDeleteConfirm(sub.id)}
                      className="w-8 h-8 bg-gray-50/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-red-600 transition text-sm">
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">{sub.description}</p>
                  <p className="text-gray-600 text-xs mt-2 font-mono">{sub.id}</p>
                </div>

                {/* Delete confirmation */}
                {deleteConfirm === sub.id && (
                  <div className="px-4 pb-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-red-600 text-sm mb-3">Delete <strong>{sub.name}</strong>? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(sub.id)}
                          className="bg-red-600 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition">
                          Yes, delete
                        </button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}