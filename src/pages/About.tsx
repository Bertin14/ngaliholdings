import { useState, useEffect } from 'react'
import aboutHero1 from '../assets/About us_1.jpg'
import aboutHero2 from '../assets/About us_2.jpg'
import { Link } from 'react-router-dom'

interface TeamMember {
  id: number
  name: string
  role: string
  image?: string
}

interface AboutContent {
  background: string
  vision: string
  mission: string
}

interface CoreValue {
  id: number
  title: string
  text: string
}

interface BoardMember {
  id: number
  name: string
  role: string
  image?: string
  order: number
}

const aboutHeroImages = [aboutHero1, aboutHero2]
const API = import.meta.env.VITE_API_URL

export default function About() {
  const [currentAboutSlide, setCurrentAboutSlide] = useState(0)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [coreValues, setCoreValues] = useState<CoreValue[]>([])
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAboutSlide((prev) => (prev + 1) % aboutHeroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

 useEffect(() => {
  Promise.all([
    fetch(`${API}/api/about`).then(r => r.json()).catch(() => null),
    fetch(`${API}/api/values`).then(r => r.json()).catch(() => []),
    fetch(`${API}/api/team`).then(r => r.json()).catch(() => []),
    fetch(`${API}/api/board`).then(r => r.json()).catch(() => []),
  ]).then(([about, values, team, board]) => {
    setAboutContent(about)
    setCoreValues(values ?? [])
    setTeamMembers(team ?? [])
    setBoardMembers(board ?? [])
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
        className="min-h-screen w-full flex items-center justify-center px-6 relative transition-all duration-700"
        style={{
          backgroundImage: `url(${aboutHeroImages[currentAboutSlide]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <h1 className="relative z-10 text-3xl font-bold text-white">About Us</h1>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Background</h2>
          <p className="text-gray-600">{aboutContent?.background}</p>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Our Vision</h3>
            <p className="text-gray-600">{aboutContent?.vision}</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Our Mission</h3>
            <p className="text-gray-600">{aboutContent?.mission}</p>
          </div>
        </div>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">Our Core Values</h2>
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((value) => (
            <div key={value.id} className="border border-gray-200 p-5 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">{value.title}</h4>
              <p className="text-sm text-gray-600">{value.text}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Board Members - portrait style, 4 per row */}
<section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-16">
  <h2 className="text-xl font-semibold text-gray-800 mb-10">Board of Directors</h2>
  <div className="max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
    {boardMembers.map((member) => (
      <Link
        key={member.id}
        to={`/member/${member.id}?type=board`}
        className="flex flex-col items-center text-center hover:opacity-90 transition"
      > 
        {/* Portrait image - taller than wide */}
        <div className="w-full aspect-3/4 rounded-lg overflow-hidden mb-3 bg-gray-200">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-4xl text-gray-300">👤</span>
            </div>
          )}
        </div>
        <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
        <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
        <span className="text-ngali-orange text-xs mt-1 hover:underline">View profile →</span>
      </Link>
    ))}
  </div>
</section>

  <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6 py-16">
   <h2 className="text-xl font-semibold text-gray-800 mb-10">Leadership Team</h2>
   <div className="max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
     {teamMembers.map((member) => (
  <Link
  key={member.id}
  to={`/member/${member.id}?type=team`}
  className="flex flex-col items-center text-center hover:opacity-90 transition"
>
    <div className="w-full aspect-3/4 rounded-lg overflow-hidden mb-3 bg-gray-200">
      {member.image ? (
        <img src={member.image} alt={member.name}
          className="w-full h-full object-cover object-top" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <span className="text-4xl text-gray-300">👤</span>
        </div>
      )}
    </div>
    <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
    <p className="text-gray-500 text-xs mt-0.5">{member.role}</p>
    <span className="text-ngali-orange text-xs mt-1 hover:underline">View profile →</span>
  </Link>
))}
   </div>
 </section>
    </div>
  )
}