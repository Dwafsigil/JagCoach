
import './App.css'
import Home from './pages/Dashboard/Dashboard'
import Dashboard from './pages/Home/Home'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  const [videoUrl, setVideoUrl] = useState(null);
  
  return (
    <div className="App">
      <BrowserRouter>  
        <Routes>
          <Route index={true} path="/" element={<Dashboard 
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}/>} />
          <Route index={false} path="/dashboard" element={<Home videoUrl={videoUrl}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
