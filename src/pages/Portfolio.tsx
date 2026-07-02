import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
}

export default function Portfolio() {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/subsidiaries')
      .then((res) => res.json())
      .then((data) => {
        setSubsidiaries(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (subsidiaries.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % subsidiaries.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [subsidiaries])

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
          backgroundImage: subsidiaries[currentSlide]
            ? `url(${subsidiaries[currentSlide].image})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Our Portfolio</h1>
          <p className="text-gray-300 mt-2">Targeting strategic sectors for development</p>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {subsidiaries.map((sub) => (
            <Link
              key={sub.id}
              to={`/portfolio/${sub.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >
              <img src={sub.image} alt={sub.name} className="w-full h-40 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-2">{sub.name}</h3>
                <span className="text-ngali-orange text-sm font-medium hover:underline">
                  Read more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}