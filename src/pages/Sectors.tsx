import { sectorsContent } from '../data/content'

export default function Sectors() {
  return (
    <div>
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-ngali-black text-white px-6 text-center">
        <h1 className="text-3xl font-bold">Our Sectors</h1>
        <p className="text-gray-300 mt-2 max-w-2xl">{sectorsContent.intro}</p>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {sectorsContent.sectors.map((sector) => (
            <div key={sector.title} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">{sector.title}</h3>
              <p className="text-gray-600 text-sm">{sector.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}