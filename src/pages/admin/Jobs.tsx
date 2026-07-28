import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import Spinner from '../../components/admin/Spinner'

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  deadline: string
  requiredFields: string
}

const API = import.meta.env.VITE_API_URL

const ALL_FIELDS = [
  { key: 'firstName', label: 'First Name', required: true, group: 'Personal' },
  { key: 'lastName', label: 'Last Name', required: true, group: 'Personal' },
  { key: 'email', label: 'Email Address', required: true, group: 'Personal' },
  { key: 'phone', label: 'Phone Number', required: false, group: 'Personal' },
  { key: 'dateOfBirth', label: 'Date of Birth', required: false, group: 'Personal' },
  { key: 'gender', label: 'Gender', required: false, group: 'Personal' },
  { key: 'nationality', label: 'Nationality', required: false, group: 'Personal' },
  { key: 'citizenship', label: 'Citizenship', required: false, group: 'Personal' },
  { key: 'cvUrl', label: 'CV Upload', required: false, group: 'Documents' },
  { key: 'coverLetterUrl', label: 'Cover Letter Upload', required: false, group: 'Documents' },
  { key: 'degreeUrl', label: 'Academic Degree', required: false, group: 'Documents' },
  { key: 'certificatesUrl', label: 'Other Certificates', required: false, group: 'Documents' },
]

const ALWAYS_REQUIRED = ['firstName', 'lastName', 'email']

const DEFAULT_FIELDS = 'firstName,lastName,email,phone,dateOfBirth,gender,nationality,citizenship,cvUrl,coverLetterUrl,degreeUrl'

export default function AdminJobs() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<JobOpening | null>(null)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [form, setForm] = useState({
    id: '', title: '', department: '', location: '',
    type: '', description: '', deadline: '',
    requiredFields: DEFAULT_FIELDS,
  })

  const [selectedFields, setSelectedFields] = useState<string[]>(DEFAULT_FIELDS.split(','))

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => { fetchJobs() }, [])

  async function fetchJobs() {
    setLoading(true)
    setLoadError(false)
    try {
      const res = await fetch(`${API}/api/jobs`)
      if (!res.ok) throw new Error('Failed to load jobs')
      const data = await res.json()
      setJobs(data)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }

  function toggleField(key: string) {
    if (ALWAYS_REQUIRED.includes(key)) return
    setSelectedFields(prev =>
      prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const requiredFields = selectedFields.join(',')

    try {
      if (editing) {
        const res = await fetch(`${API}/api/jobs/${editing.id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ ...form, requiredFields }),
        })
        const data = await res.json()
        if (!res.ok) {
          showToast(data.error ?? 'Failed to update job', 'error')
          return
        }
        showToast('Job updated successfully')
      } else {
        const res = await fetch(`${API}/api/jobs`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ ...form, requiredFields }),
        })
        const data = await res.json()
        if (!res.ok) {
          showToast(data.error ?? 'Failed to post job', 'error')
          return
        }
        showToast('Job posted successfully')
      }
      setShowForm(false)
      setEditing(null)
      setForm({ id: '', title: '', department: '', location: '', type: '', description: '', deadline: '', requiredFields: DEFAULT_FIELDS })
      setSelectedFields(DEFAULT_FIELDS.split(','))
      fetchJobs()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(`${API}/api/jobs/${id}`, { method: 'DELETE', headers: authHeaders })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        showToast(data.error ?? 'Failed to delete job', 'error')
        return
      }
      setDeleteConfirm(null)
      showToast('Job deleted', 'error')
      fetchJobs()
    } finally {
      setDeleting(null)
    }
  }

  function handleEdit(job: JobOpening) {
    setEditing(job)
    setForm({ ...job })
    setSelectedFields(job.requiredFields ? job.requiredFields.split(',') : DEFAULT_FIELDS.split(','))
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.department.toLowerCase().includes(search.toLowerCase())
  )

  const groupedFields = ALL_FIELDS.reduce((acc, field) => {
    if (!acc[field.group]) acc[field.group] = []
    acc[field.group].push(field)
    return acc
  }, {} as Record<string, typeof ALL_FIELDS>)

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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Openings</h1>
            <p className="text-gray-500 mt-1 text-sm">{jobs.length} positions posted</p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ id: '', title: '', department: '', location: '', type: '', description: '', deadline: '', requiredFields: DEFAULT_FIELDS }); setSelectedFields(DEFAULT_FIELDS.split(',')); setShowForm(true) }}
            className="flex items-center gap-2 bg-ngali-orange text-white px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition shadow-sm">
            + Post job
          </button>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }} className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Search jobs..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange shadow-sm transition" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {editing ? `Edit — ${editing.title}` : 'Post New Job'}
                </h3>
                <button onClick={() => { setShowForm(false); setEditing(null) }}
                  className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug) *</label>
                    <input type="text" value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      placeholder="e.g. senior-developer"
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input type="text" value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <input type="text" value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input type="text" value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange transition">
                      <option value="">Select type</option>
                      {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
                    <input type="date" value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required rows={4}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange resize-none transition" />
                </div>

                {/* Application fields selector */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">Application Form Fields</p>
                      <p className="text-xs text-gray-500 mt-0.5">Choose what information candidates must provide</p>
                    </div>
                    <span className="text-xs bg-ngali-orange/10 text-ngali-orange px-2 py-1 rounded-full font-medium">
                      {selectedFields.length} fields selected
                    </span>
                  </div>

                  {Object.entries(groupedFields).map(([group, fields]) => (
                    <div key={group} className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{group}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {fields.map(field => {
                          const isAlwaysRequired = ALWAYS_REQUIRED.includes(field.key)
                          const isSelected = selectedFields.includes(field.key)
                          return (
                            <label
                              key={field.key}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition text-sm ${
                                isAlwaysRequired
                                  ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-ngali-orange/10 border-ngali-orange text-ngali-orange'
                                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleField(field.key)}
                                disabled={isAlwaysRequired}
                                className="accent-ngali-orange"
                              />
                              <span>{field.label}</span>
                              {isAlwaysRequired && (
                                <span className="text-xs text-gray-400 ml-auto">always</span>
                              )}
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 bg-ngali-orange text-white px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition disabled:opacity-60">
                    {submitting && <Spinner size="sm" />}
                    {editing ? 'Save changes' : 'Post job'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditing(null) }}
                    className="bg-gray-100 text-gray-600 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Jobs list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-gray-500 text-lg font-medium">Couldn't load job openings</p>
            <button onClick={fetchJobs}
              className="mt-4 text-ngali-orange hover:underline text-sm">Try again</button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-5xl mb-4">💼</p>
            <p className="text-gray-500 text-lg font-medium">
              {search ? 'No jobs match your search' : 'No jobs posted yet'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-ngali-orange hover:shadow-sm transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <span className="text-xs bg-ngali-orange/10 text-ngali-orange px-2 py-0.5 rounded-full font-medium">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{job.department} · {job.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    {job.requiredFields && (
                      <p className="text-xs text-gray-400 mt-1">
                        {job.requiredFields.split(',').length} fields required from applicants
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(job)}
                      className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition text-sm"
                      title="Edit">✏️</button>
                    <button onClick={() => setDeleteConfirm(job.id)}
                      className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition text-sm"
                      title="Delete">🗑️</button>
                  </div>
                </div>

                <AnimatePresence>
                  {deleteConfirm === job.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-gray-100"
                    >
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                        <p className="text-red-600 text-sm mb-3">Delete <strong>{job.title}</strong>? Cannot be undone.</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDelete(job.id)} disabled={deleting === job.id}
                            className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-60">
                            {deleting === job.id && <Spinner size="sm" />}
                            Yes, delete
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="bg-white text-gray-600 px-3 py-1.5 rounded-lg text-xs border border-gray-200 hover:bg-gray-50 transition">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
