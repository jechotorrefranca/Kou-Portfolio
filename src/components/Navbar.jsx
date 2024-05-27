import { NavLink } from "react-router-dom"
import logo from '../assets/logo.png'

const Navbar = () => {
  return (

    <header className="header">

        <NavLink to="/" className="flex w-7 h-7 shrink-0 sm:w-10 sm:h-10" >
            <img src={logo} alt="logo" className="w-full h-full object-contain"/>
        </NavLink>
        
        <nav className="flex gap-5 sm:gap-14 font-medium">
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