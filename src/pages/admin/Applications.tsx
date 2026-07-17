import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

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
  const { token } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  const [replySuccess, setReplySuccess] = useState<number | null>(null)

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

  async function handleReply(id: number) {
  setReplying(true)
  const res = await fetch(`${API}/api/admin/applications/${id}/reply`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ replyMessage: replyText }),
  })
  if (res.ok) {
    setReplySuccess(id)
    setReplyingTo(null)
    setReplyText('')
  }
  setReplying(false)
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
    <AdminLayout>

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
        <button
          onClick={() => {
            setReplyingTo(replyingTo === app.id ? null : app.id)
            setReplyText('')
          }}
          className="text-ngali-orange text-sm hover:underline">
          {replyingTo === app.id ? 'Cancel' : 'Reply'}
        </button>
        <button onClick={() => handleDelete(app.id)}
          className="text-red-500 text-sm hover:underline">
          Delete
        </button>
      </div>
    </div>

    {expanded === app.id && (
      <div className="mt-3 bg-gray-50 rounded p-3 text-sm text-gray-700 mb-3">
        <p className="font-medium text-gray-600 mb-1">Cover Letter:</p>
        {app.coverLetter}
      </div>
    )}

    {replySuccess === app.id && (
      <p className="text-green-600 text-sm mb-3">✓ Reply sent successfully</p>
    )}

    {replyingTo === app.id && (
      <div className="border-t border-gray-100 pt-3 mt-3">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Reply to {app.name} ({app.email}):
        </p>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          placeholder="Type your reply to the applicant..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
        />
        <button
          onClick={() => handleReply(app.id)}
          disabled={replying || !replyText.trim()}
          className="bg-ngali-orange text-white px-4 py-2 rounded text-sm hover:opacity-90 disabled:opacity-50"
        >
          {replying ? 'Sending...' : 'Send Reply'}
        </button>
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