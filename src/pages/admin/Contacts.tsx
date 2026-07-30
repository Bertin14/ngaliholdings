import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../components/AdminLayout'
import Spinner from '../../components/admin/Spinner'
import Pagination from '../../components/admin/Pagination'
import { useAuth } from '../../context/AuthContext'

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  createdAt: string
}

const API = import.meta.env.VITE_API_URL
const ITEMS_PER_PAGE = 8

export default function AdminContacts() {
  const { token } = useAuth()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  const [replySuccess, setReplySuccess] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => { fetchMessages() }, [])

  async function fetchMessages() {
    setLoading(true)
    const res = await fetch(`${API}/api/admin/contacts`, { headers: authHeaders })
    const data = await res.json()
    setMessages(data)
    setLoading(false)
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    await fetch(`${API}/api/admin/contacts/${id}`, { method: 'DELETE', headers: authHeaders })
    setDeleteConfirm(null)
    setDeleting(null)
    showToast('Message deleted', 'error')
    fetchMessages()
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
      showToast('Reply sent successfully')
    }
    setReplying(false)
  }

  function getDateRange(filter: string) {
    const now = new Date()
    if (filter === 'Today') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return { start, end: now }
    }
    if (filter === 'This week') {
      const start = new Date(now)
      start.setDate(now.getDate() - 7)
      return { start, end: now }
    }
    if (filter === 'This month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start, end: now }
    }
    return null
  }

  const filtered = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.message.toLowerCase().includes(search.toLowerCase())
    const range = getDateRange(dateFilter)
    const matchesDate = !range || (new Date(msg.createdAt) >= range.start && new Date(msg.createdAt) <= range.end)
    return matchesSearch && matchesDate
  })

  useEffect(() => { setCurrentPage(1) }, [search, dateFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  function MessageSkeleton() {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
        <div className="flex justify-between mb-3">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-48" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="h-12 bg-gray-100 rounded-lg" />
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-8 py-8">

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-6 left-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
                toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {toast.type === 'success' ? '✓' : '✕'} {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 mt-1 text-sm">{messages.length} total messages received</p>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: 'Today', count: messages.filter(m => new Date(m.createdAt).toDateString() === new Date().toDateString()).length },
            { label: 'This week', count: messages.filter(m => new Date(m.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length },
            { label: 'This month', count: messages.filter(m => new Date(m.createdAt).getMonth() === new Date().getMonth()).length },
          ].map(stat => (
            <button
              key={stat.label}
              onClick={() => setDateFilter(dateFilter === stat.label ? 'All' : stat.label)}
              className={`px-4 py-3 rounded-xl border text-left transition ${
                dateFilter === stat.label
                  ? 'bg-ngali-orange border-ngali-orange text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-ngali-orange hover:shadow-sm'
              }`}
            >
              <p className="text-xs font-medium">{stat.label}</p>
              <p className="text-2xl font-bold mt-0.5">{stat.count}</p>
            </button>
          ))}
        </motion.div>

        {/* Search + filters */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-4"
        >
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange shadow-sm transition"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange shadow-sm transition"
          >
            {['All', 'Today', 'This week', 'This month'].map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All time' : d}</option>
            ))}
          </select>

          {(search || dateFilter !== 'All') && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => { setSearch(''); setDateFilter('All') }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-500 hover:text-gray-700 shadow-sm text-sm transition"
            >
              Clear
            </motion.button>
          )}
        </motion.div>

        {/* Results count */}
        {(search || dateFilter !== 'All') && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 mb-4"
          >
            <span className="font-medium text-ngali-orange">{filtered.length}</span> of {messages.length} messages
          </motion.p>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <MessageSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4">✉️</p>
            <p className="text-gray-500 text-lg font-medium">
              {search || dateFilter !== 'All' ? 'No messages match your filters' : 'No messages yet'}
            </p>
            {(search || dateFilter !== 'All') && (
              <button
                onClick={() => { setSearch(''); setDateFilter('All') }}
                className="mt-4 text-ngali-orange hover:underline text-sm"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* Messages list */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {paginated.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-ngali-orange hover:shadow-sm transition-all"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{msg.name}</p>
                            <p className="text-sm text-gray-500">{msg.email}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => { setReplyingTo(replyingTo === msg.id ? null : msg.id); setReplyText('') }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ngali-orange text-white hover:opacity-90 text-xs font-medium transition"
                          >
                            ↩️ {replyingTo === msg.id ? 'Cancel' : 'Reply'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(msg.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {/* Message bubble */}
                      <div className="bg-gray-50 rounded-xl p-4 ml-12">
                        <p className="text-gray-700 text-sm leading-relaxed">{msg.message}</p>
                      </div>

                      {/* Reply success */}
                      {replySuccess === msg.id && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-600 text-sm mt-3 ml-12 flex items-center gap-1"
                        >
                          ✓ Reply sent successfully
                        </motion.p>
                      )}

                      {/* Reply form */}
                      <AnimatePresence>
                        {replyingTo === msg.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 ml-12"
                          >
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Reply to {msg.name} ({msg.email}):
                            </p>
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={3}
                              placeholder="Type your reply..."
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ngali-orange resize-none transition"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleReply(msg.id)}
                                disabled={replying || !replyText.trim()}
                                className="flex items-center gap-2 bg-ngali-orange text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50 transition"
                              >
                                {replying && <Spinner size="sm" />}
                                Send Reply
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Delete confirmation */}
                      <AnimatePresence>
                        {deleteConfirm === msg.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                          >
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <p className="text-red-600 text-sm mb-3">
                                Delete message from <strong>{msg.name}</strong>? Cannot be undone.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDelete(msg.id)}
                                  disabled={deleting === msg.id}
                                  className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-60"
                                >
                                  {deleting === msg.id && <Spinner size="sm" />}
                                  Yes, delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="bg-white text-gray-600 px-3 py-1.5 rounded-lg text-xs border border-gray-200 hover:bg-gray-50 transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </>
        )}
      </div>
    </AdminLayout>
  )
}