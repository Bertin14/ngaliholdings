import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

interface Member {
  id: number
  name: string
  role: string
  image?: string
  bio?: string
  cv?: string
}

const API = import.meta.env.VITE_API_URL

export default function MemberDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'team'
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    fetch(`${API}/api/${type}/${id}`)
      .then(r => r.json())
      .then(data => {
        setMember(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id, type])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!member || (member as any).error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Member not found</h1>
        <Link to="/about" className="text-ngali-orange hover:underline mt-4 inline-block">
          ← Back to About Us
        </Link>
      </div>
    )
  }

  // Split the CV text into paragraphs for consistent spacing, regardless of
  // how the admin formatted the blank lines when entering it.
  const cvParagraphs = member.cv
    ? member.cv.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
    : []

  const label = type === 'board' ? 'Board Member' : 'Team Member'

  return (
    <div className="w-full bg-ngali-black">
      <div className="max-w-6xl mx-auto md:flex md:items-start">

        {/* Photo — sticks in place on desktop while the bio scrolls */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:sticky md:top-0 md:w-72 md:shrink-0 px-6 pt-10 pb-6 md:pb-10"
        >
          {member.image ? (
            <div className="w-full aspect-3/4 rounded-lg overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-full aspect-3/4 rounded-lg bg-gray-800 flex items-center justify-center ring-1 ring-white/10">
              <span className="text-6xl text-gray-600">👤</span>
            </div>
          )}
        </motion.div>

        {/* Bio panel */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 min-w-0 md:mt-10 mb-10 mx-6 md:mr-6 rounded-lg overflow-hidden shadow-2xl"
        >
          <div className="bg-ngali-orange px-8 py-3">
            <p className="text-white text-xs font-bold uppercase tracking-widest">{label}</p>
          </div>
          <div className="bg-white px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{member.name}</h1>
            <p className="text-gray-500 mb-6">{member.role}</p>

            {cvParagraphs.length > 0 && (
              <div className="space-y-4">
                {cvParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Back link */}
      <div className="w-full flex justify-center py-8">
        <Link to="/about" className="text-ngali-orange hover:underline">
          ← Back to About Us
        </Link>
      </div>
    </div>
  )
}
