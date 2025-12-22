import React, { useEffect, useState } from 'react';
import { 
  Bell, Settings, Heart, Search, MessageCircle, User, CreditCard, 
  Building2, Bot, Users, GraduationCap, AlertTriangle, Briefcase 
} from 'lucide-react'; // Briefcase icon added here
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; 

export default function HomeScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Guest User');
  const [loading, setLoading] = useState(true);
  
  const [statsData, setStatsData] = useState({
    profiles: 0,
    interests: 0,
    messages: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (userProfile?.full_name) {
          setUserName(userProfile.full_name);
        } else {
            setUserName(user.user_metadata?.full_name || 'Yogi Member');
        }

        const { count: profileCount } = await supabase.from('matrimony_profiles').select('*', { count: 'exact', head: true });
        const { count: interestCount } = await supabase.from('requests').select('*', { count: 'exact', head: true }).eq('user_id', user.id); 
        const { count: messageCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false); 

        setStatsData({
            profiles: profileCount || 0,
            interests: interestCount || 0,
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
    { icon: Heart, title: 'મેટ્રિમોની પ્રોફાઈલ', color: 'from-pink-400 to-rose-500', path: '/matrimony' },
    { icon: Search, title: 'પાર્ટનર શોધો', color: 'from-mint to-teal-500', path: '/matrimony' },
    { icon: Users, title: 'પરિવાર રજીસ્ટ્રેશન', color: 'from-deep-blue to-cyan-500', path: '/family-list' },
    { icon: GraduationCap, title: 'શિક્ષણ અને ભવિષ્ય', color: 'from-indigo-400 to-purple-500', path: '/education' },
    
    // --- NEW JOB CARD ADDED HERE ---
    { icon: Briefcase, title: 'નોકરીની જાહેરાત', color: 'from-blue-600 to-indigo-600', path: '/jobs' },
    
    { icon: MessageCircle, title: 'યોગીગ્રામ', color: 'from-purple-400 to-indigo-500', path: '/yogigram' },
    { icon: MessageCircle, title: 'મેસેજ', color: 'from-blue-400 to-cyan-500', path: '/messages' },
    { icon: User, title: 'મારી પ્રોફાઈલ', color: 'from-amber-400 to-orange-500', path: '/profile' },
    { icon: CreditCard, title: 'સબ્સ્ક્રિપ્શન', color: 'from-royal-gold to-yellow-600', path: '/subscription' },
    { icon: Building2, title: 'યોગી સમાજ ટ્રસ્ટ', color: 'from-emerald-400 to-green-500', path: '/trust' },
    { icon: Bot, title: 'જ્ઞાન સહાયક', color: 'from-violet-400 to-purple-500', path: '/ai-assistant' },
  ];

  const stats = [
    { label: 'Profiles Available', value: statsData.profiles.toString(), color: 'text-mint' },
    { label: 'રસ દાખવ્યો', value: statsData.interests.toString(), color: 'text-royal-gold' },
    { label: 'Messages', value: statsData.messages.toString(), color: 'text-deep-blue' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">
                  {loading ? 'Welcome...' : `Welcome, ${userName}`}
                </h1>
                <p className="text-mint text-xs">Community Connection</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-white" />
                {statsData.messages > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              <button onClick={() => navigate('/settings')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          
          {/* EMERGENCY CARD */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             onClick={() => navigate('/accidental-aid')}
             className="col-span-2 bg-white p-4 rounded-2xl shadow-md border-l-4 border-red-500 flex items-center justify-between relative overflow-hidden active:scale-95 transition-all"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
            <div className="flex items-center space-x-4 z-10">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shrink-0 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 font-gujarati text-lg">અકસ્માત સહાય</h3>
                <p className="text-xs text-red-500 font-gujarati font-medium">તાત્કાલિક મદદ માટે અહીં ક્લિક કરો</p>
              </div>
            </div>
            <div className="bg-red-50 px-3 py-1 rounded-full border border-red-100">
               <span className="text-red-600 text-xs font-bold">SOS</span>
            </div>
          </motion.div>

          {/* Cards Loop */}
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(card.path)}
                className="premium-card p-6 hover:shadow-elevated transition-all active:scale-95"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-gujarati font-semibold text-gray-800 text-sm leading-tight text-left">
                  {card.title}
                </h3>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="premium-card p-6">
          <div className="flex items-center justify-around">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-600 text-xs font-gujarati mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}