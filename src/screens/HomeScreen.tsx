import React, { useEffect, useState } from 'react';
import { 
  Bell, Settings, Heart, Search, MessageCircle, User, CreditCard, 
  Building2, Bot, Users, GraduationCap, AlertTriangle, Briefcase 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; 

export default function HomeScreen() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Yogi Member');
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ નવા સ્ટેટ્સ: એપ યુઝર્સ અને મેટ્રિમોની પ્રોફાઈલ માટે
  const [statsData, setStatsData] = useState({
    totalAppUsers: 0,
    matrimonyProfiles: 0,
    messages: 0
  });

  // --- Real-time Logic ---
  useEffect(() => {
    fetchDashboardData();

    // ડેટાબેઝમાં ફેરફાર થાય તો ઓટોમેટિક અપડેટ કરો
    const channel = supabase
      .channel('realtime-counts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matrimony_profiles' },
        () => fetchDashboardData() 
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' }, // ✅ અહીં 'users' ટેબલ સેટ કર્યું છે
        () => fetchDashboardData() 
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
        // ૧. યુઝર ડેટા (પ્રોફાઇલ માટે 'users' ટેબલ વાપર્યું છે)
        const { data: userData } = await supabase
          .from('users') // ✅ 'profiles' ને બદલે ફરીથી 'users' કરી દીધું
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .maybeSingle();
        
        if (userData) {
          setUserName(userData.full_name || user.user_metadata?.full_name || 'Yogi Member');
          setUserPhoto(userData.avatar_url);
        }

        // ૨. કુલ રજીસ્ટર્ડ યુઝર્સ (App Users)
        const { count: userCount } = await supabase
          .from('users') // ✅ 'profiles' ને બદલે ફરીથી 'users' કરી દીધું
          .select('*', { count: 'exact', head: true });

        // ૩. કુલ મેટ્રિમોની પ્રોફાઈલ્સ
        const { count: profileCount } = await supabase
          .from('matrimony_profiles')
          .select('*', { count: 'exact', head: true });

        // ૪. વણવંચાયેલા મેસેજ
        const { count: messageCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false); 

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
    { icon: Heart, title: 'મેટ્રિમોની પ્રોફાઈલ', color: 'from-pink-400 to-rose-500', path: '/matrimony' },
    { icon: Search, title: 'પાર્ટનર શોધો', color: 'from-mint to-teal-500', path: '/matrimony' },
    { icon: Users, title: 'પરિવાર રજીસ્ટ્રેશન', color: 'from-deep-blue to-cyan-500', path: '/family-list' },
    { icon: GraduationCap, title: 'શિક્ષણ અને ભવિષ્ય', color: 'from-indigo-400 to-purple-500', path: '/education' },
    { icon: Briefcase, title: 'નોકરીની જાહેરાત', color: 'from-blue-600 to-indigo-600', path: '/jobs' },
    { icon: MessageCircle, title: 'મેસેજ', color: 'from-blue-400 to-cyan-500', path: '/messages' },
    { icon: User, title: 'મારી પ્રોફાઈલ', color: 'from-amber-400 to-orange-500', path: '/profile' },
    { icon: CreditCard, title: 'મેમ્બરશીપ ફી', color: 'from-royal-gold to-yellow-600', path: '/subscription' },
    { icon: Building2, title: 'યોગી સમાજ ટ્રસ્ટ', color: 'from-emerald-400 to-green-500', path: '/trust' },
    { icon: Bot, title: 'જ્ઞાન સહાયક', color: 'from-violet-400 to-purple-500', path: '/ai-assistant' },
  ];

  // ✅ અહીં હવે 'રસ દાખવ્યો' નથી, તેના બદલે રજીસ્ટર્ડ યુઝર અને મેટ્રિમોની આંકડા છે
  const stats = [
    { label: 'કુલ સભ્યો', value: statsData.totalAppUsers.toString(), color: 'text-deep-blue' },
    { label: 'લગ્ન પ્રોફાઈલ', value: statsData.matrimonyProfiles.toString(), color: 'text-mint' },
    { label: 'મેસેજ', value: statsData.messages.toString(), color: 'text-rose-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-gujarati">
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => navigate('/profile')}
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 shadow-inner overflow-hidden cursor-pointer"
              >
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-white font-bold text-xl tracking-tight">
                  {loading ? 'તૈયાર થઈ રહ્યું છે...' : `નમસ્તે, ${userName}`}
                </h1>
                <p className="text-mint text-xs font-medium uppercase tracking-widest">Yogi Samaj Connect</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center relative backdrop-blur-md active:scale-90 transition-all">
                <Bell className="w-5 h-5 text-white" />
                {statsData.messages > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/krishna-chat')}
        className="mx-6 -mt-6 p-5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border-2 border-white relative overflow-hidden"
      >
        <div className="relative z-10 text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            🦚 કૃષ્ણ સારથી (AI)
          </h3>
          <p className="text-xs text-orange-50 text-opacity-90 mt-1">ગીતાજીના જ્ઞાનથી સમસ્યાનું સમાધાન મેળવો.</p>
        </div>
        <div className="relative z-10 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/50 shadow-lg">
          <span className="text-2xl">🙏</span>
        </div>
      </motion.div>

      <div className="px-6 mt-6">
          <motion.div 
             whileTap={{ scale: 0.95 }}
             onClick={() => navigate('/accidental-aid')}
             className="bg-white p-4 rounded-2xl shadow-md border-l-8 border-red-600 flex items-center justify-between relative active:bg-red-50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">અકસ્માત સહાય (SOS)</h3>
                <p className="text-[10px] text-red-500 font-bold uppercase">ઈમરજન્સી મદદ માટે અહીં ક્લિક કરો</p>
              </div>
            </div>
            <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-black shadow-lg">HELP</div>
          </motion.div>
      </div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(card.path)}
                className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-md active:scale-95 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-800 text-[13px] leading-snug text-left tracking-tight">
                  {card.title}
                </h3>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex items-center justify-around">
            {stats.map((stat, index) => (
              <div key={index} className="text-center border-r last:border-0 border-gray-100 flex-1">
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-500 text-[9px] font-bold mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}