import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import hero1 from '../assets/hero-1.jpeg'
import hero2 from '../assets/hero-2.jpg'
import hero3 from '../assets/hero-3.jpg'
import introImage from '../assets/black-man-enters-information-tablet-about-jackpump-work.jpg'

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

export default function Home() {
  const [subsidiaries, setSubsidiaries] = useState<Subsidiary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/subsidiaries`)
      .then((res) => res.json())
      .then((data) => {
        setSubsidiaries(data)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeContent.slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      {/* Hero slider with real background images */}
      <section
        className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative transition-all duration-700"
        style={{
          backgroundImage: `url(${homeContent.slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
            {homeContent.slides[currentSlide].title}
          </h1>
          <p className="max-w-2xl text-gray-200 drop-shadow">
            {homeContent.slides[currentSlide].text}
          </p>

          <div className="flex justify-center gap-2 mt-8">
            {homeContent.slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={
                  index === currentSlide
                    ? "w-8 h-2 rounded-full bg-ngali-orange"
                    : "w-8 h-2 rounded-full bg-white/50"
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Intro text with background image */}
      <section
        className="min-h-screen w-full flex items-center justify-center px-6 relative"
        style={{
          backgroundImage: `url(${introImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <p className="relative z-10 max-w-3xl text-center text-white text-lg">
          {homeContent.heroText}
        </p>
      </section>

      {/* Subsidiaries from database */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Our Subsidiaries</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
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
        )}
      </section>
    </div>
  )
}