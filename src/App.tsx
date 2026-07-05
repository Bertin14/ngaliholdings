import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import SubsidiaryDetail from './pages/SubsidiaryDetail'
import Sectors from './pages/Sectors'
import Contact from './pages/Contact'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Careers from './pages/Careers'
import JobDetail from './pages/JobDetail'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminSubsidiaries from './pages/admin/Subsidiaries'
import AdminBlogs from './pages/admin/Blogs'
import AdminJobs from './pages/admin/Jobs'

function App() {
  return (
    <Routes>
      {/* Admin routes - no Navbar/Footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/subsidiaries" element={
      <ProtectedRoute>
        <AdminSubsidiaries />
      </ProtectedRoute>
      } />

      <Route path="/admin/blogs" element={
      <ProtectedRoute>
         <AdminBlogs />
      </ProtectedRoute>
} />
      <Route path="/admin/jobs" element={
        <ProtectedRoute>
          <AdminJobs />
      </ProtectedRoute>
} />

      {/* Public routes - with Navbar/Footer */}
      <Route path="/*" element={
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<SubsidiaryDetail />} />
            <Route path="/sectors" element={<Sectors />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<JobDetail />} />
          </Routes>
          <Footer />
        </>
      } />
    </Routes>
  )
}

export default App