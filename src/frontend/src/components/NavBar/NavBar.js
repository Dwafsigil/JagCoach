import React from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "./NavBar.css";

function NavBar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem("userEmail");

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="logo">JagCoach</div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>  
                <li><Link to="/upload">Upload</Link></li>  
                <li><Link to="/feedback">Feedback</Link></li>  
                <li><Link to="/library">Library</Link></li>  
                <li><Link to="/aboutus">About Us</Link></li>  
            </ul>
            {isLoggedIn && (
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </nav>
    );
}

export default NavBar;
