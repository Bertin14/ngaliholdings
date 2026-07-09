import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ImageUpload from '../../components/ImageUpload'

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

interface TeamMember {
  id: number
  name: string
  role: string
  image?: string
  order: number
}

const API = import.meta.env.VITE_API_URL

export default function AdminAbout() {
  const { token, logout } = useAuth()
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [values, setValues] = useState<CoreValue[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const [editingAbout, setEditingAbout] = useState(false)
  const [aboutForm, setAboutForm] = useState({ background: '', vision: '', mission: '' })

  const [showValueForm, setShowValueForm] = useState(false)
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null)
  const [valueForm, setValueForm] = useState({ title: '', text: '' })

  const [showTeamForm, setShowTeamForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [teamForm, setTeamForm] = useState({ name: '', role: '', image: '', order: 0 })

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [aboutData, valuesData, teamData] = await Promise.all([
      fetch(`${API}/api/about`).then(r => r.json()).catch(() => null),
      fetch(`${API}/api/values`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/team`).then(r => r.json()).catch(() => []),
    ])
    setAbout(aboutData)
    setAboutForm({ background: aboutData?.background ?? '', vision: aboutData?.vision ?? '', mission: aboutData?.mission ?? '' })
    setValues(valuesData ?? [])
    setTeam(teamData ?? [])
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

  async function handleTeamSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editingMember) {
      await fetch(`${API}/api/team/${editingMember.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(teamForm),
      })
    } else {
      await fetch(`${API}/api/team`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(teamForm),
      })
    }
    setShowTeamForm(false)
    setEditingMember(null)
    setTeamForm({ name: '', role: '', image: '', order: 0 })
    fetchAll()
  }

  async function handleDeleteMember(id: number) {
    if (!confirm('Delete this team member?')) return
    await fetch(`${API}/api/team/${id}`, { method: 'DELETE', headers: authHeaders })
    fetchAll()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-ngali-black text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-lg">About Us Page</h1>
        </div>
        <button onClick={() => { logout(); window.location.href = '/admin/login' }}
          className="bg-ngali-orange px-4 py-1.5 rounded text-sm hover:opacity-90">
          Sign out
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* Background / Vision / Mission */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Background, Vision & Mission</h2>
            <button onClick={() => setEditingAbout(!editingAbout)}
              className="text-blue-600 text-sm hover:underline">
              {editingAbout ? 'Cancel' : 'Edit'}
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
                    className="text-blue-600 text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDeleteValue(value.id)}
                    className="text-red-500 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Leadership Team ({team.length})</h2>
            <button onClick={() => { setEditingMember(null); setTeamForm({ name: '', role: '', image: '', order: 0 }); setShowTeamForm(true) }}
              className="bg-ngali-orange text-white px-3 py-1.5 rounded text-sm hover:opacity-90">
              + Add Member
            </button>
          </div>

          {showTeamForm && (
            <form onSubmit={handleTeamSubmit} className="space-y-3 mb-4 bg-gray-50 p-4 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
                <input type="text" value={teamForm.role}
                  onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                  required className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Display Order
                 <span className="text-gray-400 font-normal ml-1">(1 = first in list)</span>
               </label>
                <input
                  type="number"
                  min="1"
                  value={teamForm.order}
                  onChange={(e) => setTeamForm({ ...teamForm, order: parseInt(e.target.value) })}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                 <ImageUpload
                  folder="team"
                  currentImage={teamForm.image}
                  onUpload={(url) => setTeamForm({ ...teamForm, image: url })}
                  />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-ngali-orange text-white px-3 py-1.5 rounded text-sm hover:opacity-90">
                  {editingMember ? 'Save' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowTeamForm(false)}
                  className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {team.map((member) => (
           <div key={member.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-ngali-orange text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                    {member.order}
                </span>
                    {member.image && (
                  <img src={member.image} alt={member.name}
                      className="w-10 h-10 rounded-full object-cover" />
            )}
          <div>
               <p className="font-medium text-gray-800 text-sm">{member.name}</p>
               <p className="text-gray-500 text-sm">{member.role}</p>
          </div>
          </div>
          <div className="flex gap-2">
           <button onClick={() => {
            setEditingMember(member)
            setTeamForm({ name: member.name, role: member.role, image: member.image ?? '', order: member.order })
            setShowTeamForm(true)
          }} className="text-blue-600 text-sm hover:underline">Edit</button>
          <button onClick={() => handleDeleteMember(member.id)}
        className="text-red-500 text-sm hover:underline">Delete</button>
    </div>
  </div>
))}
          </div>
        </div>

      </div>
    </div>
  )
}