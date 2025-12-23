import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function AIAssistantScreen() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  interface Message {
    id: number;
    type: 'user' | 'ai';
    message: string;
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      message: 'નમસ્તે! હું જ્ઞાન સહાયક છું. તમે મને શિક્ષણ, કરિયર અથવા સમાજ વિશે કોઈપણ પ્રશ્ન પૂછી શકો છો.'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🤖 Gemini 1.5 Flash (v1beta)
  const callGeminiAI = async (userText: string) => {
    if (!GEMINI_API_KEY) return "ભૂલ: API Key સેટ કરેલી નથી.";

    try {
      const prompt = `You are a helpful Gujarati assistant. Answer in Gujarati only. Question: ${userText}`;

      // ✅ નવી કી સાથે આ URL 100% ચાલશે
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        console.error("API Error:", data.error);
        throw new Error(data.error.message);
      }

      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }
      return "માફ કરશો, જવાબ મળ્યો નથી.";

    } catch (error: any) {
      return `તકનીકી ખામી: ${error.message}. (કૃપા કરીને નવી API Key 'New Project' માં બનાવીને સેટ કરો)`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    const newUserMsg: Message = { id: Date.now(), type: 'user', message: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    const aiText = await callGeminiAI(userMessage);

    const newAiMsg: Message = { id: Date.now() + 1, type: 'ai', message: aiText };
    setMessages(prev => [...prev, newAiMsg]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 font-gujarati">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 safe-area-top px-4 py-4 shadow-md z-10">
        <div className="flex items-center space-x-3">
           <button onClick={() => navigate('/home')} className="p-1 bg-white/20 rounded-full">
              <ArrowLeft className="w-6 h-6 text-white" />
           </button>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">જ્ઞાન સહાયક</h1>
            <p className="text-violet-100 text-xs flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              Online • AI Assistant
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto bg-[#EBE5DE]">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mb-1 shadow-sm ${
                msg.type === 'user' ? 'bg-[#1a237e]' : 'bg-gradient-to-br from-violet-500 to-purple-600'
              }`}>
                {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`px-4 py-3 shadow-md text-sm leading-relaxed whitespace-pre-wrap ${
                msg.type === 'user' ? 'bg-[#dcf8c6] text-gray-800 rounded-2xl rounded-br-none' : 'bg-white text-gray-800 rounded-2xl rounded-bl-none'
              }`}>
                {msg.message}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
            <div className="bg-white px-4 py-3 rounded-2xl shadow-md flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white p-3 safe-area-bottom shadow-lg">
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="તમારો પ્રશ્ન પૂછો..."
            disabled={loading}
            className="flex-1 bg-transparent focus:outline-none text-gray-700"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-violet-600 rounded-full text-white disabled:opacity-50 active:scale-90 transition-transform"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}