import './VideoPlayer.css'


function VideoPlayer({videoUrl}) {
  return (
    <div className="video-player">
        {videoUrl?(
          <div>
            <video controls width="980" >
                <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
            ):(<div>   
                
            </div>)}
        
    </div>
  )
}

export default VideoPlayer