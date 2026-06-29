import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/content'

export default function BlogDetail() {
  const { id } = useParams()
  const post = blogPosts.find((p) => p.id === id)

  if (!post) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
        <Link to="/blogs" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to all posts
        </Link>
      </div>
    )
  }

  return (
    <div>
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-ngali-black text-white px-6 text-center">
        <span className="text-xs font-medium text-ngali-orange uppercase tracking-wide">
          {post.category}
        </span>
        <h1 className="text-3xl font-bold mt-2 max-w-2xl">{post.title}</h1>
        <p className="text-gray-400 text-sm mt-2">{post.date}</p>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6">
  <img
    src={post.image}
    alt={post.title}
    className="w-full max-w-3xl h-80 object-cover rounded-lg mb-8"
  />
  <div className="max-w-3xl text-center">
    <p className="text-gray-700 text-lg leading-relaxed">{post.content}</p>
    <Link to="/blogs" className="text-ngali-orange hover:underline mt-8 inline-block">
      ← Back to all posts
    </Link>
  </div>
</section>
    </div>
  )
}