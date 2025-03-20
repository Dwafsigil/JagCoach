import React from "react";
import { Routes, Route } from "react-router-dom"; 
import NavBar from "./components/NavBar/NavBar";
import Dashboard from "./components/Dashboard/Dashboard";
import Library from "./components/Library/Library";
import Main from "./components/mainpage/main"; 
import AboutUs from "./components/Aboutus/Aboutus";
import "./App.css";

function App() {
    return (
        <div className="app-container">
            <NavBar />
            <div className="main-content"><Routes>
                <Route path="/" element={<Main />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/library" element={<Library />} />
                <Route path="/aboutus" element={<AboutUs />} />
            </Routes>
        </div></div>
    );
}

export default App;
