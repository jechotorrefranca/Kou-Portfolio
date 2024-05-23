import { NavLink } from "react-router-dom"
import logo from '../assets/logo.png'

const Navbar = () => {
  return (

    <header className="header">

        <NavLink to="/" className="w-10 h-10 shadow-md" >
            <img src={logo} alt="logo" />
        </NavLink>
        
        <nav className="flex text-lg gap-14 font-medium">
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link text-blue-100' : 'nav-link text-blue-300'}>
            About
          </NavLink>

          <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link text-blue-100' : 'nav-link text-blue-300'}>
            Projects
          </NavLink>

          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link text-blue-100' : 'nav-link text-blue-300'}>
            Contact
          </NavLink>

        </nav>

    </header>
  )
}

export default Navbar