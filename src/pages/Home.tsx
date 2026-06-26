import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { homeContent, subsidiaries } from '../data/content'
import introImage from '../assets/black-man-enters-information-tablet-about-jackpump-work.jpg'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % homeContent.slides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
   <div>
  {/* Hero slider - full screen */}
  <section
  className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative"
  style={{
    backgroundImage: `url(${homeContent.slides[currentSlide].image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* dark overlay so text stays readable over any photo */}
  <div className="absolute inset-0 bg-black/30"></div>

  {/* actual content sits ABOVE the overlay */}
  <div className="relative z-10">
    <h1 className="text-4xl font-bold mb-4">{homeContent.slides[currentSlide].title}</h1>
    <p className="max-w-2xl text-gray-200">{homeContent.slides[currentSlide].text}</p>

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

  {/* Intro text - full screen */}
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

  {/* Subsidiaries preview - full screen */}
  <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">Our Subsidiaries</h2>
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