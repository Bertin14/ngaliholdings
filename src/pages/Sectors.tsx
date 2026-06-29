import { useState, useEffect } from 'react'
import { sectorsContent, sectorsHeroImages } from '../data/content'

export default function Sectors() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sectorsHeroImages.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <section
        className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative transition-all duration-700"
        style={{
          backgroundImage: `url(${sectorsHeroImages[currentSlide]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Our Sectors</h1>
          <p className="text-gray-300 mt-2 max-w-2xl">{sectorsContent.intro}</p>
        </div>
      </section>

      {/* keep your existing second section exactly as it was below */}
      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectorsContent.sectors.map((sector) => (
  <div key={sector.title} className="bg-gray-50 rounded-lg overflow-hidden">
    <img src={sector.image} alt={sector.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="font-semibold text-gray-800 mb-2">{sector.title}</h3>
      <p className="text-gray-600 text-sm">{sector.text}</p>
    </div>
  </div>
))}
        </div>
      </section>
    </div>
  )
}