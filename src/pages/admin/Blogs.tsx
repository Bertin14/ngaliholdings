import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import ImageUpload from '../../components/ImageUpload'
import SkeletonCard from '../../components/admin/SkeletonCard'
import Spinner from '../../components/admin/Spinner'
import Pagination from '../../components/admin/Pagination'

interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  content: string
  image: string
}

const API = import.meta.env.VITE_API_URL
const ITEMS_PER_PAGE = 6
const CATEGORIES = ['Community', 'Company news', 'Subsidiaries', 'Investment', 'Technology', 'Other']

const categoryColors: Record<string, string> = {
  Community: 'bg-green-100 text-green-700',
  'Company news': 'bg-blue-100 text-blue-700',
  Subsidiaries: 'bg-orange-100 text-orange-700',
  Investment: 'bg-purple-100 text-purple-700',
  Technology: 'bg-cyan-100 text-cyan-700',
  Other: 'bg-gray-100 text-gray-600',
}

export default function AdminBlogs() {
  const { token } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ id: '', title: '', date: '', category: '', excerpt: '', content: '', image: '' })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
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

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    setLoading(true)
    const res = await fetch(`${API}/api/blogs`)
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    if (editing) {
      await fetch(`${API}/api/blogs/${editing.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ title: form.title, date: form.date, category: form.category, excerpt: form.excerpt, content: form.content, image: form.image }),
      })
      showToast('Post updated successfully')
    } else {
      await fetch(`${API}/api/blogs`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      })
      showToast('Post published successfully')
    }
    setSubmitting(false)
    setShowForm(false)
    setEditing(null)
    setForm({ id: '', title: '', date: '', category: '', excerpt: '', content: '', image: '' })
    fetchPosts()
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await fetch(`${API}/api/blogs/${id}`, { method: 'DELETE', headers: authHeaders })
    setDeleteConfirm(null)
    setDeleting(null)
    showToast('Post deleted', 'error')
    fetchPosts()
  }

  function handleEdit(post: BlogPost) {
    setEditing(post)
    setForm({ id: post.id, title: post.title, date: post.date, category: post.category, excerpt: post.excerpt, content: post.content, image: post.image })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const categories = ['All', ...CATEGORIES]
  const filtered = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  useEffect(() => { setCurrentPage(1) }, [search, categoryFilter])
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

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
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="text-gray-500 mt-1 text-sm">{posts.length} articles published</p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ id: '', title: '', date: '', category: '', excerpt: '', content: '', image: '' }); setShowForm(true) }}
            className="flex items-center gap-2 bg-ngali-orange text-white px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition shadow-sm">
            + New post
          </button>
        </motion.div>

        {/* Search + Filter */}
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input type="text" placeholder="Search posts..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange shadow-sm transition" />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
            )}
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange shadow-sm transition">
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All categories' : c}</option>)}
          </select>
          {(search || categoryFilter !== 'All') && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => { setSearch(''); setCategoryFilter('All') }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-500 hover:text-gray-700 shadow-sm text-sm transition">
              Clear
            </motion.button>
          )}
        </motion.div>

        {/* Results count */}
        {(search || categoryFilter !== 'All') && !loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm text-gray-500 mb-4">
            <span className="font-medium text-ngali-orange">{filtered.length}</span> of {posts.length} posts
            {search && <span> matching "<strong>{search}</strong>"</span>}
          </motion.p>
        )}

        {/* Form */}
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
                  {editing ? 'Edit Post' : 'New Blog Post'}
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
                      placeholder="e.g. my-post-title"
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input type="text" value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 focus:outline-none focus:border-ngali-orange transition">
                      <option value="">Select</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="text" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. June 12, 2025"
                    required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                  <textarea value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    required rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange resize-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Content *</label>
                  <textarea value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    required rows={5}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange resize-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <ImageUpload folder="blogs" currentImage={form.image}
                    onUpload={(url) => setForm({ ...form, image: url })} />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 bg-ngali-orange text-white px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition disabled:opacity-60">
                    {submitting && <Spinner size="sm" />}
                    {editing ? 'Save changes' : 'Publish post'}
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

        {/* Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-gray-500 text-lg font-medium">No posts found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search || categoryFilter !== 'All' ? 'Try adjusting your filters' : 'Publish your first post to get started'}
            </p>
            {(search || categoryFilter !== 'All') && (
              <button onClick={() => { setSearch(''); setCategoryFilter('All') }}
                className="mt-4 text-ngali-orange hover:underline text-sm">Clear filters</button>
            )}
          </motion.div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {paginated.map((post, index) => (
                  <motion.div key={post.id} layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-ngali-orange hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      {post.image ? (
                        <img src={post.image} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl text-gray-300">📝</span>
                        </div>
                      )}
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {post.category}
                      </span>
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => handleEdit(post)}
                          className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-blue-50 shadow-sm transition text-sm"
                          title="Edit">✏️</button>
                        <button onClick={() => setDeleteConfirm(post.id)}
                          className="w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center hover:bg-red-50 shadow-sm transition text-sm"
                          title="Delete">🗑️</button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{post.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-2">{post.excerpt}</p>
                      <p className="text-gray-400 text-xs">{post.date}</p>
                    </div>
                    <AnimatePresence>
                      {deleteConfirm === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-4 pb-4"
                        >
                          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                            <p className="text-red-600 text-sm mb-3">Delete this post? Cannot be undone.</p>
                            <div className="flex gap-2">
                              <button onClick={() => handleDelete(post.id)} disabled={deleting === post.id}
                                className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition disabled:opacity-60">
                                {deleting === post.id && <Spinner size="sm" />}
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