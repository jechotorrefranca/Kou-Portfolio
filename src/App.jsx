import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import { Home, About, Projects, Contact, Login } from "./pages"
import React from 'react';


const App = () => {

  return (
    <main style={{backgroundColor: '#00060c'}} className="h-full">
      <Router>

        {/* navbar component */}
        <Navbar /> 
        
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/projects" element={<Projects/>} />
            <Route path="/contact" element={<Contact/>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
      </Router>

    </main>
  )
}

export default App
