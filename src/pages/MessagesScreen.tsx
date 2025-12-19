import { useState } from 'react';
import { MessageCircle, Heart, UserPlus, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { recentChats } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const sampleMessages = [
    { id: '1', type: 'received', text: 'નમસ્તે! કેમ છો?', time: '10:30' },
    { id: '2', type: 'sent', text: 'હું સારો છું, તમે?', time: '10:32' },
    { id: '3', type: 'received', text: 'હું પણ સારી છું. આજે સમાજના કાર્યક્રમમાં આવશો?', time: '10:35' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">મેસેજ</h1>
        <p className="text-white/80 text-sm">સંદેશાઓ અને ચેટ</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Society General Chat Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 bg-gradient-to-br from-mint/10 to-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-gujarati font-bold text-gray-800">સમાજ જનરલ ચેટ રૂમ</h3>
            <MessageCircle className="w-5 h-5 text-mint" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-start space-x-2">
              <div className="bg-mint text-white px-4 py-2 rounded-2xl rounded-tl-sm text-sm font-gujarati">
                નમસ્કાર સૌને! આજે સંમેલન છે.
              </div>
            </div>
            <div className="flex items-start space-x-2 justify-end">
              <div className="bg-white border border-royal-gold text-gray-800 px-4 py-2 rounded-2xl rounded-tr-sm text-sm font-gujarati">
                હા, હું આવીશ.
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-mint text-white px-4 py-2 rounded-2xl rounded-tl-sm text-sm font-gujarati">
                સારું! સૌને મળીને આનંદ આવશે.
              </div>
            </div>
          </div>
          <button className="text-deep-blue text-sm font-gujarati font-medium hover:underline">
            વધારે જુઓ →
          </button>
        </motion.div>

        {/* Recent Private Chats */}
        <div className="space-y-3">
          <h3 className="font-gujarati font-bold text-gray-800 px-2">તાજેતરની ચેટ</h3>
          {recentChats.map((chat, index) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedChat(chat.id)}
              className="w-full premium-card p-4 flex items-center space-x-4 hover:shadow-elevated transition-all active:scale-98"
            >
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {chat.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{chat.unread}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-gujarati font-semibold text-gray-800">{chat.name}</h4>
                <p className="text-sm text-gray-500 font-gujarati line-clamp-1">
                  {chat.lastMessage}
                </p>
              </div>
              <span className="text-xs text-gray-400 font-gujarati">{chat.time}</span>
            </motion.button>
          ))}
        </div>

        {/* Yogigram Interactions */}
        <div className="premium-card p-6 space-y-4">
          <h3 className="font-gujarati font-bold text-gray-800">યોગીગ્રામ ઇન્ટરેક્શન્સ</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-xl">
              <Heart className="w-5 h-5 text-pink-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-gujarati">દિવ્યા જોશીએ તમારી પોસ્ટ પર લાઈક કર્યું</p>
                <p className="text-xs text-gray-500">5 મિનિટ પહેલા</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-gujarati">અમિત દેસાઈએ તમારી પોસ્ટ પર કોમેન્ટ કર્યો</p>
                <p className="text-xs text-gray-500">10 મિનિટ પહેલા</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-mint/10 rounded-xl">
              <UserPlus className="w-5 h-5 text-mint" />
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-gujarati">પ્રિયા શાહે તમને ફોલો કર્યા</p>
                <p className="text-xs text-gray-500">1 કલાક પહેલા</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Private Chat Preview */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-gujarati font-bold text-gray-800">ચેટ પ્રીવ્યૂ</h3>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="space-y-3">
            {sampleMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.type === 'sent'
                      ? 'bg-deep-blue text-white rounded-br-sm'
                      : 'bg-white border border-mint text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm font-gujarati">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.type === 'sent' ? 'text-white/70' : 'text-gray-500'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-3 bg-mint text-deep-blue font-gujarati font-semibold rounded-xl">
            Open Chat
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
