import { motion } from 'framer-motion';
import { Handshake } from 'lucide-react';

export default function SplashScreen() {
  return (
    // ✅ રોયલ મરુન ગ્રેડિયન્ટ બેકગ્રાઉન્ડ
    <div className="fixed inset-0 bg-gradient-to-br from-[#4A0404] via-[#6D071A] to-[#800000] flex flex-col items-center justify-center overflow-hidden z-[9999]">
      
      {/* ✅ વધુ ચમકદાર ગોલ્ડન ગ્લો */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1.6 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse' }}
          className="w-[500px] h-[500px] rounded-full bg-[#D4AF37] blur-[120px]"
        />
      </div>

      {/* ✅ ગોલ્ડન પાર્ટીકલ્સ (Floating Particles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) 
            }}
            animate={{
              opacity: [0, 0.8, 0],
              y: [null, -150],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-10 px-6">
        
        {/* Gold Ring with Handshake Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
          className="relative"
        >
          {/* ✅ ગોલ્ડન બોર્ડર અને શેડો */}
          <div className="w-40 h-40 rounded-full border-4 border-[#D4AF37] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)] bg-[#800000]">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-inner">
              <Handshake className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-center space-y-3"
        >
          <h1 className="text-5xl font-black text-white font-gujarati drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-wide">
            ઠાકોર સમાજ સંગઠન
          </h1>
          <p className="text-2xl text-[#D4AF37] font-bold tracking-widest uppercase">
            Community Connection
          </p>
        </motion.div>

        {/* ✅ ગોલ્ડન બોર્ડરવાળું Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-[#800000]/40 backdrop-blur-md px-8 py-4 rounded-full border-2 border-[#D4AF37]/50 shadow-lg"
        >
          <div className="space-y-2 text-center">
            <p className="text-white text-lg font-gujarati font-bold">
              શિક્ષણ • સેવા • પ્રગતિ
            </p>
            <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-[0.15em]">
              Education • Service • Progress
            </p>
          </div>
        </motion.div>

        {/* Loading Indicator (Gold Colors) */}
        <div className="flex flex-col items-center space-y-5 pt-10">
          <div className="flex space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  backgroundColor: ['#B8860B', '#D4AF37', '#B8860B'], // ✅ ગોલ્ડન લોડિંગ
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 rounded-full shadow-[0_0_10px_#D4AF37]"
              />
            ))}
          </div>
          <p className="text-[#D4AF37]/80 text-sm font-medium animate-pulse tracking-wider">સીસ્ટમ તૈયાર થઈ રહી છે...</p>
        </div>
      </div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 text-center space-y-2 px-6"
      >
        <p className="text-white/50 text-xs uppercase tracking-[0.3em] font-bold">Version 1.0.0</p>
        <p className="text-[#D4AF37] text-base font-gujarati font-bold drop-shadow-sm">
          ઠાકોર સમાજ ડિજિટલ પ્લેટફોર્મ
        </p>
      </motion.div>
    </div>
  );
}