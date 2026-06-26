
import { Link } from 'react-router-dom'
import ngaliLogo from '../assets/Ngali_logo.png'

export default function Navbar() {

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={ngaliLogo} alt="Ngali Holdings" className="h-14 w-auto object-contain" />
        </Link>

        <div className="flex gap-6 text-ngali-black font-medium">
          <Link to="/" className="hover:text-ngali-orange">Home</Link>
          <Link to="/about" className="hover:text-ngali-orange">About Us</Link>
          <Link to="/portfolio" className="hover:text-ngali-orange">Portfolio</Link>
          <Link to="/sectors" className="hover:text-ngali-orange">Sectors</Link>
          <Link to="/blogs" className="hover:text-ngali-orange">Blogs</Link>
          <Link to="/contact" className="hover:text-ngali-orange">Contact</Link>
        </div>
      </div>
    </nav>
  )
}