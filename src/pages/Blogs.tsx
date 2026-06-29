import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts, blogsHeroImages } from '../data/content'

export default function Blogs() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % blogsHeroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <section
        className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative transition-all duration-700"
        style={{
          backgroundImage: `url(${blogsHeroImages[currentSlide]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Latest News & Insights</h1>
          <p className="text-gray-300 mt-2">Updates from across Ngali Holdings and our subsidiaries</p>
        </div>
      </section>

      {/* keep your existing blog cards section exactly as it was below */}
      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blogs/${post.id}`}
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <span className="text-xs font-medium text-ngali-orange uppercase tracking-wide">
                  {post.category}
                </span>
                <h2 className="font-semibold text-gray-800 text-lg mt-2 mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}