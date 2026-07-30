import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../components/AdminLayout'
import Spinner from '../../components/admin/Spinner'
import Pagination from '../../components/admin/Pagination'
import { useAuth } from '../../context/AuthContext'

interface JobApplication {
  id: number
  jobId: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  nationality?: string
  citizenship?: string
  coverLetter?: string
  cvUrl?: string
  coverLetterUrl?: string
  degreeUrl?: string
  certificatesUrl?: string
  createdAt: string
}

const API = import.meta.env.VITE_API_URL
const ITEMS_PER_PAGE = 8

export default function AdminApplications() {
  const { token } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)
  const [replySuccess, setReplySuccess] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Filters
  const [search, setSearch] = useState('')
  const [jobFilter, setJobFilter] = useState('All')
  const [genderFilter, setGenderFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => { fetchApplications() }, [])

  async function fetchApplications() {
    setLoading(true)
    const res = await fetch(`${API}/api/admin/applications`, { headers: authHeaders })
    const data = await res.json()
    setApplications(data)
    setLoading(false)
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    await fetch(`${API}/api/admin/applications/${id}`, { method: 'DELETE', headers: authHeaders })
    setDeleteConfirm(null)
    setDeleting(null)
    showToast('Application deleted', 'error')
    fetchApplications()
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
      showToast('Reply sent successfully')
    }
    setReplying(false)
  }

  // Unique job IDs for filter dropdown
  const jobIds = ['All', ...Array.from(new Set(applications.map(a => a.jobId)))]
  const genders = ['All', ...Array.from(new Set(applications.map(a => a.gender ?? '').filter(Boolean)))]

  // Filter + search
  const filtered = applications.filter(app => {
    const name = `${app.firstName ?? ''} ${app.lastName ?? ''}`.toLowerCase()
    const matchesSearch = name.includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.jobId.toLowerCase().includes(search.toLowerCase())
    const matchesJob = jobFilter === 'All' || app.jobId === jobFilter
    const matchesGender = genderFilter === 'All' || app.gender === genderFilter
    return matchesSearch && matchesJob && matchesGender
  })

  useEffect(() => { setCurrentPage(1) }, [search, jobFilter, genderFilter])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Skeleton
  function ApplicationSkeleton() {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded-lg" />
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
          </div>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {applications.length} total applications across {jobIds.length - 1} positions
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {jobIds.filter(j => j !== 'All').map(jobId => (
            <button
              key={jobId}
              onClick={() => setJobFilter(jobFilter === jobId ? 'All' : jobId)}
              className={`px-4 py-3 rounded-xl border text-left transition ${
                jobFilter === jobId
                  ? 'bg-ngali-orange border-ngali-orange text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-ngali-orange hover:shadow-sm'
              }`}
            >
              <p className="text-xs font-medium truncate">{jobId}</p>
              <p className="text-lg font-bold mt-0.5">
                {applications.filter(a => a.jobId === jobId).length}
              </p>
            </button>
          ))}
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-4"
        >
          <div className="relative flex-1 min-w-200px">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email or job..."
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
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange shadow-sm transition"
          >
            {jobIds.map(j => (
              <option key={j} value={j}>{j === 'All' ? 'All positions' : j}</option>
            ))}
          </select>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange shadow-sm transition"
          >
            {genders.map(g => (
              <option key={g} value={g}>{g === 'All' ? 'All genders' : g}</option>
            ))}
          </select>

          {(search || jobFilter !== 'All' || genderFilter !== 'All') && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => { setSearch(''); setJobFilter('All'); setGenderFilter('All') }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-500 hover:text-gray-700 shadow-sm text-sm transition"
            >
              Clear all
            </motion.button>
          )}
        </motion.div>

        {/* Results count */}
        {(search || jobFilter !== 'All' || genderFilter !== 'All') && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 mb-4"
          >
            Showing <span className="font-medium text-ngali-orange">{filtered.length}</span> of {applications.length} applications
          </motion.p>
        )}

        {/* Skeletons */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <ApplicationSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500 text-lg font-medium">
              {search || jobFilter !== 'All' ? 'No applications match your filters' : 'No applications yet'}
            </p>
            {(search || jobFilter !== 'All') && (
              <button
                onClick={() => { setSearch(''); setJobFilter('All'); setGenderFilter('All') }}
                className="mt-4 text-ngali-orange hover:underline text-sm"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}

        {/* Applications list */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {paginated.map((app, index) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-ngali-orange hover:shadow-sm transition-all"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-ngali-orange/10 text-ngali-orange flex items-center justify-center font-bold text-sm shrink-0">
                              {(app.firstName ?? app.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {app.firstName && app.lastName
                                  ? `${app.firstName} ${app.lastName}`
                                  : app.email}
                              </p>
                              <p className="text-sm text-gray-500">
                                {app.email}{app.phone ? ` · ${app.phone}` : ''}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-ngali-orange font-medium ml-10">
                            Applied for: {app.jobId}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-400 mt-1 ml-10">
                            {app.gender && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{app.gender}</span>}
                            {app.nationality && <span className="bg-gray-100 px-2 py-0.5 rounded-full">{app.nationality}</span>}
                            {app.dateOfBirth && <span className="bg-gray-100 px-2 py-0.5 rounded-full">DOB: {app.dateOfBirth}</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          <p className="text-xs text-gray-400 mr-2">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                          <button
                            onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium transition"
                          >
                            👁️ {expanded === app.id ? 'Hide' : 'Details'}
                          </button>
                          <button
                            onClick={() => { setReplyingTo(replyingTo === app.id ? null : app.id); setReplyText('') }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ngali-orange text-white hover:opacity-90 text-xs font-medium transition"
                          >
                            ↩️ {replyingTo === app.id ? 'Cancel' : 'Reply'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(app.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-medium transition"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      <AnimatePresence>
                        {expanded === app.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-100 space-y-3"
                          >
                            {/* Documents */}
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Documents</p>
                              <div className="flex flex-wrap gap-2">
                                {app.cvUrl && (
                                  <a href={app.cvUrl} target="_blank"
                                    className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
                                    📄 View CV
                                  </a>
                                )}
                                {app.degreeUrl && (
                                  <a href={app.degreeUrl} target="_blank"
                                    className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition">
                                    🎓 Degree
                                  </a>
                                )}
                                {app.coverLetterUrl && (
                                  <a href={app.coverLetterUrl} target="_blank"
                                    className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 transition">
                                    📝 Cover Letter
                                  </a>
                                )}
                                {app.certificatesUrl && (
                                  <a href={app.certificatesUrl} target="_blank"
                                    className="inline-flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-100 transition">
                                    🏆 Certificates
                                  </a>
                                )}
                                {!app.cvUrl && !app.degreeUrl && !app.coverLetterUrl && !app.certificatesUrl && (
                                  <p className="text-xs text-gray-400">No documents uploaded</p>
                                )}
                              </div>
                            </div>

                            {/* Cover letter text */}
                            {app.coverLetter && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Cover Letter</p>
                                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{app.coverLetter}</p>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Reply success */}
                      {replySuccess === app.id && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-green-600 text-sm mt-3 flex items-center gap-1"
                        >
                          ✓ Reply sent successfully
                        </motion.p>
                      )}

                      {/* Reply form */}
                      <AnimatePresence>
                        {replyingTo === app.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                          >
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Reply to {app.firstName ?? app.email} ({app.email}):
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
                                onClick={() => handleReply(app.id)}
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
                        {deleteConfirm === app.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-gray-100"
                          >
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                              <p className="text-red-600 text-sm mb-3">
                                Delete application from <strong>{app.firstName ?? app.email}</strong>? Cannot be undone.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDelete(app.id)}
                                  disabled={deleting === app.id}
                                  className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-60"
                                >
                                  {deleting === app.id && <Spinner size="sm" />}
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