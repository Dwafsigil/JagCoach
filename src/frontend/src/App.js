import React from "react";
import { Routes, Route } from "react-router-dom"; 
import NavBar from "./components/NavBar/NavBar";
import Upload from "./components/Upload/Upload";
import Feedback from "./components/FeedBack/Feedback";
import Library from "./components/Library/Library";
import Main from "./components/mainpage/main"; 
import AboutUs from "./components/Aboutus/Aboutus";
import "./App.css";

function App() {
    return (
        <div className="app-container">
            <NavBar />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/library" element={<Library />} />
                <Route path="/aboutus" element={<AboutUs />} />
            </Routes>
        </div>
    );
}

export default App;
