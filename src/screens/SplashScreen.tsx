import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#4A0404] via-[#6D071A] to-[#800000] flex flex-col items-center justify-center overflow-hidden z-[9999]">
      {/* Glow Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1.5 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="w-96 h-96 rounded-full bg-[#D4AF37] blur-3xl"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) 
            }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [null, -100],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 px-6">
        {/* Gold Ring with Handshake Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] bg-[#800000]">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-inner">
              <Handshake className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-bold text-white font-gujarati">
            ઠાકોર સમાજ સંગઠન
          </h1>
          <p className="text-xl text-[#D4AF37] font-medium">
            Community Connection
          </p>
        </motion.div>

        {/* Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-[#800000]/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-[#D4AF37]/20 shadow-lg"
        >
          <div className="space-y-1 text-center">
            <p className="text-white text-sm font-gujarati font-medium">
              શિક્ષણ • સેવા • પ્રગતિ
            </p>
            <p className="text-[#D4AF37] text-xs font-medium uppercase tracking-wider">
              Education • Service • Progress
            </p>
          </div>
        </motion.div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center space-y-4 pt-8">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  backgroundColor: ['#B8860B', '#D4AF37', '#B8860B'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2.5 h-2.5 rounded-full"
              />
            ))}
          </div>
          <p className="text-white/60 text-sm animate-pulse">સીસ્ટમ તૈયાર થઈ રહી છે...</p>
        </div>
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 text-center space-y-1 px-6"
      >
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">Version 1.0.0</p>
        <p className="text-[#D4AF37] text-sm font-gujarati">
          ઠાકોર સમાજ ડિજિટલ પ્લેટફોર્મ
        </p>
      </motion.div>
    </div>
  );
}