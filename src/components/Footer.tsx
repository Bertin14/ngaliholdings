import { Link } from 'react-router-dom'
import footerImage from '../assets/footer-picture.jpg'

export default function Footer() {
  return (
    <footer
      className="w-full relative"
      style={{
        backgroundImage: `url(${footerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Main footer content — padding now lives here instead of on <footer>,
          so the copyright band below can go full-bleed edge to edge. */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pt-16 pb-12">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Ngali Holdings</h3>
          <p className="text-sm text-gray-300">
            Investing in strategic projects catalyzing sustainable growth and development across Africa.
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Quick links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/about" className="hover:text-white text-gray-300">About Us</Link></li>
            <li><Link to="/portfolio" className="hover:text-white text-gray-300">Portfolio</Link></li>
            <li><Link to="/sectors" className="hover:text-white text-gray-300">Sectors</Link></li>
            <li><Link to="/contact" className="hover:text-white text-gray-300">Contact</Link></li>
            <li><Link to="/careers" className="hover:text-white text-gray-300">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Contact</h4>
          <p className="text-sm text-gray-300">Boulevard de L'Umuganda KG 624 ST</p>
          <p className="text-sm text-gray-300">BODIFA House, 7th Floor</p>
        </div>
      </div>

      {/* Full-width orange copyright band, edge to edge — sits outside the
          max-w-6xl/px-6 wrapper above so it isn't inset like the rest of the footer. */}
      <div className="relative z-10 w-full bg-ngali-orange py-4">
        <p className="text-center text-sm text-white">
          Ngali Holdings Ltd © {new Date().getFullYear()}. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
