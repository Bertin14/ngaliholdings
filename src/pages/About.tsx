import { useState, useEffect } from 'react'
import { aboutContent, teamMembers, aboutHeroImages } from '../data/content'

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % aboutHeroImages.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <section
        className="min-h-screen w-full flex items-center justify-center px-6 relative transition-all duration-700"
        style={{
          backgroundImage: `url(${aboutHeroImages[currentSlide]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <h1 className="relative z-10 text-3xl font-bold text-white">About Us</h1>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Background</h2>
          <p className="text-gray-600">{aboutContent.background}</p>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Our Vision</h3>
            <p className="text-gray-600">{aboutContent.vision}</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Our Mission</h3>
            <p className="text-gray-600">{aboutContent.mission}</p>
          </div>
        </div>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">Our Core Values</h2>
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutContent.values.map((value) => (
            <div key={value.title} className="border border-gray-200 p-5 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-1">{value.title}</h4>
              <p className="text-sm text-gray-600">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">Leadership Team</h2>
        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-white border border-gray-200 p-4 rounded-lg">
              <p className="font-medium text-gray-800">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}