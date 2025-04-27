import React, { useRef, useEffect } from 'react';

const AnimationPlayer = ({ videoUrl, isLoading, error }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // If we have a new video URL, reload the video player
    if (videoRef.current && videoUrl) {
      videoRef.current.load();
    }
  }, [videoUrl]);

  if (isLoading) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: "400px" }}>
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your animation...</p>
          <p className="text-gray-500 text-sm mt-2">This may take a few minutes</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 rounded-lg flex items-center justify-center" style={{ height: "400px" }}>
        <div className="text-center p-6">
          <div className="mx-auto mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Error generating animation</p>
          <p className="text-gray-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: "400px" }}>
        <div className="text-center p-6">
          <div className="mx-auto mb-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600">Enter a prompt to generate a mathematical animation</p>
          <p className="text-gray-500 text-sm mt-2">Your animation will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
      <video 
        ref={videoRef}
        className="w-full" 
        controls
        autoPlay
        style={{ maxHeight: "600px" }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="p-4 bg-gray-900 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Generated Animation</h3>
          <a 
            href={videoUrl} 
            download 
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default AnimationPlayer;