import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Upload from "./components/Upload/Upload";
import Feedback from "./components/FeedBack/Feedback";
import Library from "./components/Library/Library";
import Main from "./components/mainpage/main";
import AboutUs from "./components/Aboutus/Aboutus";
import LoginPage from "./components/Login/LoginPage";
import "./App.css";

function App() {
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem("userEmail");
    const hideNav = location.pathname === "/login";

    return (
        <div className="app-container">
            {!hideNav && <NavBar />}
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/"
                    element={isLoggedIn ? <Main /> : <Navigate to="/login" />}
                />
                <Route
                    path="/upload"
                    element={isLoggedIn ? <Upload /> : <Navigate to="/login" />}
                />
                <Route
                    path="/feedback"
                    element={isLoggedIn ? <Feedback /> : <Navigate to="/login" />}
                />
                <Route
                    path="/library"
                    element={isLoggedIn ? <Library /> : <Navigate to="/login" />}
                />
                <Route
                    path="/aboutus"
                    element={isLoggedIn ? <AboutUs /> : <Navigate to="/login" />}
                />
            </Routes>
        </div>
    );
}

export default App;
