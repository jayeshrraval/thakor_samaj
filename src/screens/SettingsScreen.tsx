import React, { useState } from 'react';
import { User, Globe, Bell, Lock, HelpCircle, LogOut, ChevronRight, Key, Trash2, X, Loader2, Check, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // ✅ સ્ટેટ મેમરી (LocalStorage) માંથી ડેટા લેશે
  const [soundEnabled, setSoundEnabled] = useState(() => {
     return localStorage.getItem('notification_sound') !== 'off'; 
  });
  
  const [language, setLanguage] = useState(() => {
     return localStorage.getItem('app_language') || 'Gujarati'; 
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // ✅ ૧. વોટ્સએપ સપોર્ટ ફંક્શન
  const openWhatsAppSupport = () => {
    const phoneNumber = "919714443758"; 
    const message = "જય માતાજી, મને ઠાકોર સમાજ એપમાં સહાય/સપોર્ટની જરૂર છે.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Settings Groups
  const settingsGroups = [
    {
      title: 'Account',
      titleGu: 'એકાઉન્ટ',
      items: [
        { icon: User, label: 'Edit Profile', labelGu: 'પ્રોફાઈલ એડિટ કરો', path: '/profile' },
        { icon: Key, label: 'Change Password', labelGu: 'પાસવર્ડ બદલો', action: 'password' },
        // ✅ ભાષાનું નામ પણ બદલાશે
        { icon: Globe, label: `Current: ${language}`, labelGu: `ભાષા: ${language}`, action: 'language' },
      ],
    },
    {
      title: 'Preferences',
      titleGu: 'પસંદગી',
      items: [
        { 
            icon: soundEnabled ? Volume2 : VolumeX, 
            label: `Sound is ${soundEnabled ? 'On' : 'Off'}`, 
            labelGu: `નોટીફિકેશન સાઉન્ડ: ${soundEnabled ? 'ચાલુ' : 'બંધ'}`, 
            action: 'notifications',
            color: soundEnabled ? 'text-green-600' : 'text-gray-400'
        },
        { icon: Lock, label: 'Privacy', labelGu: 'પ્રાઈવસી & નિયમો', path: '/about' },
      ],
    },
    {
      title: 'Support',
      titleGu: 'સહાય',
      items: [
        { icon: HelpCircle, label: 'Help & Support', labelGu: 'સહાય અને સપોર્ટ', action: 'support' },
        { icon: Trash2, label: 'Delete Account', labelGu: 'એકાઉન્ટ ડિલીટ કરો', action: 'delete_account', color: 'text-red-500' },
      ],
    },
  ];

  // 🕹️ Handle Actions
  const handleAction = async (action: string) => {
    if (action === 'password') {
      setShowPasswordModal(true);
    } 
    else if (action === 'support') {
      openWhatsAppSupport();
    }
    else if (action === 'delete_account') {
      handleDeleteAccount();
    }
    // ✅ નોટીફિકેશન સાઉન્ડ ટોગલ અને સેવ
    else if (action === 'notifications') {
        const newState = !soundEnabled;
        setSoundEnabled(newState);
        localStorage.setItem('notification_sound', newState ? 'on' : 'off');
    }
    else if (action === 'language') {
        setShowLanguageModal(true);
    }
    else if (action === 'privacy') {
      alert('આ ફીચર ટૂંક સમયમાં આવશે.');
    }
  };

  // 🔑 Change Password Logic
  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      alert('પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert('ભૂલ: ' + error.message);
    } else {
      alert('પાસવર્ડ સફળતાપૂર્વક બદલાઈ ગયો! ✅');
      setShowPasswordModal(false);
      setNewPassword('');
    }
    setLoading(false);
  };

  // 🗑️ Delete Account Logic
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "ચેતવણી: શું તમે ખરેખર તમારું એકાઉન્ટ ડિલીટ કરવા માંગો છો? આ ક્રિયા પાછી વાળી શકાશે નહીં અને તમારો બધો ડેટા નાશ પામશે."
    );

    if (confirmDelete) {
      setLoading(true);
      try {
        const { error } = await supabase.rpc('delete_own_account');
        if (error) throw error;

        alert('તમારું એકાઉન્ટ ડિલીટ થઈ ગયું છે. બાય બાય! 👋');
        await supabase.auth.signOut();
        navigate('/');
      } catch (error: any) {
        console.error(error);
        alert('એકાઉન્ટ ડિલીટ કરવામાં સમસ્યા આવી: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // 🚪 Logout Logic
  const handleLogout = async () => {
    const confirmLogout = window.confirm("શું તમે લોગ આઉટ કરવા માંગો છો?");
    if (confirmLogout) {
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  // ✅ ભાષા સિલેક્શન અને સેવ + રીલોડ (જેથી આખી એપમાં બદલાય)
  const handleLanguageSelect = (selectedLang: string) => {
      setLanguage(selectedLang);
      localStorage.setItem('app_language', selectedLang); 
      setShowLanguageModal(false);
      // પેજ રીલોડ કરવું પડશે જેથી આખી એપમાં ભાષા બદલાઈ જાય
      window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">
            {/* ✅ હેડર ભાષા મુજબ બદલાશે */}
            {language === 'English' ? 'Settings' : 'સેટિંગ્સ'}
        </h1>
        <p className="text-white/80 text-sm">Settings & Account Options</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="space-y-3"
          >
            <div className="px-2">
              <h3 className="font-gujarati font-bold text-gray-800">
                  {/* ✅ ગ્રુપ ટાઈટલ ભાષા મુજબ બદલાશે */}
                  {language === 'English' ? group.title : group.titleGu}
              </h3>
              <p className="text-xs text-gray-500">{language === 'English' ? group.titleGu : group.title}</p>
            </div>
            <div className="premium-card overflow-hidden">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                
                // ✅ મેઈન સુધારો: ભાષા મુજબ ટેક્સ્ટ બદલવાનું લોજિક
                const mainText = language === 'English' ? item.label : item.labelGu;
                const subText = language === 'English' ? item.labelGu : item.label;

                return (
                  <button
                    key={itemIndex}
                    onClick={() => item.path ? navigate(item.path) : handleAction(item.action || '')}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      itemIndex !== group.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${item.color || 'text-gray-600'}`} />
                      </div>
                      <div className="text-left">
                        {/* ✅ અહીં હવે ડાયનેમિક ટેક્સ્ટ આવશે */}
                        <p className={`font-gujarati font-medium ${item.color || 'text-gray-800'}`}>{mainText}</p>
                        <p className="text-xs text-gray-500">{subText}</p>
                      </div>
                    </div>
                    
                    {/* Toggle Indicator for Notifications */}
                    {item.action === 'notifications' ? (
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${soundEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          className="w-full premium-card p-4 flex items-center justify-center space-x-3 hover:shadow-elevated transition-all active:scale-98 border-2 border-red-100"
        >
          <LogOut className="w-6 h-6 text-red-500" />
          <span className="font-gujarati font-semibold text-red-500 text-lg">
             {language === 'English' ? 'Logout' : 'લૉગઆઉટ કરો'}
          </span>
        </motion.button>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-gujarati text-gray-800">પાસવર્ડ બદલો</h3>
                <button onClick={() => setShowPasswordModal(false)} className="p-1 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 font-gujarati mb-1 block">નવો પાસવર્ડ</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="ઓછામાં ઓછા 6 અક્ષર"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button 
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-red-900 text-white py-3 rounded-xl font-gujarati font-bold flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Check className="w-5 h-5" />}
                  <span>સેવ કરો</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌐 LANGUAGE SELECTION MODAL */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold font-gujarati text-gray-800">ભાષા પસંદ કરો</h3>
                <button onClick={() => setShowLanguageModal(false)} className="p-1 bg-gray-100 rounded-full">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-3">
                {['English', 'Hindi', 'Gujarati'].map((lang) => (
                    <button
                        key={lang}
                        onClick={() => handleLanguageSelect(lang)}
                        className={`w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all ${
                            language === lang ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                        <span className={`font-bold ${language === lang ? 'text-red-900' : 'text-gray-700'}`}>
                            {lang}
                        </span>
                        {language === lang && <Check className="w-5 h-5 text-red-900" />}
                    </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}