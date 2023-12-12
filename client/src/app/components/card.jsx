import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

export default function VideoCallCard({ videoSrc,height,width }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);  // After the component is mounted, set isMounted to true
  }, []);

  if (!isMounted) {
    return null;  // If the component hasn't mounted yet, don't render anything
  }

  // Once the component has mounted, render the ReactPlayer
  return (
    <div>
      <ReactPlayer
        playing
        url={videoSrc}
        height={height}
        width={width}
        autoPlay
      />
    </div>
  );
}
