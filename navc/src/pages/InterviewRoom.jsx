import React, { useState, useEffect, useRef } from 'react';
import { Video, Mic, MicOff, Camera, CameraOff, Phone, PhoneOff, Send } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const InterviewRoom = () => {
  // Video call states
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [videoStream, setVideoStream] = useState(null);
  
  // Interview states
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [voices, setVoices] = useState([]);
  const [interviewState, setInterviewState] = useState("initial");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [candidateResponses, setCandidateResponses] = useState([]);
  const [isQuestionAsked, setIsQuestionAsked] = useState(false);
  const [error, setError] = useState(null);
  const [isApiReady, setIsApiReady] = useState(false);

  const videoRef = useRef(null);
  const chatContainerRef = useRef(null);

  const interviewer = {
    name: 'Lisa Su',
    role: 'Senior Technical Recruiter',
    company: 'AMD Corporation',
    avatar: 'LS'
  };
  useEffect(() => {
    const scrollChat = () => {
      if (chatContainerRef.current) {
        const scrollOptions = {
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        };
        
        // Use requestAnimationFrame for smooth scrolling
        requestAnimationFrame(() => {
          chatContainerRef.current.scrollTo(scrollOptions);
        });
      }
    };

    scrollChat();
    // Add a slight delay to ensure content is rendered
    const timeoutId = setTimeout(scrollChat, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Initialize speech synthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    setSpeechSynth(synth);

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      if (synth.speaking) synth.cancel();
    };
  }, []);

 

  // Start interview when call becomes active
  useEffect(() => {
    if (isCallActive && interviewState === "initial") {
      startInterview();
    }
  }, [isCallActive, interviewState]);
  
  useEffect(() => {
    if (questions.length > 0 && interviewState === "questions" && !isQuestionAsked) {
      askNextQuestion();
    }
  }, [currentQuestionIndex, questions, interviewState, isQuestionAsked]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const initializeAI = async () => {
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyBYl-MSPpfn_ClaR-3fIbmxVUtyeW0rKuY");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      setIsApiReady(true);
      return model;
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error);
      setError("Failed to initialize AI interviewer");
      return null;
    }
  };

  const speakText = async (text) => {
    console.log("Attempting to speak:", text);
    
    return new Promise((resolve) => {
      if (!speechSynth) {
        console.error("Speech synthesis not available");
        setError("Speech synthesis not available");
        resolve();
        return;
      }
  
      // Cancel any ongoing speech first
      speechSynth.cancel();
  
      // Clean the text by removing asterisks and normalizing whitespace
      const cleanText = text.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Configure speech settings
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
  
      // Try to find a female voice
      const availableVoices = speechSynth.getVoices();
      const femaleVoice = availableVoices.find(voice => 
        voice.name.toLowerCase().includes('female') ||
        voice.name.includes('en-US') ||
        voice.name.includes('en_US')
      );
      utterance.voice = femaleVoice || availableVoices[0];
  
      // Set up event handlers
      utterance.onstart = () => {
        console.log("Speech started");
        setIsSpeaking(true);
        setIsQuestionAsked(true);
      };
      
      utterance.onend = () => {
        console.log("Speech ended successfully");
        setIsSpeaking(false);
        if (interviewState === "questions") {
          setTimeout(() => {
            handleRecord();
          }, 1000);
        }
        resolve();
      };
  
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
        setError("Speech synthesis failed - trying again...");
        
        // Retry speech after a short delay
        setTimeout(() => {
          const retryUtterance = new SpeechSynthesisUtterance(cleanText);
          retryUtterance.rate = 0.9;
          retryUtterance.pitch = 1;
          retryUtterance.voice = utterance.voice;
          speechSynth.speak(retryUtterance);
        }, 100);
        
        resolve();
      };
  
      try {
        speechSynth.speak(utterance);
      } catch (error) {
        console.error("Error initiating speech:", error);
        setIsSpeaking(false);
        resolve();
      }
    });
  };



  const handleRecord = () => {
    if (isSpeaking) return;
  
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
  
    recognition.onstart = () => {
      setIsRecording(true);
      // Visual feedback that recording is active
      const micButton = document.querySelector('.video-mic-button');
      if (micButton) micButton.classList.add('recording');
    };
  
    recognition.onend = () => {
      setIsRecording(false);
      const micButton = document.querySelector('.video-mic-button');
      if (micButton) micButton.classList.remove('recording');
    };
  
    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      await handleUserResponse(transcript);
    };
  
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event);
      setIsRecording(false);
      setError("Failed to record speech. Please try again.");
    };
  
    recognition.start();
  };
  

  const fetchInterviewQuestions = async () => {
    setIsLoading(true);
    setError(null);
  
    const fallbackQuestions = [
      "Could you walk me through a challenging project you've worked on recently?",
      "How do you approach scaling a web application when user traffic grows significantly?",
      "Tell me about a time when you had to refactor complex code. What was your approach?",
      "How do you handle asynchronous operations in your applications?",
      "What's your philosophy on writing maintainable code?"
    ];
  
    try {
      const model = await initializeAI();
      if (!model) throw new Error("AI model not initialized");
  
      const prompt = `Generate 5 natural, conversational technical interview questions for a software developer role. 
        Do not use asterisks or special formatting. Keep questions clear and direct.
        Format: Simple numbered list 1-5.`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const questionsText = response.text();
      
      // Clean up questions by removing asterisks and extra whitespace
      const cleanQuestions = questionsText
        .split(/\d+\.\s+/)
        .filter(q => q.trim().length > 0)
        .map(q => q.replace(/\*/g, '').replace(/\s+/g, ' ').trim());
  
      setQuestions(cleanQuestions.length > 0 ? cleanQuestions : fallbackQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions(fallbackQuestions);
    } finally {
      setIsLoading(false);
    }
  };
  


  const startInterview = async () => {
    setInterviewState("starting");
    setError(null);
    
    try {
      await fetchInterviewQuestions();
      
      const greeting = `Hello! I'm Sarah Parker, your interviewer today from TechCorp Solutions. 
        I'll be asking you some technical questions about your software development experience. 
        Are you ready to begin?`;
      
      addMessage("interviewer", greeting);
      await speakText(greeting);
      setInterviewState("ready");
    } catch (error) {
      console.error("Error starting interview:", error);
      setError("Failed to start interview. Please try again.");
      setInterviewState("initial");
    }
  };

  const handleUserResponse = async (userInput) => {
    if (!userInput.trim() || isLoading || isSpeaking) return;
    
    setIsLoading(true);
    addMessage("candidate", userInput);
    
    try {
      switch (interviewState) {
        case "introduction":
          const transitionMessage = "Great! Let's move on to some technical questions. Are you ready?";
          addMessage("interviewer", transitionMessage);
          await speakText(transitionMessage);
          setInterviewState("ready");
          break;
          
        case "ready":
          if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("ready")) {
            setInterviewState("questions");
            await askNextQuestion();
          } else {
            const retryMessage = "Take your time. Just let me know when you're ready to start.";
            addMessage("interviewer", retryMessage);
            await speakText(retryMessage);
          }
          break;
          
        case "questions":
          await handleQuestionResponse(userInput);
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error("Error handling response:", error);
      setError("Failed to process response");
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  const handleQuestionResponse = async (userInput) => {
    setCandidateResponses(prev => [...prev, {
      question: questions[currentQuestionIndex],
      response: userInput
    }]);

    if (currentQuestionIndex < questions.length - 1) {
      const followUps = [
        "That's really interesting! Let's move on to the next question.",
        "Thank you for that detailed response. I'd like to ask you about something else now.",
        "Great perspective! I have another question for you.",
        "That makes sense. Let's explore another topic."
      ];
      
      const transitionMessage = followUps[currentQuestionIndex % followUps.length];
      addMessage("interviewer", transitionMessage);
      await speakText(transitionMessage);
      
      setCurrentQuestionIndex(prev => prev + 1);
      setIsQuestionAsked(false);
    } else {
      await concludeInterview();
    }
  };


  const askNextQuestion = async () => {
    if (!questions[currentQuestionIndex]) return;
    const question = questions[currentQuestionIndex];
    addMessage("interviewer", question);
    await speakText(question);
  };

  const concludeInterview = async () => {
    setInterviewState("complete");
    const conclusion = "Thank you so much for your time today! You've provided some great insights into your experience and approach. We'll be in touch soon with next steps. Do you have any questions for me?";
    addMessage("interviewer", conclusion);
    await speakText(conclusion);
  };

  const addMessage = (type, content) => {
    setMessages(prev => [...prev, {
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  // Video call functions
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
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }
    setIsCallActive(false);
    setInterviewState("initial");
    setMessages([]);
    setCurrentQuestionIndex(0);
    setCandidateResponses([]);
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
                          {interviewer.avatar}
                        </div>
                      </div>
                      <h3 className="text-white font-medium">{interviewer.name}</h3>
                      <p className="text-gray-300 text-sm">{interviewer.role}</p>
                      <p className="text-gray-400 text-xs">{interviewer.company}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Candidate video */}
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
   onClick={() => {
  if (!isRecording && !isSpeaking) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      await handleUserResponse(transcript);
      setInputText("");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
  }
}}
disabled={isSpeaking || isLoading || !isCallActive}
// className={`p-2 rounded-full ${
//   isRecording 
//     ? 'bg-red-500 text-white'
//     : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
// }`}
title={isRecording ? "Recording..." : "Start voice recording"}
    className={`video-mic-button p-3 rounded-full ${
      isMicOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'
    } ${isRecording ? 'recording animate-pulse ring-2 ring-blue-500' : ''}`}
   // Add recording functionality to the video mic button
  >
    {isMicOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
  </button>
  
  <button 
    onClick={toggleCamera}
    className={`p-3 rounded-full ${
      isCameraOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'
    }`}
  >
    {isCameraOn ? <Camera className="w-6 h-6 text-white" /> : <CameraOff className="w-6 h-6 text-white" />}
  </button>
  
  {!isCallActive ? (
    <button 
      onClick={startCall}
      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center space-x-2 disabled:opacity-50"
      disabled={isConnecting}
    >
      <Phone className="w-6 h-6" />
      <span>{isConnecting ? 'Connecting...' : 'Join Interview'}</span>
    </button>
  ) : (
    <button 
      onClick={endCall}
      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center space-x-2"
    >
      <PhoneOff className="w-6 h-6" />
      <span>End Interview</span>
    </button>
  )}
</div>
          </div>

          {/* Right side - Chat interface */}
          <div className="bg-white rounded-lg shadow-xl flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Interview Chat</h2>
              <p className="text-sm text-gray-600">
                {interviewState === "questions" ? 
                  `Question ${currentQuestionIndex + 1} of ${questions.length}` : 
                  "Chat with your interviewer"
                }
              </p>
            </div>

            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
            style={{ 
              height: 'calc(100% - 180px)',
              scrollBehavior: 'smooth'
            }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'candidate' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'candidate'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.type === 'interviewer' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {interviewer.avatar}
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {interviewer.name}
                        </span>
                      </div>
                    )}
                    <p>{message.content}</p>
                    <span className="text-xs opacity-75 block mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg p-3">
                    <p className="animate-pulse">Preparing response...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat input */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                {/* <button
                  onClick={() => {
                    if (!isRecording && !isSpeaking) {
                      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                      if (!SpeechRecognition) {
                        alert("Speech recognition is not supported in this browser.");
                        return;
                      }

                      const recognition = new SpeechRecognition();
                      recognition.lang = 'en-US';
                      recognition.continuous = false;
                      recognition.interimResults = false;

                      recognition.onstart = () => setIsRecording(true);
                      recognition.onend = () => setIsRecording(false);

                      recognition.onresult = async (event) => {
                        const transcript = event.results[0][0].transcript;
                        setInputText(transcript);
                        await handleUserResponse(transcript);
                        setInputText("");
                      };

                      recognition.onerror = (event) => {
                        console.error("Speech recognition error:", event.error);
                        setIsRecording(false);
                      };

                      recognition.start();
                    }
                  }}
                  disabled={isSpeaking || isLoading || !isCallActive}
                  className={`p-2 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed'
                  }`}
                  title={isRecording ? "Recording..." : "Start voice recording"}
                >
                  <Mic className="w-5 h-5" />
                </button> */}
                
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleUserResponse(inputText);
                      setInputText("");
                    }
                  }}
                  placeholder={
                    !isCallActive 
                      ? "Join the interview to start chatting..."
                      : isRecording 
                        ? "Recording..."
                        : "Type your response..."
                  }
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isRecording || isSpeaking || isLoading || !isCallActive}
                />
                
                {/* <button
                  onClick={() => {
                    handleUserResponse(inputText);
                    setInputText("");
                  }}
                  disabled={!inputText.trim() || isRecording || isSpeaking || isLoading || !isCallActive}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  title="Send message"
                >
                  <Send className="w-5 h-5" />
                </button> */}
              </div>
              
              {/* Interview progress indicator */}
              {isCallActive && interviewState === "questions" && (
                <div className="mt-4">
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-1 bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
                    }
export default InterviewRoom;