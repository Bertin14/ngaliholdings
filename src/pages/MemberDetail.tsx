import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'

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

  return (
    <div>
      {/* Hero section */}
      <section className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center bg-ngali-black text-white px-6 md:px-16 gap-12">
        <div className="w-48 md:w-64 shrink-0">
          {member.image ? (
            <div className="w-full aspect-3/4 rounded-lg overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ) : (
            <div className="w-full aspect-3/4 rounded-lg bg-gray-800 flex items-center justify-center">
              <span className="text-6xl text-gray-600">👤</span>
            </div>
          )}
        </div>
        <div className="text-center md:text-left">
          <p className="text-ngali-orange text-sm font-medium uppercase tracking-wide mb-2">
            {type === 'board' ? 'Board of Directors' : 'Leadership Team'}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{member.name}</h1>
          <p className="text-gray-300 text-lg">{member.role}</p>
        </div>
      </section>

      {/* CV section */}
      {member.cv && (
        <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6 py-16">
          <div className="max-w-3xl w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6"></h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {member.cv}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <section className="w-full flex justify-center py-12 bg-gray-50">
        <Link to="/about" className="text-ngali-orange hover:underline">
          ← Back to About Us
        </Link>
      </section>
    </div>
  )
}