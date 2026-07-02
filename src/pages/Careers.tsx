import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import careerHero from '../assets/career.jpg'

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  deadline: string
}

const careersContent = {
  intro: "We're looking for talented individuals who share our vision of building strong, sustainable industries across Africa. Join a team that values impact, growth, and collaboration.",
  benefits: [
    { title: "Meaningful Impact", text: "Work on projects that directly contribute to Rwanda's economic growth and development across multiple sectors." },
    { title: "Professional Growth", text: "We invest in our people through training, mentorship, and opportunities to take on real responsibility early." },
    { title: "Diverse Teams", text: "Collaborate with professionals across energy, mining, healthcare, technology, and more." },
    { title: "Competitive Benefits", text: "Enjoy competitive compensation, health coverage, and a supportive, collaborative work environment." },
  ],
}

export default function Careers() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDepartment, setActiveDepartment] = useState('All')

  useEffect(() => {
    fetch('${import.meta.env.VITE_API_URL}/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobOpenings(data)
        setLoading(false)
      })
  }, [])

  const departments = ['All', ...new Set(jobOpenings.map((job) => job.department))]

  const filteredJobs =
    activeDepartment === 'All'
      ? jobOpenings
      : jobOpenings.filter((job) => job.department === activeDepartment)

  function daysUntil(deadline: string) {
    const diff = new Date(deadline).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
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
  className="min-h-screen w-full flex flex-col items-center justify-center text-white px-6 text-center relative"
  style={{
    backgroundImage: `url(${careerHero})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="absolute inset-0 bg-black/50"></div>
  <div className="relative z-10">
    <h1 className="text-3xl font-bold mb-3">Careers at Ngali Holdings</h1>
    <p className="text-gray-300 max-w-2xl">{careersContent.intro}</p>
  </div>
</section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-10">Why Work With Us</h2>
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {careersContent.benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Open Positions</h2>

        <div className="flex flex-wrap gap-3 mb-10">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={
                dept === activeDepartment
                  ? "px-4 py-2 rounded-full bg-ngali-orange text-white text-sm font-medium"
                  : "px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200"
              }
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="max-w-3xl w-full space-y-4">
          {filteredJobs.map((job) => {
            const remaining = daysUntil(job.deadline)
            return (
              <Link
                key={job.id}
                to={`/careers/${job.id}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.department} · {job.location} · {job.type}</p>
                  </div>
                  {remaining > 0 && remaining <= 7 ? (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full whitespace-nowrap">
                      Closing soon
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                      Open
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Apply by {new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </Link>
            )
          })}

          {filteredJobs.length === 0 && (
            <p className="text-gray-500 text-center">No open positions in this department right now.</p>
          )}
        </div>
      </section>
    </div>
  )
}