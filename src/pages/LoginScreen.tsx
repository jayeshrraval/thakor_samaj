import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Smartphone } from 'lucide-react';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="text-center pt-12 pb-8 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white font-gujarati mb-2"
        >
          યોગી સમાજ સંબંધ
        </motion.h1>
        <p className="text-mint text-sm">સ્વાગત છે</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 px-6 mb-6">
        <button
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-3 rounded-2xl font-gujarati font-medium transition-all ${
            activeTab === 'login'
              ? 'bg-white text-deep-blue shadow-lg'
              : 'bg-white/20 text-white'
          }`}
        >
          પ્રવેશ કરો
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`flex-1 py-3 rounded-2xl font-gujarati font-medium transition-all ${
            activeTab === 'register'
              ? 'bg-white text-deep-blue shadow-lg'
              : 'bg-white/20 text-white'
          }`}
        >
          નવું એકાઉન્ટ બનાવો
        </button>
      </div>

      {/* Content Card */}
      <div className="flex-1 bg-white rounded-t-[2rem] px-6 pt-8 pb-6 overflow-y-auto">
        {activeTab === 'login' ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-gujarati mb-2 text-sm">
                મોબાઇલ નંબર
              </label>
              <input
                type="tel"
                placeholder="10 અંકો નો નંબર"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-gujarati mb-2 text-sm">
                પાસવર્ડ
              </label>
              <input
                type="password"
                placeholder="પાસવર્ડ દાખલ કરો"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-mint hover:bg-mint/90 text-deep-blue font-gujarati font-semibold py-4 rounded-2xl transition-all shadow-mint"
            >
              લોગિન કરો
            </button>

            <div className="space-y-3 text-center">
              <button
                type="button"
                className="text-deep-blue text-sm font-gujarati hover:underline"
              >
                પાસવર્ડ ભૂલી ગયા?
              </button>
              <p className="text-gray-600 text-sm font-gujarati">
                નવા યુઝર?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-deep-blue font-semibold hover:underline"
                >
                  રજીસ્ટર કરો
                </button>
              </p>
            </div>

            {/* Biometric Options */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm mb-4">Biometric Login</p>
              <div className="flex justify-center space-x-6">
                <button
                  type="button"
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center group-hover:bg-mint/20 transition-all">
                    <Fingerprint className="w-8 h-8 text-deep-blue" />
                  </div>
                  <span className="text-xs text-gray-600">Touch ID</span>
                </button>
                <button
                  type="button"
                  className="flex flex-col items-center space-y-2 group"
                >
                  <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center group-hover:bg-mint/20 transition-all">
                    <Smartphone className="w-8 h-8 text-deep-blue" />
                  </div>
                  <span className="text-xs text-gray-600">Face ID</span>
                </button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleRegister}
            className="space-y-5"
          >
            <div>
              <label className="block text-gray-700 font-gujarati mb-2 text-sm">નામ</label>
              <input
                type="text"
                placeholder="તમારું નામ"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-gujarati mb-2 text-sm">
                મોબાઇલ નંબર
              </label>
              <input
                type="tel"
                placeholder="10 અંકો નો નંબર"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-gujarati mb-2 text-sm">
                જન્મ તારીખ
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-gujarati mb-2 text-sm">
                પાસવર્ડ
              </label>
              <input
                type="password"
                placeholder="પાસવર્ડ બનાવો"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-gujarati mb-2 text-sm">
                પાસવર્ડ પુષ્ટિ કરો
              </label>
              <input
                type="password"
                placeholder="પાસવર્ડ ફરીથી દાખલ કરો"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-deep-blue hover:bg-deep-blue/90 text-white font-gujarati font-semibold py-4 rounded-2xl transition-all shadow-lg"
            >
              રજીસ્ટર કરો
            </button>
          </motion.form>
        )}
      </div>
    </div>
  );
}
