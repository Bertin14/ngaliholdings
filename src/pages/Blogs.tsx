import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BlogCardSkeleton } from '../components/CardSkeleton'
import blogImg from '../assets/blog.png'
import hero3 from '../assets/hero-3.jpg'
import sector2 from '../assets/sector2.jpg'
import agricultureImg from '../assets/agriculture.png'

interface BlogPost {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  image: string
}

const API = import.meta.env.VITE_API_URL

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0)
  const blogsHeroImages = [blogImg, hero3, sector2, agricultureImg]

  useEffect(() => {
    fetch(`${API}/api/blogs`)
      .then(r => r.json())
      .then(data => { setBlogPosts(data); setLoading(false) })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBlogSlide(prev => (prev + 1) % blogsHeroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <section
        className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative transition-all duration-700"
        style={{
          backgroundImage: `url(${blogsHeroImages[currentBlogSlide]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Latest News & Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 mt-2"
          >
            Updates from across Ngali Holdings and our subsidiaries
          </motion.p>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center px-6 py-16">
        {loading ? (
          <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {Array.from({ length: 4 }).map((_, i) => <BlogCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Link
                  to={`/blogs/${post.id}`}
                  className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="overflow-hidden">
                    <img src={post.image} alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-ngali-orange uppercase tracking-wide">
                      {post.category}
                    </span>
                    <h2 className="font-semibold text-gray-800 text-lg mt-2 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{post.date}</span>
                      <span className="text-ngali-orange text-sm font-medium">Read more →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}