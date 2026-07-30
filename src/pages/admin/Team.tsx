import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import ImageUpload from '../../components/ImageUpload'
import AdminLayout from '../../components/AdminLayout'

interface TeamMember {
  id: number
  name: string
  role: string
  image?: string
  cv: string
  order: number
}

interface BoardMember {
  id: number
  name: string
  role: string
  image?: string
  cv: string
  order: number
}

const API = import.meta.env.VITE_API_URL

export default function AdminTeam() {
  const { token } = useAuth()
  const [team, setTeam] = useState<TeamMember[]>([])
  const [board, setBoard] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)

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
    const [teamData, boardData] = await Promise.all([
      fetch(`${API}/api/team`).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/board`).then(r => r.json()).catch(() => []),
    ])
    setTeam(teamData ?? [])
    setBoard(boardData ?? [])
    setLoading(false)
  }

  async function handleBoardSubmit(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch(
      editingBoardMember
        ? `${API}/api/board/${editingBoardMember.id}`
        : `${API}/api/board`,
      {
        method: editingBoardMember ? 'PUT' : 'POST',
        headers: authHeaders,
        body: JSON.stringify(boardForm),
      }
    )
    const data = await res.json()

    if (!res.ok) {
      alert(data.error)
      return
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

    const res = await fetch(
      editingMember
        ? `${API}/api/team/${editingMember.id}`
        : `${API}/api/team`,
      {
        method: editingMember ? 'PUT' : 'POST',
        headers: authHeaders,
        body: JSON.stringify(teamForm),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      alert(data.error) // shows "Order number X is already taken by Y"
      return
    }

    setShowTeamForm(false)
    setEditingMember(null)
    setTeamForm({ name: '', role: '', image: '', order: 0, cv: '' })
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

        {/* Board Members */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-800 text-lg">Board of Directors ({board.length})</h2>
            <button onClick={() => { setEditingBoardMember(null); setBoardForm({ name: '', role: '', image: '', order: 0, cv: '' }); setShowBoardForm(true) }}
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
                    setBoardForm({ name: member.name, role: member.role, image: member.image ?? '', order: member.order, cv: member.cv })
                    setShowBoardForm(true)
                  }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition">✏️ Edit</button>
                  <button onClick={() => handleDeleteBoardMember(member.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition">🗑️ Delete</button>
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
                  }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium transition">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDeleteMember(member.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
