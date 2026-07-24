import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import AdminLayout from '../../components/AdminLayout'
import ImageUpload from '../../components/ImageUpload'

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

const CATEGORIES = ['Community', 'Company news', 'Subsidiaries', 'Investment', 'Technology', 'Other']

export default function AdminBlogs() {
  const { token } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ id: '', title: '', date: '', category: '', excerpt: '', content: '', image: '' })
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => { fetchPosts() }, [])

  async function fetchPosts() {
    const res = await fetch(`${API}/api/blogs`)
    const data = await res.json()
    setPosts(data)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (editing) {
      await fetch(`${API}/api/blogs/${editing.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ title: form.title, date: form.date, category: form.category, excerpt: form.excerpt, content: form.content, image: form.image }),
      })
    } else {
      await fetch(`${API}/api/blogs`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(form),
      })
    }
    setShowForm(false)
    setEditing(null)
    setForm({ id: '', title: '', date: '', category: '', excerpt: '', content: '', image: '' })
    fetchPosts()
  }

  async function handleDelete(id: string) {
    await fetch(`${API}/api/blogs/${id}`, { method: 'DELETE', headers: authHeaders })
    setDeleteConfirm(null)
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
      post.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categoryColors: Record<string, string> = {
    Community: 'bg-green-900 text-green-300',
    'Company news': 'bg-blue-900 text-blue-300',
    Subsidiaries: 'bg-orange-900 text-orange-300',
    Investment: 'bg-purple-900 text-purple-300',
    Technology: 'bg-cyan-900 text-cyan-300',
    Other: 'bg-gray-700 text-gray-700',
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 text-gray-900 px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-4xl font-bold">Blog Posts</h1>
            <p className="text-gray-500 mt-1">{posts.length} articles published</p>
          </div>
          <button
            onClick={() => { setEditing(null); setForm({ id: '', title: '', date: '', category: '', excerpt: '', content: '', image: '' }); setShowForm(true) }}
            className="flex items-center gap-2 bg-ngali-orange text-gray-900 px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition">
            + New post
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-6 mt-6">
          <input type="text" placeholder="Search posts..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange shadow-sm" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-ngali-orange shadow-sm">
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All categories' : c}</option>)}
          </select>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">
              {editing ? `Edit — ${editing.title}` : 'New Blog Post'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug)</label>
                  <input type="text" value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="e.g. my-post-title"
                    required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="text" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. June 12, 2025"
                    required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (short summary)</label>
                <textarea value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  required rows={2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                <textarea value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ngali-orange" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                <ImageUpload
                  folder="blogs"
                  currentImage={form.image}
                  onUpload={(url) => setForm({ ...form, image: url })}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-ngali-orange text-gray-900 px-5 py-2.5 rounded-xl hover:opacity-90 font-medium transition">
                  {editing ? 'Save changes' : 'Publish post'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null) }}
                  className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-xl hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cards Grid */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-ngali-orange shadow-sm hover:shadow-md transition group">
                {/* Image */}
                <div className="relative h-44 bg-gray-100">
                  {post.image ? (
                    <img src={post.image} alt={post.title}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl text-gray-400">📝</span>
                    </div>
                  )}
                  {/* Category badge */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[post.category] ?? 'bg-gray-700 text-gray-700'}`}>
                    {post.category}
                  </span>
                  {/* Action buttons on hover */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEdit(post)}
                      className="w-8 h-8 bg-gray-50/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-blue-600 transition text-sm">
                      ✏️
                    </button>
                    <button onClick={() => setDeleteConfirm(post.id)}
                      className="w-8 h-8 bg-gray-50/80 backdrop-blur rounded-lg flex items-center justify-center hover:bg-red-600 transition text-sm">
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{post.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-2">{post.excerpt}</p>
                  <p className="text-gray-400 text-xs">{post.date}</p>
                </div>

                {/* Delete confirmation */}
                {deleteConfirm === post.id && (
                  <div className="px-4 pb-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-red-600 text-sm mb-3">Delete this post? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDelete(post.id)}
                          className="bg-red-600 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition">
                          Yes, delete
                        </button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition">
                          Cancel
                        </button>
                      </div>
                    </div>
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