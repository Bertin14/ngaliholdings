
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
  content: string
  image: string
}

export default function Blogs() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0)
  const blogsHeroImages = [blogImg, hero3, sector2, agricultureImg]

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentBlogSlide((prev) => (prev + 1) % blogsHeroImages.length)
  }, 4000)
  return () => clearInterval(timer)
}, [])

  useEffect(() => {
    fetch('http://localhost:3001/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        setBlogPosts(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

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
  <div className="absolute inset-0 bg-black/50"></div>
  <div className="relative z-10">
    <h1 className="text-3xl font-bold">Latest News & Insights</h1>
    <p className="text-gray-300 mt-2">Updates from across Ngali Holdings and our subsidiaries</p>
  </div>
</section>

      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blogs/${post.id}`}
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="text-xs font-medium text-ngali-orange uppercase tracking-wide">
                  {post.category}
                </span>
                <h2 className="font-semibold text-gray-800 text-lg mt-2 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{post.date}</span>
                  <span className="text-ngali-orange text-sm font-medium hover:underline">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}