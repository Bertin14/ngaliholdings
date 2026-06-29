import { Link } from 'react-router-dom'
import footerImage from '../assets/footer-picture.jpg'

export default function Footer() {
  return (
    <footer
      className="min-h-screen w-full flex flex-col items-center justify-center text-gray-300 px-6 relative"
      style={{
        backgroundImage: `url(${footerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Ngali Holdings</h3>
          <p className="text-sm text-gray-400">
            Investing in strategic projects catalyzing sustainable growth and development across Africa.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Quick links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/portfolio" className="hover:text-white">Portfolio</Link></li>
            <li><Link to="/sectors" className="hover:text-white">Sectors</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Contact</h4>
          <p className="text-sm text-gray-400">Boulevard de L'Umuganda KG 624 ST</p>
          <p className="text-sm text-gray-400">BODIFA House, 7th Floor</p>
        </div>
      </div>

      <div className="relative z-10 border-t border-gray-800 text-center text-xs text-gray-500 py-4 w-full">
        © {new Date().getFullYear()} Ngali Holdings. All rights reserved.
      </div>
    </footer>
  )
}