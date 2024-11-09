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
  const [voices, setVoices] = useState([]);
  const [interviewState, setInterviewState] = useState("initial");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [candidateResponses, setCandidateResponses] = useState([]);
  const [isQuestionAsked, setIsQuestionAsked] = useState(false);

  // Initialize speech synthesis and voices
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
      if (synth.speaking) {
        synth.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (interviewState === "initial") {
      startInterview();
    }
  }, [interviewState]);

  // Monitor question changes and interview state
  useEffect(() => {
    if (questions.length > 0 && interviewState === "questions" && !isQuestionAsked) {
      askNextQuestion();
    }
  }, [currentQuestionIndex, questions, interviewState, isQuestionAsked]);

  const genAI = new GoogleGenerativeAI("YOUR-API-KEY");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const speakText = async (text) => {
    if (!speechSynth || !voices.length) return;
  
    // Cancel any ongoing speech
    speechSynth.cancel();
  
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Find an English voice
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Natural')
      ) || voices.find(voice => 
        voice.lang.startsWith('en')
      ) || voices[0];
    
      utterance.voice = englishVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsQuestionAsked(true);
      };
    
      utterance.onend = () => {
        setIsSpeaking(false);
        if (interviewState === "questions") {
          setTimeout(() => {
            handleRecord();
          }, 1000);
        }
    
        // Smooth scroll to the last message
        const chatContainer = document.querySelector('.h-96');
        if (chatContainer) {
          chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
        resolve();
      };
    
      speechSynth.speak(utterance);
    });
  };

  const fetchInterviewQuestions = async () => {
    setIsLoading(true);
    const prompt = `Generate 5 unique technical interview questions for a software developer role. 
    Mix different topics like algorithms, system design, coding practices, and problem-solving.
    Make questions natural and conversational.
    Return just the questions numbered 1-5, without answers.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const questionsText = response.text();
      const questionsList = questionsText.split(/\d+\.\s+/)
        .filter(q => q.trim().length > 0)
        .map(q => q.trim());
      
      if (questionsList.length === 0) throw new Error("No questions generated");
      
      setQuestions(questionsList);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([
        "Can you explain how you would design a scalable web application?",
        "What's your approach to handling async operations in JavaScript?",
        "How do you ensure code quality in your development process?",
        "Explain the concept of REST API best practices.",
        "How would you optimize the performance of a slow database query?"
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startInterview = async () => {
    await fetchInterviewQuestions();
    const greeting = "Hello! I'm your AI interviewer today. I'll be asking you some technical questions about software development. Would you like to begin the interview?";
    addMessage("bot", greeting);
    await speakText(greeting);
    setInterviewState("ready");
  };

  const handleUserResponse = async (userInput) => {
    if (!userInput.trim()) return;
    
    addMessage("user", userInput);
    
    if (interviewState === "ready") {
      if (userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("ready")) {
        const startMessage = "Great! Let's begin with the first question.";
        addMessage("bot", startMessage);
        await speakText(startMessage);
        setInterviewState("questions");
        setIsQuestionAsked(false);
      } else {
        const retryMessage = "Please let me know when you're ready to start the interview.";
        addMessage("bot", retryMessage);
        await speakText(retryMessage);
      }
      return;
    }

    if (interviewState === "questions") {
      setCandidateResponses(prev => [...prev, {
        question: questions[currentQuestionIndex],
        response: userInput,
        timestamp: new Date().toISOString()
      }]);

      if (currentQuestionIndex < questions.length - 1) {
        const transitionMessage = "Thank you. Let's move on to the next question.";
        addMessage("bot", transitionMessage);
        await speakText(transitionMessage);
        
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsQuestionAsked(false);
        }, 1000);
      } else {
        concludeInterview();
      }
    }
  };

  const askNextQuestion = async () => {
    if (!questions[currentQuestionIndex]) return;
    
    const question = questions[currentQuestionIndex];
    const formattedQuestion = `Question ${currentQuestionIndex + 1}: ${question}`;
    addMessage("bot", formattedQuestion);
    await speakText(formattedQuestion);
  };

  const concludeInterview = async () => {
    setInterviewState("complete");
    const conclusion = "Thank you for completing the interview. I've recorded all your responses. Please end call to review the interview";
    addMessage("bot", conclusion);
    await speakText(conclusion);
    
    console.log("Interview Responses:", {
      timestamp: new Date().toISOString(),
      questions: questions,
      responses: candidateResponses
    });
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
        
        <div className="h-96 overflow-y-auto p-4 space-y-4 scroll-smooth">
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
                <p className="animate-pulse">Preparing questions...</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex items-center space-x-2">
          <button
            onClick={handleRecord}
            disabled={isSpeaking || isLoading}
            className={`p-2 rounded-full ${
              isRecording 
                ? "bg-red-500 text-white" 
                : "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100"
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
            disabled={isRecording || isSpeaking || isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isRecording || isSpeaking || isLoading}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300"
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