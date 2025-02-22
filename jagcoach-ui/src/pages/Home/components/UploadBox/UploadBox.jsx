import './UploadBox.css'
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

function UploadBox({setVideoUrl}) {
  const [redirect, setRedirect] = useState(false);
 
  const uploader = Uploader({
    apiKey: // your api key here 
  });
  
  const options = {
    apiKey: "free",
    maxFileCount: 1,
    styles: {
      colors: {
        primary: "#635dd6",
      }
    }
  }
  
  const onUpdate = (newFiles) => {
    setVideoUrl(newFiles[0].fileUrl);
    setRedirect(true)
    
  };

  if (redirect) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="UploadBox">
        <UploadDropzone uploader={uploader}
                        options={options}
                        onUpdate={onUpdate}
                        height="70vh" />
    </div>
  )
}

export default UploadBox