import { Link, NavLink } from "react-router-dom";
import logo from '../assets/logo.png';
import { getCurrentUser } from "../utility/authUtils";
import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [adminInfo, setAdminInfo] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("Logged in:", currentUser.email);
      } else {
        console.log("User is null");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Messages'), (querySnapshot) => {
      const hasUnread = querySnapshot.docs.some(doc => doc.data().isRead === false);
      setHasUnreadMessages(hasUnread);
    }, (error) => {
      console.error("Error fetching Messages collection: ", error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const docRef = doc(db, 'Admin', 'v5NvvGA5zOcQVo7Oyzszq5ALoKd2');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setAdminInfo(docSnap.data());
      } else {
        console.log('No such document!');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      setIsDropdownOpen(false);
    });
  };

  const handleLink = () => {
    navigate('/Messages');
    setIsDropdownOpen(false);
  };

  return (
    <header className="header">
      
        <NavLink to="/" className="flex w-7 h-7 shrink-0 sm:w-10 sm:h-10">
          <img src={logo} alt="logo" className="w-full h-full object-contain"/>
        </NavLink>


      <nav className="flex gap-5 sm:gap-14 font-medium items-center">
        {hasUnreadMessages && (
          <Link to="/messages" className=''>
            <FontAwesomeIcon icon={faMessage} color='#ff4d4d' className="size-7 mt-1"/>
          </Link>
        )}

        <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link text-blue-100' : 'nav-link text-blue-300'}>
          About
        </NavLink>

        <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link text-blue-100' : 'nav-link text-blue-300'}>
          Projects
        </NavLink>

        <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link text-blue-100' : 'nav-link text-blue-300'}>
          Contact
        </NavLink>

        <div className="border-l-4 border-blue-300 h-10"/>

        {user ? (
          <div className="relative shrink-0" ref={dropdownRef}>
            <img
              src={adminInfo.pfp}
              alt="pfp"
              className="w-[50px] aspect-square rounded-full object-cover cursor-pointer"
              onClick={handleDropdownToggle}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 top-full bg-blue-300 shadow-md rounded-md mt-1 w-28">
                <div className="px-4 py-2 cursor-pointer hover:bg-black-500 rounded-md" onClick={handleLink}>
                  <p className="font-cocogoose">Messages</p>
                </div>

                <div className="px-4 py-2 cursor-pointer hover:bg-black-500 rounded-md" onClick={handleLogout}>
                  <p className="font-cocogoose">Log Out</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link text-blue-100' : 'nav-link text-blue-300'}>
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
