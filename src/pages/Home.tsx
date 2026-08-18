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
  sector?: string
}

const homeContent = {
  slides: [
    { title: "Fostering Innovation", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero1 },
    { title: "Strategic Partnerships", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero2 },
    { title: "Local Empowerment", text: "Ngali Holdings invests in strategic projects catalyzing sustainable growth and development across Africa.", image: hero3 },
  ],
  heroText: "A Rwandan company investing in Africa's future — across energy, industry, and infrastructure.",
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
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % homeContent.slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const sectorCount = new Set(subsidiaries.map(s => s.sector).filter(Boolean)).size

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
        <div className="relative z-10">
          <p className="text-ngali-orange text-xs font-medium tracking-widest uppercase mb-4">Ngali Holdings</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-ngali-orange px-6 py-3 mb-4 max-w-2xl mx-auto"
            >
              <h1 className="text-3xl md:text-5xl font-extrabold uppercase text-ngali-black leading-tight">
                {homeContent.slides[currentSlide].title}
              </h1>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={`text-${currentSlide}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="max-w-2xl mx-auto text-gray-200 drop-shadow"
            >
              {homeContent.slides[currentSlide].text}
            </motion.p>
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              to="/sectors"
              className="bg-ngali-orange text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
            >
              Explore our sectors
            </Link>
            <Link
              to="/contact"
              className="border border-white/40 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-white/10 transition"
            >
              Contact us
            </Link>
          </div>

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

        {/* Stat band */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/10">
            <div className="py-5 text-center">
              <p className="text-2xl font-semibold">{loading ? '—' : subsidiaries.length}</p>
              <p className="text-xs text-gray-300 mt-1">Subsidiaries</p>
            </div>
            <div className="py-5 text-center">
              <p className="text-2xl font-semibold">{loading ? '—' : sectorCount}</p>
              <p className="text-xs text-gray-300 mt-1">Sectors</p>
            </div>
            <div className="py-5 text-center">
              <p className="text-2xl font-semibold">2012</p>
              <p className="text-xs text-gray-300 mt-1">Founded</p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section
        className="w-full min-h-[70vh] md:min-h-[600px] flex items-center justify-center px-6 py-24 relative"
        style={{ backgroundImage: `url(${introImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl text-center"
        >
          <p className="text-white text-lg leading-relaxed mb-6">
            {homeContent.heroText}
          </p>
          <Link
            to="/about"
            className="inline-block bg-ngali-orange text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition"
          >
            About Us
          </Link>
        </motion.div>
      </section>

      {/* Subsidiaries */}
      <section className="w-full flex flex-col items-center justify-center bg-gray-50 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Subsidiaries</h2>
          <p className="text-gray-500 text-sm">Diversified operations across Rwanda and the wider region</p>
        </motion.div>

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
                  className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-ngali-orange transition"
                >
                  <div className="overflow-hidden h-28">
                    <img src={sub.image} alt={sub.name}
                      className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    {sub.sector && (
                      <span className="inline-block bg-orange-50 text-ngali-orange text-xs px-2.5 py-1 rounded-full mb-2">
                        {sub.sector}
                      </span>
                    )}
                    <h3 className="font-medium text-gray-800 text-sm mb-2">{sub.name}</h3>
                    <span className="text-ngali-orange text-xs font-medium">View subsidiary</span>
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
