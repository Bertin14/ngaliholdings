import { useState } from 'react'
import { Link } from 'react-router-dom'
import ngaliLogo from '../assets/Ngali_logo.png'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCompanyOpen, setIsCompanyOpen] = useState(false)
  const [isInsightsOpen, setIsInsightsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={ngaliLogo} alt="Ngali Holdings" className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-ngali-black font-medium">
          <Link to="/" className="hover:text-ngali-orange">Home</Link>

          {/* Company dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCompanyOpen(true)}
            onMouseLeave={() => setIsCompanyOpen(false)}
          >
            <button className="hover:text-ngali-orange flex items-center gap-1">
              Company <span className="text-xs">▾</span>
            </button>
            {isCompanyOpen && (
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-44">
                <Link to="/about" className="block px-4 py-2 hover:bg-gray-50 hover:text-ngali-orange">About Us</Link>
                <Link to="/sectors" className="block px-4 py-2 hover:bg-gray-50 hover:text-ngali-orange">Sectors</Link>
                <Link to="/careers" className="block px-4 py-2 hover:bg-gray-50 hover:text-ngali-orange">Careers</Link>
              </div>
            )}
          </div>

          <Link to="/portfolio" className="hover:text-ngali-orange">Portfolio</Link>

          {/* Insights dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsInsightsOpen(true)}
            onMouseLeave={() => setIsInsightsOpen(false)}
          >
            <button className="hover:text-ngali-orange flex items-center gap-1">
              Insights <span className="text-xs">▾</span>
            </button>
            {isInsightsOpen && (
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 w-44">
                <Link to="/blogs" className="block px-4 py-2 hover:bg-gray-50 hover:text-ngali-orange">News & Blogs</Link>
              </div>
            )}
          </div>

          <Link to="/contact" className="hover:text-ngali-orange">Contact</Link>
        </div>

        {/* Hamburger button - mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-ngali-black text-2xl"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown menu - flat list, no nested dropdowns needed here */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 py-4 border-t border-gray-200">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-ngali-orange">Home</Link>
          <p className="text-xs text-gray-400 mt-2">Company</p>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="py-2 pl-3 hover:text-ngali-orange">About Us</Link>
          <Link to="/sectors" onClick={() => setIsMenuOpen(false)} className="py-2 pl-3 hover:text-ngali-orange">Sectors</Link>
          <Link to="/careers" onClick={() => setIsMenuOpen(false)} className="py-2 pl-3 hover:text-ngali-orange">Careers</Link>
          <Link to="/portfolio" onClick={() => setIsMenuOpen(false)} className="py-2 mt-2 hover:text-ngali-orange">Portfolio</Link>
          <p className="text-xs text-gray-400 mt-2">Insights</p>
          <Link to="/blogs" onClick={() => setIsMenuOpen(false)} className="py-2 pl-3 hover:text-ngali-orange">News & Blogs</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="py-2 mt-2 hover:text-ngali-orange">Contact</Link>
        </div>
      )}
    </nav>
  )
}