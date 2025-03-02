
import VideoPlayer from './components/VideoPlayer/VideoPlayer'
import './Dashboard.css'

function Dashboard({videoUrl}) {
  return (
    <div className="dashboard-page">
        {/* <Navbar/> */}
        <div className='dashboard-content'> 
          <h1>Video Analysis Dashboard</h1>
          <div className='video-player'>
            <VideoPlayer videoUrl={videoUrl}/> 
          </div>
          
       </div>
    </div>
  )
}

export default Dashboard
