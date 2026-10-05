import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Square, Play, RefreshCw, Activity, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const AI_QUESTIONS = [
  "That's interesting. Can you tell me more about the specific technologies you used?",
  "How did you handle disagreements within your team during that project?",
  "What was the most challenging part of that implementation?",
  "If you could do it again, what would you change about your approach?",
  "How did you ensure the scalability of that solution?",
  "Great. Let's move on. Describe a time you failed and what you learned from it."
];

const VoiceInterview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'ai', text: 'Hello! I am your AI Interviewer. Are you ready to begin the behavioral interview?' }
  ]);
  const recognitionRef = useRef(null);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) utterance.voice = voices.find(v => v.name.includes('Google UK English Female') || v.name.includes('Female')) || voices[0];
      
      utterance.rate = 0.95;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      
      rec.onresult = (event) => {
        let finalStr = '';
        let interimStr = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript;
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }
        if (finalStr) setCurrentSpeech(prev => prev + ' ' + finalStr);
        setInterimText(interimStr);
      };
      recognitionRef.current = rec;
    }

    setTimeout(() => {
      speakText('Hello! I am your AI Interviewer. Are you ready to begin the behavioral interview?');
    }, 1000);

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const generateAiInterviewerReply = async (userAnswer, chatHistory) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey.length > 20) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const modelCandidates = ["gemini-3.6-flash", "gemini-flash-latest"];
        
        const historyPrompt = chatHistory.slice(-4).map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n');
        const prompt = `You are an elite, realistic FAANG behavioral interviewer.
Conversation so far:
${historyPrompt}
Candidate just answered: "${userAnswer}"

Your task:
Give a very concise follow-up response (1-2 sentences maximum). Either briefly acknowledge a detail they mentioned, or ask a sharp behavioral/technical follow-up question (STAR method style). Keep it natural and ready for text-to-speech. Do not include markdown or quotes.`;

        for (const mName of modelCandidates) {
          try {
            const model = genAI.getGenerativeModel({ model: mName });
            const result = await Promise.race([
              model.generateContent(prompt),
              new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 7000))
            ]);
            const text = result.response.text().trim();
            if (text) return text;
          } catch {
            continue;
          }
        }
      }
    } catch (e) {
      console.warn("Gemini voice interview fallback:", e.message);
    }
    return AI_QUESTIONS[Math.floor(Math.random() * AI_QUESTIONS.length)];
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      
      const finalUserText = (currentSpeech + ' ' + interimText).trim();
      if (finalUserText) {
        const updatedHistory = [...conversation, { role: 'user', text: finalUserText }];
        setConversation(updatedHistory);
        setCurrentSpeech('');
        setInterimText('');
        setIsAiThinking(true);

        const aiReply = await generateAiInterviewerReply(finalUserText, updatedHistory);
        setIsAiThinking(false);
        setConversation(prev => [...prev, { role: 'ai', text: aiReply }]);
        speakText(aiReply);
      } else {
        setCurrentSpeech('');
        setInterimText('');
      }
    } else {
      setIsRecording(true);
      window.speechSynthesis.cancel();
      setCurrentSpeech('');
      setInterimText('');
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) { console.error(e); }
      }
    }
  };

  const handleReset = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    window.speechSynthesis.cancel();
    setIsRecording(false);
    setIsAiSpeaking(false);
    setCurrentSpeech('');
    setInterimText('');
    const introMsg = 'Hello! I am your AI Interviewer. Are you ready to begin the behavioral interview?';
    setConversation([{ role: 'ai', text: introMsg }]);
    setTimeout(() => speakText(introMsg), 500);
  };

  const handleRepeat = () => {
    if (isRecording || isAiSpeaking) return;
    const lastAiMsg = [...conversation].reverse().find(msg => msg.role === 'ai');
    if (lastAiMsg) {
      speakText(lastAiMsg.text);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8 h-full flex flex-col">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Voice Mock Interview</h1>
        <p className="text-gray-400">Practice behavioral questions with real-time speech-to-text and AI voice synthesis.</p>
      </header>

      <div className="flex-1 grid lg:grid-cols-3 gap-8 min-h-[500px]">
        {/* Active Call Interface */}
        <div className="lg:col-span-1 glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-surface-dark to-[#0f172a]">
          {/* Animated AI Avatar Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] transition-all duration-1000 ${
            isAiSpeaking ? 'bg-blue-500/40 scale-150' : 'bg-blue-500/10 scale-100'
          }`} />

          <div className="relative z-10 text-center mb-12">
            <div className={`w-32 h-32 mx-auto rounded-full bg-gray-900 border-4 flex items-center justify-center mb-6 shadow-2xl transition-all duration-500 ${
              isAiSpeaking ? 'border-blue-500 shadow-blue-500/50' : 'border-gray-700 shadow-none'
            }`}>
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {isAiSpeaking ? (
                  <Activity className="w-12 h-12 text-white animate-pulse" />
                ) : (
                  <Volume2 className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">AI Interviewer</h2>
            <p className="text-gray-400 mt-2 text-sm flex items-center justify-center gap-1.5">
              {isAiSpeaking ? 'Speaking...' : isAiThinking ? 'AI Analyzing Response...' : isRecording ? 'Listening to Candidate...' : 'Ready'}
            </p>
          </div>

          {/* Controls */}
          <div className="relative z-10 flex items-center gap-6">
            <button 
              onClick={handleReset}
              className="p-4 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border border-gray-600 active:scale-95"
              title="Reset Interview"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
            
            <button 
              onClick={toggleRecording}
              className={`p-6 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                isRecording 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                  : 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8 fill-current" /> : <Mic className="w-8 h-8" />}
            </button>

            <button 
              onClick={handleRepeat}
              className="p-4 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors border border-gray-600 active:scale-95"
              title="Repeat AI Question"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Live Transcript */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Live Transcript</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {conversation.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <span className="text-xs text-gray-500 mb-1 px-1">
                  {msg.role === 'user' ? 'You' : 'AI Interviewer'}
                </span>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-sm' 
                    : 'bg-white/10 border border-white/10 text-gray-200 rounded-tl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            
            {isRecording && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col max-w-[80%] ml-auto items-end">
                 <span className="text-xs text-gray-500 mb-1 px-1">Listening...</span>
                 <div className="p-4 rounded-2xl bg-blue-500/50 border border-blue-500/50 text-white rounded-tr-sm flex flex-col gap-2">
                    {currentSpeech || interimText ? (
                      <p className="leading-relaxed opacity-80">{currentSpeech} {interimText}</p>
                    ) : (
                      <span className="flex gap-1 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                 </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterview;
