import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

const API = import.meta.env.VITE_API_URL

export default function AdminContacts() {
  const { token } = useAuth()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  const [replySuccess, setReplySuccess] = useState<number | null>(null)
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    const res = await fetch(`${API}/api/admin/contacts`, {
      headers: authHeaders,
    })
    const data = await res.json()
    setMessages(data)
    setLoading(false)
  }

  async function handleReply(id: number) {
  setReplying(true)
  const res = await fetch(`${API}/api/admin/contacts/${id}/reply`, {
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
    if (!confirm('Delete this message?')) return
    await fetch(`${API}/api/admin/contacts/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    fetchMessages()
  }

  return (
    <AdminLayout>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          All Messages ({messages.length})
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
  <div key={msg.id} className="bg-white border border-gray-200 rounded-lg p-5">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="font-medium text-gray-800">{msg.name}</p>
        <p className="text-sm text-gray-500">{msg.email}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(msg.createdAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>
      <div className="flex gap-2">
       <button
        onClick={() => {
        setReplyingTo(replyingTo === msg.id ? null : msg.id)
        setReplyText('')
         }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ngali-orange text-white hover:opacity-90 text-xs font-medium transition">
        ↩️ {replyingTo === msg.id ? 'Cancel' : 'Reply'}
       </button>
       <button onClick={() => handleDelete(msg.id)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition">
         🗑️ Delete
       </button>
      </div>
    </div>

    <p className="text-gray-700 text-sm bg-gray-50 rounded p-3 mb-3">
      {msg.message}
    </p>

    {replySuccess === msg.id && (
      <p className="text-green-600 text-sm mb-3">✓ Reply sent successfully</p>
    )}

    {replyingTo === msg.id && (
      <div className="border-t border-gray-100 pt-3">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Reply to {msg.name} ({msg.email}):
        </p>
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          placeholder="Type your reply..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm mb-2"
        />
        <button
          onClick={() => handleReply(msg.id)}
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