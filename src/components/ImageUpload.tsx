import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

interface ImageUploadProps {
  onUpload: (url: string) => void
  folder: string
  currentImage?: string
}

export default function ImageUpload({ onUpload, folder, currentImage }: ImageUploadProps) {
  const { token } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to Cloudinary via backend
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const data = await res.json()
    setUploading(false)

    if (data.url) {
      onUpload(data.url)
    }
  }

  return (
    <div className="space-y-2">
      {preview && (
        <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
      )}
      <label className="block">
        <span className="bg-gray-100 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm cursor-pointer hover:bg-gray-200 inline-block">
          {uploading ? 'Uploading...' : 'Choose image'}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {uploading && <p className="text-xs text-gray-500">Uploading to Cloudinary...</p>}
    </div>
  )
}