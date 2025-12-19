import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { aiConversation } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function AIAssistantScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 safe-area-top px-6 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-gujarati font-bold text-xl">જ્ઞાન સહાયક</h1>
            <p className="text-white/80 text-xs">AI સહાયક • Always here to help</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="તમારો પ્રશ્ન પૂછો..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 font-gujarati"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
        {aiConversation.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.type === 'user' 
                  ? 'bg-deep-blue' 
                  : 'bg-gradient-to-br from-violet-400 to-purple-500'
              }`}>
                {msg.type === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`px-5 py-3 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-mint text-deep-blue rounded-br-sm'
                  : 'bg-white border-2 border-royal-gold text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
                <p className="text-sm font-gujarati leading-relaxed">{msg.message}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start space-x-2"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="px-5 py-4 bg-white border-2 border-royal-gold rounded-2xl rounded-bl-sm">
            <div className="flex space-x-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 rounded-full bg-violet-400"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 safe-area-bottom">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="મેસેજ લખો..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 font-gujarati"
          />
          <button className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
