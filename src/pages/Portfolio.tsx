import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CardSkeleton } from '../components/CardSkeleton'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
}

const API = import.meta.env.VITE_API_URL

export default function Portfolio() {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/subsidiaries`)
      .then(r => r.json())
      .then(data => { setSubsidiaries(data); setLoading(false) })
  }, [])

  useEffect(() => {
    if (subsidiaries.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % subsidiaries.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [subsidiaries])

  return (
    <div>
      <section
        className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative transition-all duration-700"
        style={{
          backgroundImage: subsidiaries[currentSlide] ? `url(${subsidiaries[currentSlide].image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: subsidiaries.length === 0 ? '#161616' : undefined
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 mt-2"
          >
            Targeting strategic sectors for development
          </motion.p>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center px-6 py-16">
        {loading ? (
          <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
            {subsidiaries.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.07, duration: 0.4 }}
              >
                <Link
                  to={`/portfolio/${sub.id}`}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
                >
                  <div className="overflow-hidden">
                    <img src={sub.image} alt={sub.name}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-2">{sub.name}</h3>
                    <span className="text-ngali-orange text-sm font-medium">Read more →</span>
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