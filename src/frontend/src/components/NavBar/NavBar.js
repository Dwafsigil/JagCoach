import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { NavLink, useLocation } from "react-router-dom"; 
import Modal from 'react-modal';
import { FaHome, FaColumns, FaBook, FaInfoCircle } from "react-icons/fa";
import "./NavBar.css";
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';


const pageMapping = {
  '/': 'home',
  '/dashboard': 'dashboard',
  '/library': 'library',
  '/aboutus': 'aboutus'
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    width: '430px',
  },
};


const NavBar = forwardRef(({ user, setUser }, ref) => {
  const { pathname } = useLocation();
  const currentPage = pageMapping[pathname] || '';
  const [activeLink, setActiveLink] = useState(currentPage);
  const [modalSignInIsOpen, setSignInIsOpen] = useState(false);
  const [modalSignUpIsOpen, setSignUpIsOpen] = useState(false);

  useEffect(() => {
    setActiveLink(currentPage);

    const storedUserId = localStorage.getItem("user_id");
    const storedFullName = localStorage.getItem("full_name");
    if (storedUserId && storedFullName) {
      setUser({ id: storedUserId, fullName: storedFullName });
    }
  }, [currentPage, setUser]);

  
  useImperativeHandle(ref, () => ({
    openLoginModal: () => {
      setSignUpIsOpen(false);
      setSignInIsOpen(true);
    }
  }));

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  function closeSignInModal() {
    if (modalSignUpIsOpen) {
      setSignUpIsOpen(false);
    } else {
      setSignInIsOpen(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("http://34.55.142.231:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful");
        setUser({ id: data.user_id, fullName: data.fullName, email });
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("full_name", data.fullName);
        setSignInIsOpen(false);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error occurred");
    }
  }

  async function signup(event) {
    event.preventDefault();
    const fullName = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("http://34.55.142.231:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! Please login now.");
        setSignUpIsOpen(false);
        setSignInIsOpen(true);
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup error occurred");
    }
  }

  function logout() {
    console.log("Logout clicked");
    setUser(null);
    localStorage.removeItem("user_id");
    localStorage.removeItem("full_name");
  }

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => window.location.href = "/"}>
        <img src="/Jaguar-Head-Maroon-White.png" alt="JagCoach Logo" className="nav-logo" />
        <span className="nav-text">JagCoach</span>
      </div>

      <ul className="nav-links">
        {/* Nav Links */}
        <li className={activeLink === "home" ? 'active-empty' : 'empty-div'}>
          <div className={activeLink === "home" ? 'active-empty-div' : ''}>.</div>
        </li>
        <li>
          <NavLink to="/" className={activeLink === "home" ? 'active' : ''} onClick={() => handleLinkClick("home")}>
            <FaHome title="Home" />
            <span className="nav-text">Home</span>
          </NavLink>
        </li>
        <li className={activeLink === "dashboard" || activeLink === "home" ? 'active-empty' : 'empty'}>
          <div className={activeLink === "dashboard" ? 'active-empty-div' : 'empty-div'}>.</div>
        </li>
        <li>
          <NavLink to="/dashboard" className={activeLink === "dashboard" ? 'active' : ''} onClick={() => handleLinkClick("dashboard")}> 
            <FaColumns title="Dashboard"/>
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </li>

        {user && (
          <>
            <li className={activeLink === "dashboard" || activeLink === "library" ? 'active-empty' : 'empty'}>
              <div className={activeLink === "library" ? 'active-empty-div' : 'empty-div'}>.</div>
            </li>
            <li>
              <NavLink to="/library" className={activeLink === "library" ? 'active' : ''} onClick={() => handleLinkClick("library")}> 
                <FaBook title="Library"/>
                <span className="nav-text">Library</span>
              </NavLink>
            </li>
          </>
        )}

        <li className={activeLink === "aboutus" || (user ? activeLink === "library" : activeLink === "dashboard") ? 'active-empty' : 'empty'}>
          <div className={activeLink === "aboutus" ? 'active-empty-div' : 'empty-div'}>.</div>
        </li>

        <li>
          <NavLink to="/aboutus" className={activeLink === "aboutus" ? 'active' : ''} onClick={() => handleLinkClick("aboutus")} > 
            <FaInfoCircle title="About Us"/>
            <span className="nav-text">About Us</span>
          </NavLink>
        </li>

        <li className={activeLink === "aboutus" ? 'active-empty' : ''}>
          <div className={activeLink === "aboutus" ? 'empty-div' : 'empty'}>.</div>
        </li>
      </ul>

      <div className="logout-button-div">
        {user && (
          <div style={{ color: "white", fontWeight: "bold", marginBottom: "10px" }}>
            Welcome, {user.fullName}!
          </div>
        )}

        <button className="login-button" onClick={user ? logout : () => setSignInIsOpen(true)}>
        {user ? <FaSignOutAlt className="login-icon" title="Sign Out"/>: <FaSignInAlt className="login-icon" title="Sign In"/>}&nbsp;&nbsp;&nbsp;<div>{user ? 'Logout' : 'Login'}</div> 
        </button>

        <Modal
          isOpen={modalSignInIsOpen}
          onRequestClose={closeSignInModal}
          style={customStyles}
          contentLabel="Login Modal"
        >
          <div>
            <div className="login-header">
              <h2>{modalSignUpIsOpen ? 'Sign Up' : 'Sign In'}</h2>
              <button onClick={closeSignInModal}>ⅹ</button>
            </div>

            {modalSignUpIsOpen ? (
              <form className="login-form" onSubmit={signup}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" placeholder="Full Name" required />

                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="your@email.com" required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Password" required />

                <button type="submit">Sign Up</button>
              </form>
            ) : (
              <div>
                <form className="login-form" onSubmit={login}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="your@email.com" required />

                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" placeholder="Password" required />

                  <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <span className="signup-link" style={{ textDecoration: 'underline' }} onClick={() => setSignUpIsOpen(true)}>Sign Up</span></p>
              </div>
            )}
          </div>
        </Modal>
      </div>
      
    </nav>
  );
});

export default NavBar;


