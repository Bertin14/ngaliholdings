import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

interface JobOpening {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  deadline: string
}

const API = import.meta.env.VITE_API_URL

const NATIONALITIES = [
  'Rwandan', 'Burundian', 'Congolese', 'Kenyan', 'Ugandan',
  'Tanzanian', 'Ethiopian', 'South African', 'Nigerian', 'Ghanaian',
  'American', 'British', 'French', 'Belgian', 'Canadian', 'Other'
]

export default function JobDetail() {
  const { id } = useParams()
  const [job, setJob] = useState<JobOpening | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    citizenship: '',
    coverLetter: '',
    cvUrl: '',
    coverLetterUrl: '',
    degreeUrl: '',
    certificatesUrl: '',
    agreeToTerms: false,
  })

  const [uploading, setUploading] = useState({
    cv: false,
    coverLetter: false,
    degree: false,
    certificates: false,
  })

  useEffect(() => {
    fetch(`${API}/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setJob(data)
        setLoading(false)
      })
  }, [id])

  async function handleFileUpload(
    file: File,
    field: 'cvUrl' | 'coverLetterUrl' | 'degreeUrl' | 'certificatesUrl',
    uploadingKey: 'cv' | 'coverLetter' | 'degree' | 'certificates'
  ) {
    setUploading(prev => ({ ...prev, [uploadingKey]: true }))

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('upload_preset', 'ngali_uploads')
    formDataUpload.append('resource_type', 'auto')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/sx03mfbt/auto/upload`,
      { method: 'POST', body: formDataUpload }
    )

    const data = await res.json()
    if (data.secure_url) {
      setFormData(prev => ({ ...prev, [field]: data.secure_url }))
    }

    setUploading(prev => ({ ...prev, [uploadingKey]: false }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    await fetch(`${API}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId: id, ...formData }),
    })

    setSubmitting(false)
    setSubmitted(true)
  }

  const steps = ['Personal Info', 'Documents', 'Cover Letter', 'Review']

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  if (!job || (job as any).error) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800">Job not found</h1>
      <Link to="/careers" className="text-ngali-orange hover:underline mt-4">← Back to Careers</Link>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for applying for <strong>{job.title}</strong>. We'll review your application and get back to you soon.
        </p>
        <Link to="/careers" className="bg-ngali-orange text-white px-6 py-2 rounded-lg hover:opacity-90">
          Back to Careers
        </Link>
      </div>
    </div>
  )

  return (
    <div>
      {/* Job hero */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center bg-ngali-black text-white px-6 text-center">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-gray-300 mt-2">{job.department} · {job.location} · {job.type}</p>
        <p className="text-gray-400 text-sm mt-1">
          Apply by {new Date(job.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </section>

      {/* Job description */}
      <section className="w-full flex flex-col items-center justify-center px-6 py-16 bg-white">
        <div className="max-w-2xl w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">About this role</h2>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>
      </section>

      {/* Application form */}
      <section className="w-full flex flex-col items-center justify-center px-6 py-16 bg-gray-50">
        <div className="max-w-2xl w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Apply for this role</h2>
          <p className="text-gray-500 text-sm mb-8">Fill in all sections carefully. Fields marked with * are required.</p>

          {/* Progress steps */}
          <div className="flex items-center mb-8">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    currentStep > index + 1
                      ? 'bg-green-500 text-white'
                      : currentStep === index + 1
                      ? 'bg-ngali-orange text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > index + 1 ? '✓' : index + 1}
                  </div>
                  <p className="text-xs mt-1 text-gray-500 hidden md:block">{step}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input type="text" value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required placeholder="Enter first name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input type="text" value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required placeholder="Enter last name"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input type="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required placeholder="your@email.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required placeholder="+250 7XX XXX XXX"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                    <input type="date" value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <div className="flex gap-4 mt-3">
                      {['Male', 'Female', 'Prefer not to say'].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={formData.gender === option}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="accent-ngali-orange"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                    <select value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange bg-white">
                      <option value="">Select nationality</option>
                      {NATIONALITIES.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship *</label>
                    <select value={formData.citizenship}
                      onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange bg-white">
                      <option value="">Select citizenship</option>
                      {NATIONALITIES.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.firstName || !formData.lastName || !formData.email ||
                        !formData.phone || !formData.dateOfBirth || !formData.gender ||
                        !formData.nationality || !formData.citizenship) {
                        alert('Please fill in all required fields')
                        return
                      }
                      setCurrentStep(2)
                    }}
                    className="bg-ngali-orange text-white px-6 py-2.5 rounded-lg hover:opacity-90 font-medium"
                  >
                    Next: Documents →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Documents */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Upload Documents</h3>
                <p className="text-sm text-gray-500 -mt-2">Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>

                {[
                  { label: 'Curriculum Vitae (CV) *', key: 'cvUrl' as const, uploadKey: 'cv' as const, required: true },
                  { label: 'Cover Letter Document', key: 'coverLetterUrl' as const, uploadKey: 'coverLetter' as const, required: false },
                  { label: 'Academic Degree / Diploma *', key: 'degreeUrl' as const, uploadKey: 'degree' as const, required: true },
                  { label: 'Other Certificates', key: 'certificatesUrl' as const, uploadKey: 'certificates' as const, required: false },
                ].map((doc) => (
                  <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{doc.label}</label>
                    {formData[doc.key] ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm flex-1">
                          <span>✓</span>
                          <span>File uploaded successfully</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, [doc.key]: '' }))}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-ngali-orange transition">
                        {uploading[doc.uploadKey] ? (
                          <span className="text-gray-500 text-sm">Uploading...</span>
                        ) : (
                          <>
                            <span className="text-2xl">📄</span>
                            <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="hidden"
                          disabled={uploading[doc.uploadKey]}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, doc.key, doc.uploadKey)
                          }}
                        />
                      </label>
                    )}
                  </div>
                ))}

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setCurrentStep(1)}
                    className="text-gray-600 px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50">
                    ← Back
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (!formData.cvUrl || !formData.degreeUrl) {
                        alert('Please upload your CV and Degree — they are required')
                        return
                      }
                      setCurrentStep(3)
                    }}
                    className="bg-ngali-orange text-white px-6 py-2.5 rounded-lg hover:opacity-90 font-medium">
                    Next: Cover Letter →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Cover Letter */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">Cover Letter *</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Tell us why you're the right person for this role. What makes you stand out?
                </p>
                <textarea
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  required rows={8}
                  placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in the position of..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-ngali-orange resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{formData.coverLetter.length} characters</p>

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setCurrentStep(2)}
                    className="text-gray-600 px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50">
                    ← Back
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (!formData.coverLetter.trim()) {
                        alert('Please write a cover letter')
                        return
                      }
                      setCurrentStep(4)
                    }}
                    className="bg-ngali-orange text-white px-6 py-2.5 rounded-lg hover:opacity-90 font-medium">
                    Next: Review →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-6">Review Your Application</h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">Personal Information</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Name:</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></div>
                      <div><span className="text-gray-500">Email:</span> <span className="font-medium">{formData.email}</span></div>
                      <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{formData.phone}</span></div>
                      <div><span className="text-gray-500">Date of Birth:</span> <span className="font-medium">{formData.dateOfBirth}</span></div>
                      <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{formData.gender}</span></div>
                      <div><span className="text-gray-500">Nationality:</span> <span className="font-medium">{formData.nationality}</span></div>
                      <div><span className="text-gray-500">Citizenship:</span> <span className="font-medium">{formData.citizenship}</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">Documents</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className={formData.cvUrl ? 'text-green-600' : 'text-red-500'}>
                          {formData.cvUrl ? '✓' : '✗'}
                        </span>
                        <span>CV / Resume</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={formData.degreeUrl ? 'text-green-600' : 'text-red-500'}>
                          {formData.degreeUrl ? '✓' : '✗'}
                        </span>
                        <span>Academic Degree</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={formData.coverLetterUrl ? 'text-green-600' : 'text-gray-400'}>
                          {formData.coverLetterUrl ? '✓' : '○'}
                        </span>
                        <span className="text-gray-500">Cover Letter Document (optional)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={formData.certificatesUrl ? 'text-green-600' : 'text-gray-400'}>
                          {formData.certificatesUrl ? '✓' : '○'}
                        </span>
                        <span className="text-gray-500">Other Certificates (optional)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm uppercase tracking-wide">Cover Letter Preview</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">{formData.coverLetter}</p>
                  </div>
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 mt-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    className="mt-0.5 accent-ngali-orange"
                  />
                  <span className="text-sm text-gray-600">
                    I confirm that all information provided is accurate and complete. I understand that false information may result in disqualification.
                  </span>
                </label>

                <div className="flex justify-between mt-6">
                  <button type="button" onClick={() => setCurrentStep(3)}
                    className="text-gray-600 px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50">
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !formData.agreeToTerms}
                    className="bg-ngali-orange text-white px-8 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}