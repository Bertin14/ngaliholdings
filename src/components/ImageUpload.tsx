import { useState } from 'react'

interface ImageUploadProps {
  onUpload: (url: string) => void
  folder?: string
  currentImage?: string
}

const CLOUD_NAME = 'sx03mfbt'
const UPLOAD_PRESET = 'ngali_uploads'

export default function ImageUpload({ onUpload, folder, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', UPLOAD_PRESET)
      if (folder) formData.append('folder', `ngali-holdings/${folder}`)

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await res.json()

      if (data.secure_url) {
        setPreview(data.secure_url)
        onUpload(data.secure_url)
      } else {
        setError('Upload failed — please try again')
        console.error('Cloudinary error:', data)
      }
    } catch (err) {
      setError('Upload failed — please try again')
      console.error('Upload error:', err)
    }

    setUploading(false)
  }

  return (
    <div className="space-y-2">
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
        />
      )}

      <label className="block">
        <span className={`inline-block px-3 py-2 rounded text-sm cursor-pointer border transition ${
          uploading
            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}>
          {uploading ? 'Uploading...' : preview ? 'Change image' : 'Choose image'}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-500 text-xs">{error}</p>}
      {uploading && <p className="text-gray-400 text-xs">Uploading to Cloudinary...</p>}
    </div>
  )
}