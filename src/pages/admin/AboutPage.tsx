import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

interface AboutContent {
  id: number
  background: string
  vision: string
  mission: string
}

interface CoreValue {
  id: number
  title: string
  text: string
}

const API = import.meta.env.VITE_API_URL

export default function AdminAbout() {
  const { token } = useAuth()
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [values, setValues] = useState<CoreValue[]>([])
  const [loading, setLoading] = useState(true)

  const [editingAbout, setEditingAbout] = useState(false)
  const [aboutForm, setAboutForm] = useState({ background: '', vision: '', mission: '' })

  const [showValueForm, setShowValueForm] = useState(false)
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null)
  const [valueForm, setValueForm] = useState({ title: '', text: '' })

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [aboutData, valuesData] = await Promise.all([
      fetch(`${API}/api/about`).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/values`).then(r => r.json()).catch(() => []),
    ])
    setAbout(aboutData)
    setAboutForm({ background: aboutData?.background ?? '', vision: aboutData?.vision ?? '', mission: aboutData?.mission ?? '' })
    setValues(valuesData ?? [])
    setLoading(false)
  }

  async function handleAboutSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch(`${API}/api/about`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(aboutForm),
    })
    setEditingAbout(false)
    fetchAll()
  }

  async function handleValueSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingValue) {
      await fetch(`${API}/api/values/${editingValue.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(valueForm),
      })
    } else {
      await fetch(`${API}/api/values`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(valueForm),
      })
    }
    setShowValueForm(false)
    setEditingValue(null)
    setValueForm({ title: '', text: '' })
    fetchAll()
  }

  async function handleDeleteValue(id: number) {
    if (!confirm('Delete this value?')) return
    await fetch(`${API}/api/values/${id}`, { method: 'DELETE', headers: authHeaders })
    fetchAll()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <AdminLayout>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Background / Vision / Mission */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Background, Vision & Mission</h2>
            <button onClick={() => setEditingAbout(!editingAbout)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition">
              {editingAbout ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>

          {editingAbout ? (
            <form onSubmit={handleAboutSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
                <textarea value={aboutForm.background}
                  onChange={(e) => setAboutForm({ ...aboutForm, background: e.target.value })}
                  rows={4} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
                <textarea value={aboutForm.vision}
                  onChange={(e) => setAboutForm({ ...aboutForm, vision: e.target.value })}
                  rows={2} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                <textarea value={aboutForm.mission}
                  onChange={(e) => setAboutForm({ ...aboutForm, mission: e.target.value })}
                  rows={2} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <button type="submit"
                className="bg-ngali-orange text-white px-4 py-2 rounded hover:opacity-90 text-sm">
                Save changes
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Background</p>
                <p className="text-gray-700 text-sm">{about?.background}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Vision</p>
                <p className="text-gray-700 text-sm">{about?.vision}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Mission</p>
                <p className="text-gray-700 text-sm">{about?.mission}</p>
              </div>
            </div>
          )}
        </div>

        {/* Core Values */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Core Values ({values.length})</h2>
            <button onClick={() => { setEditingValue(null); setValueForm({ title: '', text: '' }); setShowValueForm(true) }}
              className="bg-ngali-orange text-white px-3 py-1.5 rounded text-sm hover:opacity-90">
              + Add Value
            </button>
          </div>

          {showValueForm && (
            <form onSubmit={handleValueSubmit} className="space-y-3 mb-4 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={valueForm.title}
                  onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                  required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={valueForm.text}
                  onChange={(e) => setValueForm({ ...valueForm, text: e.target.value })}
                  rows={2} required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-ngali-orange text-white px-3 py-1.5 rounded text-sm hover:opacity-90">
                  {editingValue ? 'Save' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowValueForm(false)}
                  className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {values.map((value) => (
              <div key={value.id} className="flex justify-between items-start border-b border-gray-100 pb-2">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{value.title}</p>
                  <p className="text-gray-600 text-sm">{value.text}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => { setEditingValue(value); setValueForm({ title: value.title, text: value.text }); setShowValueForm(true) }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition">✏️ Edit</button>
                  <button onClick={() => handleDeleteValue(value.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
