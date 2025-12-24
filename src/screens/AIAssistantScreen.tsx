import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, ArrowLeft, Trash2, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase'; // ખાતરી કરો કે પાથ સાચો છે

export default function AIAssistantScreen() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Netlify Environment Variable
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  interface Message {
    id: string | number;
    type: 'user' | 'ai';
    message: string;
    createdAt?: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);

  // ૧. સ્ક્રોલ ટુ બોટમ
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ૨. યુઝર ચેક કરો અને હિસ્ટ્રી લાવો
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchHistory(user.id);
      } else {
        // જો લોગીન ના હોય તો વેલકમ મેસેજ
        setMessages([{
          id: 1,
          type: 'ai',
          message: 'નમસ્તે! હું જ્ઞાન સહાયક છું. તમારી હિસ્ટ્રી સેવ કરવા માટે કૃપા કરીને લોગીન કરો.'
        }]);
      }
    };
    init();
  }, []);

  // ૩. જૂની હિસ્ટ્રી Supabase માંથી લાવો
  const fetchHistory = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // ડેટાને ફોર્મેટ કરો
        const historyMessages: Message[] = data.flatMap((item: any) => [
          { id: `user_${item.id}`, type: 'user', message: item.prompt, createdAt: item.created_at },
          { id: `ai_${item.id}`, type: 'ai', message: item.response, createdAt: item.created_at }
        ]);
        setMessages(historyMessages);
      } else {
        // નવી શરૂઆત
        setMessages([{
          id: 'welcome',
          type: 'ai',
          message: 'નમસ્તે! હું જ્ઞાન સહાયક છું. તમે મને શિક્ષણ, કરિયર અથવા સમાજ વિશે કોઈપણ પ્રશ્ન પૂછી શકો છો.'
        }]);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  // ૪. મેસેજ મોકલો (API Call + DB Save)
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // A. UI અપડેટ (યુઝર મેસેજ)
    const userMessageText = input;
    setInput('');
    const tempUserMsg: Message = { id: Date.now(), type: 'user', message: userMessageText };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      // B. Gemini API Call
      if (!GEMINI_API_KEY) throw new Error("API Key Missing");

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a helpful Gujarati assistant. Answer in Gujarati only. Question: ${userMessageText}` }] }],
          }),
        }
      );

      const data = await response.json();
      const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "ક્ષમા કરજો, હું સમજી શક્યો નહીં.";

      // C. UI અપડેટ (AI મેસેજ)
      const tempAiMsg: Message = { id: Date.now() + 1, type: 'ai', message: aiResponseText };
      setMessages(prev => [...prev, tempAiMsg]);

      // D. Supabase માં સેવ કરો (જો યુઝર લોગીન હોય તો)
      if (userId) {
        await supabase.from('ai_chat_history').insert({
          user_id: userId,
          prompt: userMessageText,
          response: aiResponseText
        });
      }

    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { id: Date.now(), type: 'ai', message: "ટેકનિકલ સમસ્યા આવી છે. ફરી પ્રયાસ કરો." }]);
    } finally {
      setLoading(false);
    }
  };

  // ૫. હિસ્ટ્રી ડિલીટ કરો
  const clearHistory = async () => {
    if (!userId) return alert("લોગીન નથી.");
    if (confirm('શું તમે બધી ચેટ ડિલીટ કરવા માંગો છો?')) {
      const { error } = await supabase.from('ai_chat_history').delete().eq('user_id', userId);
      if (!error) {
        setMessages([{
          id: Date.now(),
          type: 'ai',
          message: 'હિસ્ટ્રી ડિલીટ થઈ ગઈ છે. નવો પ્રશ્ન પૂછો!'
        }]);
      } else {
        alert('ડિલીટ કરવામાં ભૂલ આવી.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24 font-gujarati">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 safe-area-top px-4 py-4 shadow-md z-10 flex justify-between items-center">
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
              Online • History On
            </p>
          </div>
        </div>
        {/* Delete History Button */}
        {userId && (
          <button onClick={clearHistory} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto bg-[#EBE5DE]">
        {messages.length === 0 && !loading && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60">
                <History size={48} className="mb-2" />
                <p>તમારી ચેટ હિસ્ટ્રી લોડ થઈ રહી છે...</p>
             </div>
        )}
        
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

      {/* Input Area */}
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