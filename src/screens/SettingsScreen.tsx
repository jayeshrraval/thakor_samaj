import React, { useState } from 'react';
import { User, Globe, Bell, Lock, HelpCircle, LogOut, ChevronRight, Key, Trash2, X, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // ✅ ૧. વોટ્સએપ સપોર્ટ ફંક્શન (તમારા નંબર સાથે)
  const openWhatsAppSupport = () => {
    const phoneNumber = "919714443758"; 
    const message = "જય યોગેશ્વર, મને યોગી સમાજ એપમાં સહાય/સપોર્ટની જરૂર છે.";
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
        { icon: Globe, label: 'Change Language', labelGu: 'ભાષા બદલો', action: 'language' },
      ],
    },
    {
      title: 'Preferences',
      titleGu: 'પસંદગી',
      items: [
        { icon: Bell, label: 'Notification Preferences', labelGu: 'નોટીફિકેશન સેટિંગ', action: 'notifications' },
        { icon: Lock, label: 'Privacy', labelGu: 'પ્રાઈવસી & નિયમો', path: '/about' },
      ],
    },
    {
      title: 'Support',
      titleGu: 'સહાય',
      items: [
        // ✅ ૨. અહીં path બદલીને action: 'support' કર્યું છે
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
    // ✅ ૩. સપોર્ટ એક્શન હેન્ડલર
    else if (action === 'support') {
      openWhatsAppSupport();
    }
    else if (action === 'delete_account') {
      handleDeleteAccount();
    }
    else if (action === 'language' || action === 'notifications' || action === 'privacy') {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">સેટિંગ્સ</h1>
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
              <h3 className="font-gujarati font-bold text-gray-800">{group.titleGu}</h3>
              <p className="text-xs text-gray-500">{group.title}</p>
            </div>
            <div className="premium-card overflow-hidden">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
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
                        <p className={`font-gujarati font-medium ${item.color || 'text-gray-800'}`}>{item.labelGu}</p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
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
          <span className="font-gujarati font-semibold text-red-500 text-lg">લૉગઆઉટ કરો</span>
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
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-gujarati font-bold flex items-center justify-center space-x-2"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Check className="w-5 h-5" />}
                  <span>સેવ કરો</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}