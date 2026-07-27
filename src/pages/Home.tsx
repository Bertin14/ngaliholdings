import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import hero1 from '../assets/hero-1.jpeg'
import hero2 from '../assets/hero-2.jpg'
import hero3 from '../assets/hero-3.jpg'
import introImage from '../assets/black-man-enters-information-tablet-about-jackpump-work.jpg'
import { CardSkeleton } from '../components/CardSkeleton'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
}

const homeContent = {
  slides: [
    { title: "Fostering Innovation", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero1 },
    { title: "Strategic Partnerships", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero2 },
    { title: "Local Empowerment", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero3 },
  ],
  heroText: "Ngali Holdings is a Rwandan company investing in a wide range of industries across the continent of Africa. We are driven by the desire to see African markets grow and specialize in long-term, wide-scale infrastructure projects with a holistic focus.",
}

const API = import.meta.env.VITE_API_URL

export default function Home() {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch(`${API}/api/subsidiaries`)
      .then(r => r.json())
      .then(data => { setSubsidiaries(data); setLoading(false) })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % homeContent.slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* Hero slider */}
      <section
        className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative transition-all duration-700"
        style={{
          backgroundImage: `url(${homeContent.slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4 drop-shadow-lg"
            >
              {homeContent.slides[currentSlide].title}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={`text-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl text-gray-200 drop-shadow"
            >
              {homeContent.slides[currentSlide].text}
            </motion.p>
          </AnimatePresence>
          <div className="flex justify-center gap-2 mt-8">
            {homeContent.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-ngali-orange w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section
        className="min-h-screen w-full flex items-center justify-center px-6 relative"
        style={{ backgroundImage: `url(${introImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl text-center text-white text-lg"
        >
          {homeContent.heroText}
        </motion.p>
      </section>

      {/* Subsidiaries */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-center text-gray-800 mb-10"
        >
          Our Subsidiaries
        </motion.h2>

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
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group"
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