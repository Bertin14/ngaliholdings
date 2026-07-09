import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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

export default function AdminBlogs() {
  const { token, logout } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({
    id: '', title: '', date: '', category: '', excerpt: '', content: '', image: ''
  })

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
        body: JSON.stringify({
          title: form.title, date: form.date, category: form.category,
          excerpt: form.excerpt, content: form.content, image: form.image
        }),
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
    if (!confirm('Delete this blog post?')) return
    await fetch(`${API}/api/blogs/${id}`, {
      method: 'DELETE',
      headers: authHeaders,
    })
    fetchPosts()
  }

  function handleEdit(post: BlogPost) {
    setEditing(post)
    setForm({ id: post.id, title: post.title, date: post.date, category: post.category,
      excerpt: post.excerpt, content: post.content, image: post.image })
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-ngali-black text-white px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-300 hover:text-white text-sm">← Dashboard</Link>
          <h1 className="font-bold text-lg">Blog Posts</h1>
        </div>
        <button onClick={() => { logout(); window.location.href = '/admin/login' }}
          className="bg-ngali-orange px-4 py-1.5 rounded text-sm hover:opacity-90">
          Sign out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Posts ({posts.length})</h2>
          <button onClick={() => { setEditing(null); setForm({ id: '', title: '', date: '', category: '', excerpt: '', content: '', image: '' }); setShowForm(true) }}
            className="bg-ngali-orange text-white px-4 py-2 rounded hover:opacity-90 text-sm font-medium">
            + Add Post
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">{editing ? 'Edit Post' : 'Add New Post'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID (slug, e.g. "my-post-title")</label>
                  <input type="text" value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date (e.g. "June 12, 2025")</label>
                  <input type="text" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                 <ImageUpload
                  folder="blogs"
                  currentImage={form.image}
                  onUpload={(url) => setForm({ ...form, image: url })}
                  />
               </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (short summary)</label>
                <textarea value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  required rows={2} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                <textarea value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required rows={5} className="w-full border border-gray-300 rounded px-3 py-2" />
              </div>
              <div className="flex gap-3">
                <button type="submit"
                  className="bg-ngali-orange text-white px-4 py-2 rounded hover:opacity-90 text-sm">
                  {editing ? 'Save changes' : 'Add post'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? <p className="text-gray-500">Loading...</p> : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{post.title}</p>
                  <p className="text-sm text-gray-500">{post.category} · {post.date}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(post)} className="text-blue-600 text-sm hover:underline">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-500 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}