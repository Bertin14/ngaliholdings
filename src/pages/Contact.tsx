import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  return (
    <div>
      <section className="min-h-screen w-full flex items-center justify-center bg-ngali-black text-white px-6">
        <h1 className="text-3xl font-bold">Contact Us</h1>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          {submitted ? (
            <p className="text-green-600 text-lg text-center">Thanks for reaching out! We'll get back to you soon.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <button type="submit" className="bg-ngali-orange text-white px-6 py-2 rounded hover:opacity-90">
                Send message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}