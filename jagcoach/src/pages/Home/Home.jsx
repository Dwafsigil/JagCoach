// import Navbar from '../../components/Navbar/Navbar'
import UploadBox from './components/UploadBox/UploadBox'

import './Home.css'

function Home({setVideoUrl}) {
  return (
    <div className="home-page">
        {/* <Navbar/> */}
        <div className="home-content">
            <UploadBox setVideoUrl={setVideoUrl}/>
        </div>
    </div>
  )
}

export default Home
