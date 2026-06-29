import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { subsidiaries } from '../data/content'

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const portfolioHeroImages = subsidiaries.map((sub) => sub.image)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % portfolioHeroImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [portfolioHeroImages.length])

  return (
    <div>
      <section
        className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative transition-all duration-700"
        style={{
          backgroundImage: `url(${portfolioHeroImages[currentSlide]})`,
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