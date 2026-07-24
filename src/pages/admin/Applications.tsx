import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

interface JobApplication {
  id: number
  jobId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  citizenship: string
  coverLetter: string
  cvUrl?: string
  coverLetterUrl?: string
  degreeUrl?: string
  certificatesUrl?: string
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
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="font-medium text-gray-800">{app.firstName} {app.lastName}</p>
        <p className="text-sm text-gray-500">{app.email} · {app.phone}</p>
        <p className="text-xs text-ngali-orange mt-0.5">Applied for: {app.jobId}</p>
        <div className="flex gap-3 text-xs text-gray-400 mt-1">
          <span>{app.gender}</span>
          <span>·</span>
          <span>{app.nationality}</span>
          <span>·</span>
          <span>DOB: {app.dateOfBirth}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <p className="text-xs text-gray-400">
          {new Date(app.createdAt).toLocaleDateString()}
        </p>
       <div className="flex gap-2">
         <button onClick={() => setExpanded(expanded === app.id ? null : app.id)}
           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium transition">
           👁️ {expanded === app.id ? 'Hide' : 'Details'}
         </button>
          <button onClick={() => {
            setReplyingTo(replyingTo === app.id ? null : app.id)
            setReplyText('')
           }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ngali-orange text-white hover:opacity-90 text-xs font-medium transition">
            ↩️ {replyingTo === app.id ? 'Cancel' : 'Reply'}
          </button>
          <button onClick={() => handleDelete(app.id)}
           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition">
           🗑️ Delete
          </button>
       </div>
      </div>
    </div>

    {expanded === app.id && (
      <div className="mt-3 space-y-3">
        {/* Documents */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-600 uppercase mb-2">Documents</p>
          <div className="flex flex-wrap gap-2">
            {app.cvUrl && (
              <a href={app.cvUrl} target="_blank"
                className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100">
                📄 View CV
              </a>
            )}
            {app.degreeUrl && (
              <a href={app.degreeUrl} target="_blank"
                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100">
                🎓 View Degree
              </a>
            )}
            {app.coverLetterUrl && (
              <a href={app.coverLetterUrl} target="_blank"
                className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100">
                📝 Cover Letter Doc
              </a>
            )}
            {app.certificatesUrl && (
              <a href={app.certificatesUrl} target="_blank"
                className="text-xs bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-100">
                🏆 Certificates
              </a>
            )}
          </div>
        </div>

        {/* Cover letter text */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-600 uppercase mb-2">Cover Letter</p>
          <p className="text-sm text-gray-700">{app.coverLetter}</p>
        </div>
      </div>
    )}

    {replySuccess === app.id && (
      <p className="text-green-600 text-sm mt-3">✓ Reply sent successfully</p>
    )}

    {replyingTo === app.id && (
      <div className="border-t border-gray-100 pt-3 mt-3">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Reply to {app.firstName} {app.lastName} ({app.email}):
        </p>
        <textarea value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4} placeholder="Type your reply..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2" />
        <button onClick={() => handleReply(app.id)}
          disabled={replying || !replyText.trim()}
          className="bg-ngali-orange text-white px-4 py-2 rounded text-sm hover:opacity-90 disabled:opacity-50">
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