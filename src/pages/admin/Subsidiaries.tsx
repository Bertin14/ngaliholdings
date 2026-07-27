import { useState, useEffect} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import ImageUpload from '../../components/ImageUpload'
import SkeletonCard from '../../components/admin/SkeletonCard'
import Spinner from '../../components/admin/Spinner'
import Pagination from '../../components/admin/Pagination'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
  sector?: string
}

const API = import.meta.env.VITE_API_URL
const ITEMS_PER_PAGE = 6

const SECTORS = ['Mining', 'Healthcare', 'Aerospace', 'Industrial', 'Energy', 'Technology']

const sectorColors: Record<string, string> = {
  Mining: 'bg-amber-100 text-amber-700',
  Healthcare: 'bg-teal-100 text-teal-700',
  Aerospace: 'bg-blue-100 text-blue-700',
  Industrial: 'bg-orange-100 text-orange-700',
  Energy: 'bg-green-100 text-green-700',
  Technology: 'bg-purple-100 text-purple-700',
}

export default function AdminSubsidiaries() {
  const { token } = useAuth()
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Subsidiary | null>(null)
  const [form, setForm] = useState({ id: '', name: '', description: '', image: '', sector: '' })
  const [search, setSearch] = useState('')
  const [sectorFilter, setSectorFilter] = useState('All')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => { fetchSubsidiaries() }, [])

  async function fetchSubsidiaries() {
    setLoading(true)
    const res = await fetch(`${API}/api/subsidiaries`)
    const data = await res.json()
    setSubsidiaries(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    if (editing) {
      await fetch(`${API}/api/subsidiaries/${editing.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ name: form.name, description: form.description, image: form.image, sector: form.sector }),
      })
      showToast(`${form.name} updated successfully`)
    } else {
      await fetch(`${API}/api/subsidiaries`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      })
      showToast(`${form.name} added successfully`)
    }
    setSubmitting(false)
    setShowForm(false)
    setEditing(null)
    setForm({ id: '', name: '', description: '', image: '', sector: '' })
    fetchSubsidiaries()
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await fetch(`${API}/api/subsidiaries/${id}`, { method: 'DELETE', headers: authHeaders })
    setDeleteConfirm(null)
    setDeleting(null)
    showToast('Subsidiary deleted', 'error')
    fetchSubsidiaries()
  }

  function handleEdit(sub: Subsidiary) {
    setEditing(sub)
    setForm({ id: sub.id, name: sub.name, description: sub.description, image: sub.image, sector: sub.sector ?? '' })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filter + search
  const filtered = subsidiaries.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.description.toLowerCase().includes(search.toLowerCase())
    const matchesSector = sectorFilter === 'All' || (sub.sector ?? '') === sectorFilter
    return matchesSearch && matchesSector
  })

  // Reset to page 1 on filter change
  useEffect(() => { setCurrentPage(1) }, [search, sectorFilter])

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const sectors = ['All', ...Array.from(new Set(subsidiaries.map(s => s.sector ?? '').filter(Boolean)))]

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 px-8 py-8">

        {/* Toast notification */}
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
          className="flex justify-between items-start mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subsidiaries</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {subsidiaries.length} companies · {sectors.length - 1} sectors
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ id: '', name: '', description: '', image: '', sector: '' }); setShowForm(true) }}
            className="flex items-center gap-2 bg-ngali-orange text-white px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition shadow-sm"
          >
            + Add subsidiary
          </button>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-3 mb-6"
        >
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search subsidiaries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange shadow-sm transition"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange shadow-sm transition"
          >
            {sectors.map(s => <option key={s} value={s}>{s === 'All' ? 'All sectors' : s}</option>)}
          </select>
          {(search || sectorFilter !== 'All') && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => { setSearch(''); setSectorFilter('All') }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-500 hover:text-gray-700 shadow-sm text-sm transition"
            >
              Clear filters
            </motion.button>
          )}
        </motion.div>

        {/* Active filters indicator */}
        {(search || sectorFilter !== 'All') && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-gray-500 mb-4"
          >
            Showing <span className="font-medium text-ngali-orange">{filtered.length}</span> of {subsidiaries.length} subsidiaries
            {search && <span> matching "<strong>{search}</strong>"</span>}
            {sectorFilter !== 'All' && <span> in <strong>{sectorFilter}</strong></span>}
          </motion.p>
        )}

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {editing ? `Edit — ${editing.name}` : 'Add New Subsidiary'}
                </h3>
                <button onClick={() => { setShowForm(false); setEditing(null) }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug) *</label>
                    <input type="text" value={form.id}
                      onChange={(e) => setForm({ ...form, id: e.target.value })}
                      placeholder="e.g. ngali-energy"
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input type="text" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                    <select value={form.sector}
                      onChange={(e) => setForm({ ...form, sector: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange transition">
                      <option value="">Select sector</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange resize-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <ImageUpload
                    folder="subsidiaries"
                    currentImage={form.image}
                    onUpload={(url) => setForm({ ...form, image: url })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 bg-ngali-orange text-white px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition disabled:opacity-60">
                    {submitting && <Spinner size="sm" />}
                    {editing ? 'Save changes' : 'Add subsidiary'}
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

        {/* Skeleton loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-5xl mb-4">🏢</p>
            <p className="text-gray-500 text-lg font-medium">No subsidiaries found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || sectorFilter !== 'All' ? 'Try adjusting your filters' : 'Add your first subsidiary to get started'}
            </p>
            {(search || sectorFilter !== 'All') && (
              <button onClick={() => { setSearch(''); setSectorFilter('All') }}
                className="mt-4 text-ngali-orange hover:underline text-sm">Clear filters</button>
            )}
          </motion.div>
        )}

        {/* Cards grid */}
        {!loading && filtered.length > 0 && (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {paginated.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-ngali-orange hover:shadow-md transition-all duration-200 group"
                  >
                    {/* Image */}
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      {sub.image ? (
                        <img src={sub.image} alt={sub.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl text-gray-300">🏢</span>
                        </div>
                      )}
                      {/* Sector badge */}
                      {sub.sector && (
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${sectorColors[sub.sector] ?? 'bg-gray-100 text-gray-600'}`}>
                          {sub.sector}
                        </span>
                      )}
                      {/* Action buttons — visible on hover */}
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEdit(sub)}
                          className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 shadow-sm transition text-sm"
                          title="Edit">
                          ✏️
                        </button>
                        <button onClick={() => setDeleteConfirm(sub.id)}
                          className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 shadow-sm transition text-sm"
                          title="Delete">
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{sub.name}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-2">{sub.description}</p>
                      <p className="text-gray-300 text-xs font-mono">{sub.id}</p>
                    </div>

                    {/* Delete confirmation — inline */}
                    <AnimatePresence>
                      {deleteConfirm === sub.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <p className="text-red-600 text-sm mb-3">
                              Delete <strong>{sub.name}</strong>? This cannot be undone.
                            </p>
                            <div className="flex gap-2">
                              <button onClick={() => handleDelete(sub.id)}
                                disabled={deleting === sub.id}
                                className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-60">
                                {deleting === sub.id && <Spinner size="sm" />}
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
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
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