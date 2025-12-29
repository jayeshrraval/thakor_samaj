import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase'; // ⚠️ જો આ પાથ અલગ હોય તો સુધારી લેજો (દા.ત. '../supabaseClient')

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    dob: ''
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); 
  };

  // 🛠 REGISTER FUNCTION
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('પાસવર્ડ મેચ થતા નથી.');
      setLoading(false);
      return;
    }

    if (formData.mobile.length !== 10) {
      setErrorMsg('મોબાઈલ નંબર 10 અંકનો હોવો જોઈએ.');
      setLoading(false);
      return;
    }

    try {
      // Supabase માટે ફેક ઈમેલ બનાવો
      const fakeEmail = `${formData.mobile}@samaj.app`;

      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            dob: formData.dob,
            mobile: formData.mobile
          }
        }
      });

      if (error) throw error;

      alert('રજીસ્ટ્રેશન સફળ! હવે લોગિન કરો.');
      setActiveTab('login');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'રજીસ્ટ્રેશનમાં ભૂલ છે.');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const fakeEmail = `${formData.mobile}@samaj.app`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: formData.password,
      });

      if (error) throw error;
      navigate('/home');
    } catch (error) {
      console.error(error);
      setErrorMsg('મોબાઈલ નંબર અથવા પાસવર્ડ ખોટો છે.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ ફેરફાર ૧: બેકગ્રાઉન્ડ મરૂન (#800000)
    <div className="min-h-screen bg-[#800000] flex flex-col safe-area-top safe-area-bottom relative overflow-hidden">
      
      {/* પાછળ થોડો ગોલ્ડન ગ્લો (સજાવટ માટે) */}
      <div className="absolute top-[-50px] left-[-50px] w-60 h-60 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      {/* Header */}
      <div className="text-center pt-12 pb-8 px-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white font-gujarati mb-2"
        >
          ઠાકોર સમાજ સંગઠન
        </motion.h1>
        {/* ✅ ફેરફાર ૨: ટેક્સ્ટ કલર ગોલ્ડન */}
        <p className="text-[#D4AF37] text-sm font-medium tracking-wide">સ્વાગત છે 🙏</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 px-6 mb-6 relative z-10">
        <button
          onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
          className={`flex-1 py-3 rounded-2xl font-gujarati font-medium transition-all ${
            activeTab === 'login'
              // ✅ ફેરફાર ૩: એક્ટિવ ટેબ સફેદ અને મરૂન અક્ષર
              ? 'bg-white text-[#800000] shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          પ્રવેશ કરો
        </button>
        <button
          onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
          className={`flex-1 py-3 rounded-2xl font-gujarati font-medium transition-all ${
            activeTab === 'register'
              ? 'bg-white text-[#800000] shadow-lg'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          નવું એકાઉન્ટ
        </button>
      </div>

      {/* Content Card (White Background) */}
      <div className="flex-1 bg-white rounded-t-[2rem] px-6 pt-8 pb-6 overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl flex items-center text-sm font-gujarati"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-5">
          {activeTab === 'register' && (
            <div>
              <label className="block text-gray-700 font-gujarati mb-1 text-sm">નામ</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="તમારું પૂરું નામ"
                // ✅ ફેરફાર ૪: ફોકસ રીંગ ગોલ્ડન
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-gujarati"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-gujarati mb-1 text-sm">મોબાઇલ નંબર</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10 અંકો નો નંબર"
              maxLength={10}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-gujarati tracking-widest"
              required
            />
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-gray-700 font-gujarati mb-1 text-sm">જન્મ તારીખ</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-gujarati"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-gujarati mb-1 text-sm">પાસવર્ડ</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="પાસવર્ડ દાખલ કરો"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-gujarati"
              required
            />
          </div>

          {activeTab === 'register' && (
            <div>
              <label className="block text-gray-700 font-gujarati mb-1 text-sm">પાસવર્ડ કન્ફર્મ કરો</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="ફરીથી પાસવર્ડ લખો"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] font-gujarati"
                required
              />
            </div>
          )}

          {/* ✅ ફેરફાર ૫: બટન ગોલ્ડન (Login) અથવા મરૂન (Register) */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-gujarati font-bold py-4 rounded-2xl transition-all shadow-lg flex justify-center items-center text-white
              ${activeTab === 'login' 
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] shadow-[#D4AF37]/30' // Login માટે ગોલ્ડન
                : 'bg-[#800000] shadow-[#800000]/30' // Register માટે મરૂન
              }`}
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : activeTab === 'login' ? 'લોગિન કરો' : 'રજીસ્ટર કરો'}
          </button>

          <div className="text-center space-y-3 pt-2">
            {activeTab === 'login' && (
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                // ✅ ફેરફાર ૬: લિંક કલર મરૂન
                className="text-[#800000] text-sm font-gujarati hover:underline font-medium"
              >
                પાસવર્ડ ભૂલી ગયા?
              </button>
            )}
            <p className="text-gray-600 text-sm font-gujarati">
              {activeTab === 'login' ? 'નવા યુઝર?' : 'પહેલેથી એકાઉન્ટ છે?'}{' '}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                className="text-[#D4AF37] font-bold hover:underline"
              >
                {activeTab === 'login' ? 'રજીસ્ટર કરો' : 'લોગિન કરો'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}