import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
  sector?: string
}

export default function SubsidiaryDetail() {
  const { id } = useParams()
  const [subsidiary, setSubsidiary] = useState<Subsidiary | null>(null)
  const [related, setRelated] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setLoading(true)
    fetch(`${import.meta.env.VITE_API_URL}/api/subsidiaries/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubsidiary(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!subsidiary?.sector) {
      setRelated([])
      return
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/subsidiaries`)
      .then((res) => res.json())
      .then((data: Subsidiary[]) => {
        const others = (data ?? []).filter(
          (s) => s.sector === subsidiary.sector && s.id !== subsidiary.id
        )
        setRelated(others)
      })
      .catch(() => setRelated([]))
  }, [subsidiary])

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!subsidiary || (subsidiary as any).error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Subsidiary not found</h1>
        <Link to="/portfolio" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Portfolio
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header — image and details side by side, matching the blog article layout */}
      <section className="w-full px-6 pt-8 pb-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/portfolio" className="text-gray-500 hover:text-ngali-orange text-sm inline-flex items-center gap-1.5 mb-6">
            ← Portfolio
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="order-2 md:order-1"
            >
              {subsidiary.sector && (
                <span className="text-xs font-medium text-ngali-orange uppercase tracking-wide">
                  {subsidiary.sector}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 leading-tight">
                {subsidiary.name}
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mt-4">
                {subsidiary.description}
              </p>
            </motion.div>
            <motion.img
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              src={subsidiary.image}
              alt={subsidiary.name}
              className="order-1 md:order-2 w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Bottom back link, for anyone who scrolled past related content */}
      <section className="w-full flex justify-center px-6 py-8">
        <Link to="/portfolio" className="text-ngali-orange hover:underline">
          ← Back to all subsidiaries
        </Link>
      </section>

      {/* More in the same sector */}
      {related.length > 0 && (
        <section className="w-full bg-gray-50 px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              More in {subsidiary.sector}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/portfolio/${sub.id}`}
                  className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-ngali-orange transition"
                >
                  <div className="h-28 overflow-hidden">
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-800 text-sm mb-2">{sub.name}</h3>
                    <span className="text-ngali-orange text-xs font-medium">View subsidiary</span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      )}
    </div>
  )
}
