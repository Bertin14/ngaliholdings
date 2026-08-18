import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  content: string
  image: string
}

function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

export default function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [related, setRelated] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!post?.category) {
      setRelated([])
      return
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
      .then((res) => res.json())
      .then((data: BlogPost[]) => {
        const others = (data ?? []).filter(
          (p) => p.category === post.category && p.id !== post.id
        )
        setRelated(others)
      })
      .catch(() => setRelated([]))
  }, [post])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!post || (post as any).error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
        <Link to="/blogs" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to all posts
        </Link>
      </div>
    )
  }

  const contentParagraphs = post.content
    ? post.content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
    : []

  return (
    <div>
      {/* Header — image and title/meta side by side instead of a stacked dark hero */}
      <section className="w-full px-6 pt-8 pb-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/blogs" className="text-gray-500 hover:text-ngali-orange text-sm inline-flex items-center gap-1.5 mb-6">
            ← All posts
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="order-2 md:order-1"
            >
              <span className="text-xs font-medium text-ngali-orange uppercase tracking-wide">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 leading-tight">
                {post.title}
              </h1>
              <p className="text-gray-500 text-sm mt-3">
                {post.date}
                {post.content && <span> · {estimateReadingTime(post.content)}</span>}
              </p>
              {post.excerpt && (
                <p className="text-gray-600 text-base leading-relaxed mt-4">
                  {post.excerpt}
                </p>
              )}
            </motion.div>
            <motion.img
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              src={post.image}
              alt={post.title}
              className="order-1 md:order-2 w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="w-full flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full"
        >
          <div className="space-y-4">
            {contentParagraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="text-center">
            <Link to="/blogs" className="text-ngali-orange hover:underline mt-8 inline-block">
              ← Back to all posts
            </Link>
          </div>
        </motion.div>
      </section>

      {/* More from the same category */}
      {related.length > 0 && (
        <section className="w-full bg-gray-50 px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              More from {post.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/blogs/${p.id}`}
                  className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-ngali-orange transition"
                >
                  <div className="h-28 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2">{p.title}</h3>
                    <p className="text-gray-400 text-xs">{p.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}
