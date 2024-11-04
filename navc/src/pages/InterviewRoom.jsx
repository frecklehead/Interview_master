import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Camera, CameraOff, Phone, PhoneOff } from 'lucide-react';

const InterviewRoom = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  const interviewer = {
    name: 'Sarah Parker',
    role: 'Senior Technical Recruiter',
    company: 'TechCorp Solutions'
  };

  const videoRef = useRef(null);
  
  const questions = [
    "Can you tell me about yourself and your background in technology?",
    "What made you interested in joining our company?",
    "Could you describe a challenging project you've worked on?",
    "How do you handle tight deadlines and pressure?",
    "Where do you see yourself in five years?"
  ];

  // Initialize speech recognition if available
  const recognition = 'webkitSpeechRecognition' in window
    ? new window.webkitSpeechRecognition()
    : null;

  if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
  }

  const synth = window.speechSynthesis;

  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [recognition]);

  const startCall = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setVideoStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setTimeout(() => {
        setIsConnecting(false);
        setIsCallActive(true);
        startInterview();
      }, 2000);
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setIsConnecting(false);
    }
  };

  const endCall = () => {
    if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    setIsCallActive(false);
    setInterviewComplete(true);
  };

  const toggleMic = () => {
    if (videoStream) {
      videoStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const startInterview = () => {
    speak(`Hello, I'm ${interviewer.name}, ${interviewer.role} at ${interviewer.company}. 
           Thank you for joining us today. Let's begin with the first question.`);
    setTimeout(askQuestion, 5000);
  };

  const askQuestion = () => {
    speak(questions[currentQuestion]);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="p-4 bg-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-white font-medium">
                {isConnecting ? 'Connecting...' : isCallActive ? 'Interview in progress' : 'Start Interview'}
              </span>
            </div>
            <span className="text-gray-300">{new Date().toLocaleTimeString()}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 h-[600px]">
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

          <div className="p-4 bg-gray-700 flex justify-center space-x-4">
            <button onClick={toggleMic} className={`p-3 rounded-full ${isMicOn ? 'bg-gray-600' : 'bg-red-500'}`}>
              {isMicOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
            </button>
            <button onClick={toggleCamera} className={`p-3 rounded-full ${isCameraOn ? 'bg-gray-600' : 'bg-red-500'}`}>
              {isCameraOn ? <Camera className="w-6 h-6 text-white" /> : <CameraOff className="w-6 h-6 text-white" />}
            </button>
            {!isCallActive ? (
              <button onClick={startCall} className="px-6 py-3 bg-green-500 text-white rounded-full flex items-center space-x-2" disabled={isConnecting}>
                <Phone className="w-6 h-6" />
                <span>{isConnecting ? 'Connecting...' : 'Join Interview'}</span>
              </button>
            ) : (
              <button onClick={endCall} className="px-6 py-3 bg-red-500 text-white rounded-full flex items-center space-x-2">
                <PhoneOff className="w-6 h-6" />
                <span>End Interview</span>
              </button>
            )}
          </div>

          {isCallActive && (
            <div className="p-4 bg-gray-800">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Current Question:</h3>
                <p className="text-gray-300">{questions[currentQuestion]}</p>
                <div className="mt-4">
                  <h3 className="text-white font-medium mb-2">Your Answer:</h3>
                  <p className="text-gray-300 min-h-[60px]">
                    {transcript || "Waiting for your response..."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
