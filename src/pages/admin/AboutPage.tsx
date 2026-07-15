import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ImageUpload from '../../components/ImageUpload'
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

interface TeamMember {
  id: number
  name: string
  role: string
  image?: string
  cv:      string
  order: number
}
interface BoardMember {
  id: number
  name: string
  role: string
  image?: string
  cv:     string
  order: number
}

const API = import.meta.env.VITE_API_URL

export default function AdminAbout() {
  const { token } = useAuth()
  const [about, setAbout] = useState<AboutContent | null>(null)
  const [values, setValues] = useState<CoreValue[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  const [editingAbout, setEditingAbout] = useState(false)
  const [aboutForm, setAboutForm] = useState({ background: '', vision: '', mission: '' })

  const [showValueForm, setShowValueForm] = useState(false)
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null)
  const [valueForm, setValueForm] = useState({ title: '', text: '' })

  const [board, setBoard] = useState<BoardMember[]>([])
  const [showBoardForm, setShowBoardForm] = useState(false)
  const [editingBoardMember, setEditingBoardMember] = useState<BoardMember | null>(null)
  const [boardForm, setBoardForm] = useState({ name: '', role: '', image: '', order: 0, cv: '' })

  const [showTeamForm, setShowTeamForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [teamForm, setTeamForm] = useState({ name: '', role: '', image: '', order: 0, cv: '' })

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
  const [aboutData, valuesData, teamData, boardData] = await Promise.all([
    fetch(`${API}/api/about`).then(r => r.json()).catch(() => null),
    fetch(`${API}/api/values`).then(r => r.json()).catch(() => []),
    fetch(`${API}/api/team`).then(r => r.json()).catch(() => []),
    fetch(`${API}/api/board`).then(r => r.json()).catch(() => []),
  ])
  setAbout(aboutData)
  setAboutForm({ background: aboutData?.background ?? '', vision: aboutData?.vision ?? '', mission: aboutData?.mission ?? '' })
  setValues(valuesData ?? [])
  setTeam(teamData ?? [])
  setBoard(boardData ?? [])
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
  async function handleBoardSubmit(e: React.FormEvent) {
  e.preventDefault()
  if (editingBoardMember) {
    await fetch(`${API}/api/board/${editingBoardMember.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(boardForm),
    })
  } else {
    await fetch(`${API}/api/board`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(boardForm),
    })
  }
  setShowBoardForm(false)
  setEditingBoardMember(null)
  setBoardForm({ name: '', role: '', image: '', order: 0, cv: '' })
  fetchAll()
}

async function handleDeleteBoardMember(id: number) {
  if (!confirm('Delete this board member?')) return
  await fetch(`${API}/api/board/${id}`, { method: 'DELETE', headers: authHeaders })
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
    setTeamForm({ name: '', role: '', image: '', order: 0, cv: ''})
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
    <AdminLayout>

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
        {/* Board Members */}
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="font-bold text-gray-800 text-lg">Board of Directors ({board.length})</h2>
    <button onClick={() => { setEditingBoardMember(null); setBoardForm({ name: '', role: '', image: '', order: 0,cv: '' }); setShowBoardForm(true) }}
      className="bg-ngali-orange text-white px-3 py-1.5 rounded text-sm hover:opacity-90">
      + Add Member
    </button>
  </div>

  {showBoardForm && (
    <form onSubmit={handleBoardSubmit} className="space-y-3 mb-4 bg-gray-50 p-4 rounded">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" value={boardForm.name}
            onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
            required className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role / Title</label>
          <input type="text" value={boardForm.role}
            onChange={(e) => setBoardForm({ ...boardForm, role: e.target.value })}
            required className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">CV / Experience</label>
  <textarea
    value={boardForm.cv}
    onChange={(e) => setBoardForm({ ...boardForm, cv: e.target.value })}
    rows={6}
    placeholder="Education, work experience, achievements..."
    className="w-full border border-gray-300 rounded px-3 py-2"
  />
</div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
            <span className="text-gray-400 font-normal ml-1">(1 = first)</span>
          </label>
          <input type="number" min="1" value={boardForm.order}
            onChange={(e) => setBoardForm({ ...boardForm, order: parseInt(e.target.value) })}
            required className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Portrait Photo</label>
        <ImageUpload
          folder="board"
          currentImage={boardForm.image}
          onUpload={(url) => setBoardForm({ ...boardForm, image: url })}
        />
        <p className="text-xs text-gray-400 mt-1">Best results with portrait/vertical photos</p>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-ngali-orange text-white px-3 py-1.5 rounded text-sm hover:opacity-90">
          {editingBoardMember ? 'Save' : 'Add'}
        </button>
        <button type="button" onClick={() => setShowBoardForm(false)}
          className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm">Cancel</button>
      </div>
    </form>
  )}

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {board.map((member) => (
      <div key={member.id} className="text-center">
        <div className="w-full aspect-3/4 rounded-lg overflow-hidden mb-2 bg-gray-100">
          {member.image ? (
            <img src={member.image} alt={member.name}
              className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl text-gray-300">👤</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className="w-5 h-5 rounded-full bg-ngali-orange text-white text-xs flex items-center justify-center font-bold">
            {member.order}
          </span>
          <p className="font-medium text-gray-800 text-xs">{member.name}</p>
        </div>
        <p className="text-gray-500 text-xs">{member.role}</p>
        <div className="flex justify-center gap-2 mt-1">
          <button onClick={() => {
            setEditingBoardMember(member)
            setBoardForm({ name: member.name, role: member.role, image: member.image ?? '', order: member.order, cv:member.cv })
            setShowBoardForm(true)
          }} className="text-blue-600 text-xs hover:underline">Edit</button>
          <button onClick={() => handleDeleteBoardMember(member.id)}
            className="text-red-500 text-xs hover:underline">Delete</button>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Team Members */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Leadership Team ({team.length})</h2>
            <button onClick={() => { setEditingMember(null); setTeamForm({ name: '', role: '', image: '', order: 0, cv: '' }); setShowTeamForm(true) }}
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
  <label className="block text-sm font-medium text-gray-700 mb-1">CV / Experience</label>
  <textarea
    value={teamForm.cv}
    onChange={(e) => setTeamForm({ ...teamForm, cv: e.target.value })}
    rows={6}
    placeholder="Education, work experience, achievements..."
    className="w-full border border-gray-300 rounded px-3 py-2"
  />
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
                <span className="w-6 h-6 rounded-full bg-ngali-orange text-white text-xs flex items-center justify-center font-bold shrink-0">
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
            setTeamForm({ name: member.name, role: member.role, image: member.image ?? '', order: member.order, cv: member.cv })
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
    </AdminLayout>
  )
}