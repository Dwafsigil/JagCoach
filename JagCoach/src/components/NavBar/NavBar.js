import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; 
import "./NavBar.css";
import { FaHome, FaColumns, FaBook, FaInfoCircle } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const pageMapping = {
    '/': 'home',
    '/dashboard': 'dashboard',
    '/library':'library',
    '/aboutus':'aboutus'
  };

function NavBar() {
    const { pathname } = useLocation();
    const currentPage = pageMapping[pathname] || '';

    const [activeLink, setActiveLink] = useState(currentPage);
   
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };
   
    useEffect(() => {
        setActiveLink(currentPage);
      }, [currentPage]);
   
    return (
        <nav className="navbar">
            <center><div className="logo"><img src="/Jaguar-Head-Maroon-White.png" alt="JagCoach Logo" className="nav-logo" /><span className="nav-text">JagCoach</span></div></center>
            <ul className="nav-links">
                <li className={activeLink === "home" ? 'active-empty' : 'empty-div'}>
                    <div className={activeLink === "home" ? 'active-empty-div' : ''}>.</div>
                </li>
                <li>
                    <NavLink 
                        to="/" 
                        className={activeLink === "home" ? 'active' : ''}
                        onClick={() => handleLinkClick("home")}
                    ><FaHome />
                        <span className="nav-text">Home</span>
                    </NavLink>
                </li>
                <li className={activeLink === "dashboard" ||activeLink === "home"? 'active-empty' : 'empty'} > <div className={activeLink === "dashboard" ? 'active-empty-div' : 'empty-div'} >.</div> </li>
                <li>
                    <NavLink 
                        to="/dashboard" 
                        className={activeLink === "dashboard" ? 'active' : ''}
                        onClick={() => handleLinkClick("dashboard")}
                    ><FaColumns /> 
                       <span className="nav-text">Dashboard</span>
                    </NavLink>
                </li>
                <li className={activeLink === "dashboard"||activeLink === "library"? 'active-empty' : 'empty'}> <div  className={activeLink === "library"? 'active-empty-div' : 'empty-div'}>.</div> </li>
                <li>
                    <NavLink 
                        to="/library" 
                        className={activeLink === "library" ? 'active' : ''}
                        onClick={() => handleLinkClick("library")}
                    ><FaBook />
                        <span className="nav-text">Library</span>
                    </NavLink>
                </li>
                <li className={activeLink === "aboutus"||activeLink === "library"? 'active-empty' : 'empty'}> <div className={activeLink === "aboutus" ? 'active-empty-div' : 'empty-div'} >.</div> </li>
                <li>
                    <NavLink 
                        to="/aboutus" 
                        className={activeLink === "aboutus" ? 'active' : ''}
                        onClick={() => handleLinkClick("aboutus")}
                    ><FaInfoCircle />
                       <span className="nav-text">About Us</span>
                    </NavLink>
                </li>
                <li className={activeLink === "aboutus"? 'active-empty' : ''}>
                    <div className={activeLink === "aboutus" ? 'empty-div' : 'empty'} >.</div>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;

