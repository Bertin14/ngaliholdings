import { useState } from 'react'
import { Link } from 'react-router-dom'
import { jobOpenings } from '../data/content'

export default function Careers() {
  const [activeDepartment, setActiveDepartment] = useState('All')

  const departments = ['All', ...new Set(jobOpenings.map((job) => job.department))]

  const filteredJobs =
    activeDepartment === 'All'
      ? jobOpenings
      : jobOpenings.filter((job) => job.department === activeDepartment)

  function daysUntil(deadline: string) {
    const diff = new Date(deadline).getTime() - new Date().getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div>
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-ngali-black text-white px-6 text-center">
        <h1 className="text-3xl font-bold mb-3">Careers at Ngali Holdings</h1>
        <p className="text-gray-300 max-w-2xl">
          Be part of something bigger — join a team building strategic, sustainable growth across Africa.
        </p>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12">
        {/* Department filter buttons */}
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

        {/* Job cards */}
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