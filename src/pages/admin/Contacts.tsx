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
                  <button onClick={() => handleDelete(msg.id)}
                    className="text-red-500 text-sm hover:underline">
                    Delete
                  </button>
                </div>
                <p className="text-gray-700 text-sm bg-gray-50 rounded p-3">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      </AdminLayout>
  )
}