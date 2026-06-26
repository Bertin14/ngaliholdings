import { useParams, Link } from 'react-router-dom'
import { subsidiaries } from '../data/content'

export default function SubsidiaryDetail() {
  const { id } = useParams()
  const subsidiary = subsidiaries.find((sub) => sub.id === id)

  if (!subsidiary) {
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