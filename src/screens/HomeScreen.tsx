import React, { useEffect, useState, useRef } from 'react';
import {
  Bell, Settings, Heart, Search, MessageCircle, User, CreditCard,
  Building2, Bot, Users, GraduationCap, AlertTriangle, Briefcase, X,
  Store, ChevronRight, Sparkles // ✅ નવા આઈકોન
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

// ✅ સાઉન્ડ ફાઈલનો પાથ
const NOTIFICATION_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; 

export default function HomeScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Thakor Member');
  const [userPhoto, setUserPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // ✅ ઓડિયો પ્લેયર રેફરન્સ
  const audioRef = useRef(null);

  // ✅ ભાષા લોડ કરો
  const language = localStorage.getItem('app_language') || 'Gujarati';
  const t = (gu, en) => language === 'English' ? en : gu;

  // ✅ સ્ટેટ્સ
  const [statsData, setStatsData] = useState({
    totalAppUsers: 0,
    matrimonyProfiles: 0,
    messages: 0
  });

  // --- Real-time Logic (Same as before) ---
  useEffect(() => {
    fetchDashboardData();
    
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);

    const channel = supabase
      .channel('realtime-dashboard-v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matrimony_profiles' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchDashboardData())
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        (payload) => {
           console.log("🔥 Notification Received:", payload);
           const isSoundEnabled = localStorage.getItem('notification_sound') !== 'off';
           if (isSoundEnabled && audioRef.current) {
              audioRef.current.play().catch(e => console.warn("Audio blocked:", e));
           }
           setShowNotificationPopup(true);
           setTimeout(() => setShowNotificationPopup(false), 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase.from('users').select('full_name, avatar_url').eq('id', user.id).maybeSingle();
        if (userData) {
          setUserName(userData.full_name || user.user_metadata?.full_name || 'Thakor Member');
          setUserPhoto(userData.avatar_url);
        }
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: profileCount } = await supabase.from('matrimony_profiles').select('*', { count: 'exact', head: true });
        const { count: messageCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);

        setStatsData({
            totalAppUsers: userCount || 0,
            matrimonyProfiles: profileCount || 0,
            messages: messageCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const featureCards = [
    { icon: Heart, title: t('મેટ્રિમોની પ્રોફાઈલ', 'Matrimony Profiles'), color: 'from-pink-500 to-rose-500', path: '/matrimony' },
    { icon: Users, title: t('પરિવાર રજીસ્ટ્રેશન', 'Family Registration'), color: 'from-blue-500 to-indigo-600', path: '/family-list' },
    { icon: Store, title: t('સમાજ વ્યાપાર સેતુ', 'Business Directory'), color: 'from-orange-500 to-amber-600', path: '/business-directory' },
    { icon: GraduationCap, title: t('શિક્ષણ અને ભવિષ્ય', 'Education & Future'), color: 'from-violet-500 to-purple-600', path: '/education' },
    { icon: Briefcase, title: t('નોકરીની જાહેરાત', 'Job Ads'), color: 'from-red-500 to-pink-600', path: '/jobs' },
    { icon: MessageCircle, title: t('મેટ્રીમોની ચેટ', 'Matrimony Chat'), color: 'from-cyan-500 to-teal-600', path: '/messages' },
    { icon: CreditCard, title: t('સમાજ વિકાસ ફાળો', 'Membership Fee'), color: 'from-yellow-500 to-orange-600', path: '/subscription' },
    { icon: Building2, title: t('ઠાકોર સમાજ ટ્રસ્ટ', 'Thakor Samaj Trust'), color: 'from-emerald-500 to-green-600', path: '/trust' },
  ];

  const stats = [
    { label: t('કુલ સભ્યો', 'Total Members'), value: statsData.totalAppUsers.toString(), color: 'text-blue-600' },
    { label: t('લગ્ન પ્રોફાઈલ', 'Profiles'), value: statsData.matrimonyProfiles.toString(), color: 'text-pink-600' },
    { label: t('મેસેજ', 'Messages'), value: statsData.messages.toString(), color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 font-gujarati relative selection:bg-rose-100">
      
      {/* 🔥 નોટિફિકેશન પોપઅપ 🔥 */}
      <AnimatePresence>
        {showNotificationPopup && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-28 left-1/2 transform -translate-x-1/2 z-[9999] w-[90%] max-w-sm"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center gap-4 ring-1 ring-black/5">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-full shadow-lg shrink-0">
                 <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 cursor-pointer" onClick={() => { navigate('/notifications'); setShowNotificationPopup(false); }}>
                 <h3 className="font-bold text-gray-800 text-sm">{t('નવી નોટીફીકેશન!', 'New Notification!')}</h3>
                 <p className="text-xs text-gray-500 mt-0.5">{t('હમણાજ તપાસો', 'Check Now')}</p>
              </div>
              <button onClick={() => setShowNotificationPopup(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Premium Header Area */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] pb-10 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

        <div className="px-6 py-8 relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <motion.div 
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/profile')}
                className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-r from-yellow-400 to-rose-500 cursor-pointer shadow-lg"
              >
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-2 border-slate-900">
                   {userPhoto ? (
                     <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-6 h-6 text-white" />
                   )}
                </div>
              </motion.div>
              <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{t('નમસ્તે', 'Hello')}</p>
                <h1 className="text-white font-bold text-xl tracking-tight">
                  {loading ? '...' : userName}
                </h1>
              </div>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/notifications')} 
              className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center relative backdrop-blur-md border border-white/5 shadow-lg"
            >
              <Bell className="w-5 h-5 text-white" />
              {statsData.messages > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-800 animate-pulse"></span>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ✅ Premium Krishna Chat Card (Floating) */}
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/krishna-chat')}
        className="mx-6 -mt-16 p-0.5 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 rounded-3xl shadow-[0_20px_40px_-15px_rgba(251,191,36,0.3)] z-20 relative cursor-pointer"
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-[22px] p-5 flex items-center justify-between relative overflow-hidden">
           <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white/40 to-transparent"></div>
           
           <div className="relative z-10">
             <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-gray-900 text-lg">{t('કૃષ્ણ સારથી (AI)', 'Krishna Sarathi (AI)')}</h3>
             </div>
             <p className="text-xs text-gray-600 font-medium">{t('ગીતાજીના જ્ઞાનથી માર્ગદર્શન મેળવો.', 'Guidance from Gita.')}</p>
           </div>
           
           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg text-2xl border-2 border-white">
             🙏
           </div>
        </div>
      </motion.div>

      {/* ✅ Premium Stats Section */}
      <div className="px-6 mt-8">
        <div className="bg-white p-5 rounded-[24px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex items-center justify-around">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center flex-1 relative group">
                {index !== 0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-[1px] bg-gray-100"></div>}
                <p className={`text-2xl font-black ${stat.color} group-hover:scale-110 transition-transform`}>{stat.value}</p>
                <p className="text-gray-400 text-[9px] font-bold mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
        </div>
      </div>

      {/* ✅ Premium Feature Grid */}
      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-bold text-lg">{t('સુવિધાઓ', 'Services')}</h2>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-lg">All Apps</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(card.path)}
                className="group relative bg-white p-4 pb-5 rounded-[26px] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col justify-between h-36 overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all duration-300"
              >
                {/* Background Glow Blob */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-[0.08] group-hover:opacity-15 group-hover:scale-125 transition-all duration-500 blur-2xl pointer-events-none`} />

                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md text-white z-10 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>

                {/* Title & Action */}
                <div className="z-10 w-full mt-auto pt-4">
                  <h3 className="text-gray-700 text-[14px] font-bold leading-tight text-left group-hover:text-gray-900 transition-colors">
                    {card.title}
                  </h3>
                  
                  {/* Subtle Arrow Indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Emergency Card moved to bottom for better flow, or keep it if needed specifically */}
      <div className="px-6 pb-6">
        <motion.div
           whileTap={{ scale: 0.98 }}
           onClick={() => navigate('/accidental-aid')}
           className="bg-red-50 p-1 rounded-[24px] border border-red-100 shadow-sm cursor-pointer group"
        >
          <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 relative overflow-hidden">
             <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-red-50 to-transparent"></div>
             
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse shrink-0">
               <AlertTriangle className="w-6 h-6 text-red-600" />
             </div>
             <div className="flex-1">
               <h3 className="font-bold text-gray-800 text-base">{t('અકસ્માત સહાય (SOS)', 'Accident Aid (SOS)')}</h3>
               <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide group-hover:text-red-600 transition-colors">{t('ઈમરજન્સી મદદ માટે', 'For Emergency Help')}</p>
             </div>
             <div className="bg-red-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-red-200">
               HELP
             </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}