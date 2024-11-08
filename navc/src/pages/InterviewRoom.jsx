import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Camera, CameraOff, Phone, PhoneOff } from 'lucide-react';
import InterviewBot from './InterviewBot';

const InterviewRoom = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoStream, setVideoStream] = useState(null);

  const interviewer = {
    name: 'Sarah Parker',
    role: 'Senior Technical Recruiter',
    company: 'TechCorp Solutions'
  };

  const videoRef = useRef(null);

  const startCall = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => {
        setIsConnecting(false);
        setIsCallActive(true);
      }, 2000);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    setIsCallActive(false);
  };

  

  const toggleCamera = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-2rem)]">
          {/* Left side - Video call */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl flex flex-col">
            <div className="p-4 bg-gray-700 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-white font-medium">
                  {isConnecting ? 'Connecting...' : isCallActive ? 'Interview in progress' : 'Start Interview'}
                </span>
              </div>
              <span className="text-gray-300">{new Date().toLocaleTimeString()}</span>
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {/* Interviewer video/avatar */}
              <div className="relative rounded-lg overflow-hidden bg-gray-700">
                {isCallActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-blue-500 mx-auto mb-4 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                          {interviewer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                      <h3 className="text-white font-medium">{interviewer.name}</h3>
                      <p className="text-gray-300 text-sm">{interviewer.role}</p>
                      <p className="text-gray-400 text-xs">{interviewer.company}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Your video */}
              <div className="relative rounded-lg overflow-hidden bg-gray-700">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  You
                </div>
              </div>
            </div>

            {/* Video controls */}
            <div className="p-4 bg-gray-700 flex justify-center space-x-4">
             
              <button 
                onClick={toggleCamera} 
                className={`p-3 rounded-full ${isCameraOn ? 'bg-gray-600' : 'bg-red-500'}`}
              >
                {isCameraOn ? <Camera className="w-6 h-6 text-white" /> : <CameraOff className="w-6 h-6 text-white" />}
              </button>
              {!isCallActive ? (
                <button 
                  onClick={startCall} 
                  className="px-6 py-3 bg-green-500 text-white rounded-full flex items-center space-x-2"
                  disabled={isConnecting}
                >
                  <Phone className="w-6 h-6" />
                  <span>{isConnecting ? 'Connecting...' : 'Join Interview'}</span>
                </button>
              ) : (
                <button 
                  onClick={endCall} 
                  className="px-6 py-3 bg-red-500 text-white rounded-full flex items-center space-x-2"
                >
                  <PhoneOff className="w-6 h-6" />
                  <span>End Interview</span>
                </button>
              )}
            </div>
          </div>

          {/* Right side - Interview Bot */}
          
            <div className="h-full">
              <InterviewBot />
            </div>
        
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;