import { useState, useEffect } from 'react'
import sector1 from '../assets/sector1.jpg'
import sector2 from '../assets/sector2.jpg'
import sector3 from '../assets/sector3.jpg'

interface Sector {
  id: string
  title: string
  text: string
  image: string
}

const sectorsIntro = "Ngali Holdings targets strategic sectors for development across Africa, with a focus on improving lives through diversified investment."

export default function Sectors() {
  const [sectors, setSectors] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [openSectors, setOpenSectors] = useState<string[]>([])
  const [currentSectorSlide, setCurrentSectorSlide] = useState(0)
  const sectorHeroImages = [sector1, sector2, sector3]

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSectorSlide((prev) => (prev + 1) % sectorHeroImages.length)
  }, 4000)
  return () => clearInterval(timer)
}, [])

  useEffect(() => {
    fetch('${import.meta.env.vite_api_url}/api/sectors')
      .then((res) => res.json())
      .then((data) => {
        setSectors(data)
        setLoading(false)
      })
  }, [])

  function toggleSector(id: string) {
    setOpenSectors((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

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
    backgroundImage: `url(${sectorHeroImages[currentSectorSlide]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-black/40"></div>
  <div className="relative z-10">
    <h1 className="text-3xl font-bold">Our Sectors</h1>
    <p className="text-gray-300 mt-2 max-w-2xl">{sectorsIntro}</p>
  </div>
</section>

      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectors.map((sector) => {
            const isOpen = openSectors.includes(sector.id)
            return (
              <div key={sector.id} className="bg-gray-50 rounded-lg overflow-hidden">
                <img src={sector.image} alt={sector.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">{sector.title}</h3>

                  {isOpen && (
                    <p className="text-gray-600 text-sm mb-3">{sector.text}</p>
                  )}

                  <button
                    onClick={() => toggleSector(sector.id)}
                    className="text-ngali-orange text-sm font-medium hover:underline"
                  >
                    {isOpen ? 'Show less ←' : 'Read more →'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}