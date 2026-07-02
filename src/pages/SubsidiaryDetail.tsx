import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

interface Subsidiary {
  id: string
  name: string
  description: string
  image: string
}

export default function SubsidiaryDetail() {
  const { id } = useParams()
  const [subsidiary, setSubsidiary] = useState<Subsidiary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/subsidiaries/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubsidiary(data)
        setLoading(false)
      })
  }, [id])

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
      <section className="min-h-screen w-full flex items-center justify-center bg-ngali-black text-white px-6">
        <h1 className="text-3xl font-bold text-center">{subsidiary.name}</h1>
      </section>

      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12">
        <img
          src={subsidiary.image}
          alt={subsidiary.name}
          className="w-full max-w-3xl h-80 object-cover rounded-lg mb-8"
        />
        <div className="max-w-3xl text-center">
          <p className="text-gray-600 text-lg">{subsidiary.description}</p>
          <Link to="/portfolio" className="text-ngali-orange hover:underline mt-8 inline-block">
            ← Back to all subsidiaries
          </Link>
        </div>
      </section>
    </div>
  )
}