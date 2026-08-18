import { useState, useEffect } from 'react'
import aboutHero1 from '../assets/About us_1.jpg'
import aboutHero2 from '../assets/About us_2.jpg'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { MemberSkeleton } from '../components/CardSkeleton'

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
  const shouldReduceMotion = useReducedMotion()

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

  return (
    <div>
      <section className="w-full">
        <div
          className="w-full h-96 md:h-[560px] flex items-center justify-center px-6 relative transition-all duration-700"
          style={{
            backgroundImage: `url(${aboutHeroImages[currentAboutSlide]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <h1 className="relative z-10 text-3xl font-bold text-white">About Us</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto text-center px-6 py-16"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Background</h2>
          <p className="text-gray-600 text-left leading-relaxed">{aboutContent?.background}</p>
        </motion.div>
      </section>

      <section className="w-full flex items-center justify-center bg-gray-50 px-6 py-20">
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white p-6 rounded-lg hover:border-ngali-orange border border-transparent transition"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-ngali-orange flex items-center justify-center text-base mb-3">
              🧭
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Our Vision</h3>
            <p className="text-gray-600">{aboutContent?.vision}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: 0.4 }}
            className="bg-white p-6 rounded-lg hover:border-ngali-orange border border-transparent transition"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-ngali-orange flex items-center justify-center text-base mb-3">
              🎯
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Our Mission</h3>
            <p className="text-gray-600">{aboutContent?.mission}</p>
          </motion.div>
        </div>
      </section>

      <section className="w-full flex flex-col items-center justify-center px-6 py-20">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Core Values</h2>
        <p className="text-gray-500 text-sm mb-8">The principles that guide every decision we make</p>
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((value, index) => (
            <motion.div
              key={value.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.1, duration: 0.4 }}
              className="border border-gray-200 p-5 rounded-lg hover:border-ngali-orange transition"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-ngali-orange flex items-center justify-center text-sm font-medium mb-3">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h4 className="font-semibold text-gray-800 mb-1">{value.title}</h4>
              <p className="text-sm text-gray-600">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Board Members - portrait style, 4 per row */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-10">Board of Directors</h2>
        {loading ? (
          <div className="max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <MemberSkeleton key={i} />)}
          </div>
        ) : (
          <div className="max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {boardMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.08, duration: 0.4 }}
              >
                <Link
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
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6 py-16">
        <h2 className="text-xl font-semibold text-gray-800 mb-10">Leadership Team</h2>
        {loading ? (
          <div className="max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <MemberSkeleton key={i} />)}
          </div>
        ) : (
          <div className="max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.08, duration: 0.4 }}
              >
                <Link
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
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
