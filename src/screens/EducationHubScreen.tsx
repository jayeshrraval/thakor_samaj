import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  GraduationCap, 
  Star, 
  Newspaper 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function EducationHubScreen() {
  const navigate = useNavigate();

  const educationCards = [
    {
      icon: BookOpen,
      title: 'વિદ્યાર્થી પ્રોફાઈલ',
      subtitle: 'વિદ્યાર્થીઓની માહિતી જુઓ અને ઉમેરો',
      gradient: 'from-[#800000] to-[#A00000]', // Maroon Gradient
      path: '/student-profile', 
    },
    {
      icon: GraduationCap,
      title: 'સ્કોલરશિપ અને સહાય',
      subtitle: 'સ્કોલરશિપની માહિતી મેળવો',
      gradient: 'from-[#D4AF37] to-[#B8860B]', // Gold Gradient
      path: '/scholarship', 
    },
    {
      icon: Star,
      title: 'સમાજના ગૌરવ',
      subtitle: 'સમાજના સફળ વ્યક્તિઓની ઓળખ',
      gradient: 'from-blue-600 to-indigo-700', // Royal Blue Gradient
      path: '/achievers', 
    },
    {
      icon: Newspaper,
      title: 'આજનું શિક્ષણ માર્ગદર્શન',
      subtitle: 'દૈનિક શિક્ષણ માર્ગદર્શન પોસ્ટ',
      gradient: 'from-emerald-500 to-teal-600', // Green Gradient
      path: '/daily-guidance', 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header: Maroon with Gold Glow */}
      <div className="bg-[#800000] safe-area-top shadow-lg relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="px-6 py-6 relative z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/home')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-gujarati font-bold text-xl">
                શિક્ષણ અને ભવિષ્ય
              </h1>
              <p className="text-[#D4AF37] text-sm font-gujarati font-medium">
                Education Hub
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 relative overflow-hidden"
        >
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#800000]/5 rounded-bl-[100px] pointer-events-none"></div>

          <h2 className="font-gujarati font-bold text-[#800000] text-lg mb-3 flex items-center gap-2">
            🎯 હેતુ
          </h2>
          <ul className="space-y-2 text-gray-700 font-gujarati text-sm relative z-10">
            <li className="flex items-start space-x-2">
              <span className="text-[#D4AF37] mt-1 font-bold">•</span>
              <span>સમાજમાં શિક્ષણનું મહત્વ સમજાવવું</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#D4AF37] mt-1 font-bold">•</span>
              <span>વિદ્યાર્થીઓને માર્ગદર્શન આપવું</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#D4AF37] mt-1 font-bold">•</span>
              <span>માતા-પિતાને જાગૃત કરવું</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#D4AF37] mt-1 font-bold">•</span>
              <span>Role-models showcase કરવું</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Cards Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {educationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-[24px] p-5 text-left shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95 flex flex-col items-start"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-gujarati font-bold text-gray-800 text-sm leading-tight mb-1">
                  {card.title}
                </h3>
                <p className="font-gujarati text-gray-500 text-[10px] leading-tight font-medium">
                  {card.subtitle}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quote Section */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-[#800000]/5 to-white p-6 rounded-[24px] border-l-4 border-[#800000]"
        >
          <p className="font-gujarati text-[#800000] text-sm italic font-medium">
            "એક અનુભવી વ્યક્તિ = અનેક ભવિષ્ય બચાવી શકે"
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}