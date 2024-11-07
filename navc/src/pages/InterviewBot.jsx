import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Mic, Send } from "lucide-react";

const InterviewBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynth, setSpeechSynth] = useState(null);
  const [interviewState, setInterviewState] = useState("initial"); // initial, ready, questions, feedback, complete
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [candidateResponses, setCandidateResponses] = useState([]);

  useEffect(() => {
    setSpeechSynth(window.speechSynthesis);
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Start the interview process when component mounts
    if (interviewState === "initial") {
      startInterview();
    }
  }, [interviewState]);

  const genAI = new GoogleGenerativeAI("AIzaSyAj82UUdKTw0n94qkjAgbsCfHwnabsqIi4");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const speakText = (text) => {
    if (speechSynth) {
      speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Start listening for response after speaking
        if (interviewState === "questions") {
          setTimeout(() => {
            handleRecord();
          }, 1000);
        }
      };
      
      const voices = speechSynth.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Natural')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0];

      utterance.voice = englishVoice;
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1;
      
      speechSynth.speak(utterance);
    }
  };

  const fetchInterviewQuestions = async () => {
    const prompt = `Generate 5 technical interview questions for a software developer role. 
    Focus on fundamental concepts and problem-solving abilities. 
    Format each question clearly and professionally, as if asked by a real interviewer. 
    Return just the questions numbered 1-5, without answers.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const questionsText = response.text();
      // Split the response into individual questions
      const questionsList = questionsText.split(/\d+\.\s+/)
        .filter(q => q.trim().length > 0)
        .map(q => q.trim());
      setQuestions(questionsList);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([
        "Could you explain the difference between REST and GraphQL?",
        "How do you handle state management in your preferred frontend framework?",
        "Can you explain the concept of dependency injection?",
        "What strategies do you use for optimizing database queries?",
        "How do you approach testing in your development process?"
      ]);
    }
  };

  const startInterview = async () => {
    // Initial greeting
    const greeting = "Hello! I'm your AI interviewer today. I'll be asking you some questions about software development. Would you like to begin the interview?";
    addMessage("bot", greeting);
    speakText(greeting);
    setInterviewState("ready");
    await fetchInterviewQuestions();
  };

  const handleUserResponse = async (userInput) => {
    addMessage("user", userInput);
    
    if (interviewState === "ready") {
      if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("ready")) {
        const startMessage = "Great! Let's begin with the first question.";
        addMessage("bot", startMessage);
        speakText(startMessage);
        setInterviewState("questions");
        setTimeout(() => askNextQuestion(), 3000);
      } else {
        const retryMessage = "Please let me know when you're ready to start the interview.";
        addMessage("bot", retryMessage);
        speakText(retryMessage);
      }
      return;
    }

    if (interviewState === "questions") {
      // Store the candidate's response
      setCandidateResponses(prev => [...prev, {
        question: questions[currentQuestionIndex],
        response: userInput
      }]);

      // Move to next question or end interview
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeout(() => askNextQuestion(), 2000);
      } else {
        concludeInterview();
      }
    }
  };

  const askNextQuestion = () => {
    const question = questions[currentQuestionIndex];
    const formattedQuestion = `Question ${currentQuestionIndex + 1}: ${question}`;
    addMessage("bot", formattedQuestion);
    speakText(formattedQuestion);
  };

  const concludeInterview = async () => {
    setInterviewState("complete");
    const conclusion = "Thank you for participating in this interview. I've recorded your responses and enjoyed our conversation. Do you have any questions for me?";
    addMessage("bot", conclusion);
    speakText(conclusion);
  };

  const addMessage = (type, content) => {
    setMessages(prev => [...prev, {
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleRecord = () => {
    if (isSpeaking) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      await handleUserResponse(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    await handleUserResponse(inputText);
    setInputText("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Software Developer Interview</h2>
          <p className="text-sm text-gray-600">
            {interviewState === "questions" ? 
              `Question ${currentQuestionIndex + 1} of ${questions.length}` : 
              "AI Interviewer"
            }
          </p>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
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
                <p className="animate-pulse">Processing...</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex items-center space-x-2">
          <button
            onClick={handleRecord}
            className={`p-2 rounded-full ${
              isRecording 
                ? "bg-red-500 text-white" 
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            title={isRecording ? "Recording..." : "Start voice recording"}
          >
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Speak or type your response..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewBot;