import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProfessionalProfile from './pages/ProfessionalProfile'
import Experience from './pages/Experience'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/professional-profile" element={<ProfessionalProfile />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default App
