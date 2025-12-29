import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, LogOut, Camera, ChevronRight, 
  Heart, Users, FileText, Settings, Loader2, Save 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // User State
  const [userSession, setUserSession] = useState(null);
  const [profile, setProfile] = useState({
    id: '',
    full_name: '',
    mobile: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/'); // If not logged in, go to login
        return;
      }
      setUserSession(user);

      // Fetch Profile Data
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile({
          id: data.id,
          full_name: data.full_name || '',
          mobile: data.mobile || user.email?.split('@')[0] || '', // Fallback to mobile from fake email
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // 📤 Logout Function
  const handleLogout = async () => {
    if (window.confirm('શું તમે લોગ આઉટ કરવા માંગો છો?')) {
        await supabase.auth.signOut();
        navigate('/');
    }
  };

  // 📸 Image Upload
  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update Local State & DB
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      await updateProfileInDB({ avatar_url: publicUrl });
      
      alert('પ્રોફાઈલ ફોટો અપડેટ થઈ ગયો!');

    } catch (error) {
      alert('ફોટો અપલોડમાં ભૂલ છે.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // 💾 Update Name
  const handleSaveName = async () => {
    setSaving(true);
    await updateProfileInDB({ full_name: profile.full_name });
    setSaving(false);
    alert('નામ અપડેટ થઈ ગયું!');
  };

  // Helper to update DB
  const updateProfileInDB = async (updates) => {
    if (!userSession) return;
    const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userSession.id);
    
    if (error) console.error(error);
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-8 h-8 text-[#800000] animate-spin" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* Header / Cover: Maroon with Gold Glow */}
      <div className="bg-[#800000] pb-20 pt-10 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
            <h1 className="text-white font-bold font-gujarati text-2xl">મારું એકાઉન્ટ</h1>
            <button onClick={() => navigate('/settings')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all">
                <Settings className="w-5 h-5 text-white" />
            </button>
        </div>
        
        {/* Profile Card Info */}
        <div className="flex flex-col items-center relative z-10">
              <div className="relative group">
                {/* Gold Border for Profile Image */}
                <div className="w-28 h-28 rounded-full border-4 border-[#D4AF37] shadow-xl overflow-hidden bg-gray-200">
                    {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white">
                            <User className="w-12 h-12 text-[#D4AF37]" />
                        </div>
                    )}
                </div>
                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 bg-[#D4AF37] p-2 rounded-full shadow-lg cursor-pointer active:scale-90 transition-transform hover:bg-[#B8860B]">
                    {uploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
             </div>
             
             <div className="mt-4 text-center w-full max-w-xs">
                {/* Editable Name Input */}
                <div className="flex items-center justify-center space-x-2 bg-white/10 rounded-xl p-1 mb-1 backdrop-blur-sm">
                    <input 
                        type="text" 
                        value={profile.full_name} 
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="bg-transparent text-white font-bold text-xl text-center focus:outline-none w-full font-gujarati placeholder-white/50"
                        placeholder="તમારું નામ"
                    />
                    <button onClick={handleSaveName} className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-all">
                        {saving ? <Loader2 className="w-4 h-4 text-white animate-spin"/> : <Save className="w-4 h-4 text-white"/>}
                    </button>
                </div>
                {/* Gold Mobile Number */}
                <p className="text-[#D4AF37] text-sm font-medium flex items-center justify-center">
                    <Phone className="w-3 h-3 mr-1" /> +91 {profile.mobile}
                </p>
             </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="px-6 -mt-10 space-y-4 relative z-10">
        {/* Status Card */}
        <motion.div initial={{y: 20, opacity: 0}} animate={{y: 0, opacity: 1}} className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-between border border-[#D4AF37]/20">
            <div>
                <p className="text-gray-400 text-xs font-gujarati uppercase tracking-wider">સભ્ય સ્ટેટસ</p>
                <p className="text-[#800000] font-bold font-gujarati">વેરીફાઈડ સભ્ય ✅</p>
            </div>
            <div className="h-10 w-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#B8860B]" />
            </div>
        </motion.div>

        {/* Links */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <MenuItem 
                icon={Heart} 
                title="મારી મેટ્રિમોની પ્રોફાઈલ" 
                subtitle="તમારો બાયોડેટા અને પસંદગીઓ" 
                color="text-[#800000]" 
                bg="bg-[#800000]/10"
                onClick={() => navigate('/matrimony')}
            />
            <div className="h-[1px] bg-gray-100 mx-16"></div>
            <MenuItem 
                icon={Users} 
                title="મારો પરિવાર" 
                subtitle="પરિવારની યાદી અને સભ્યો" 
                color="text-[#B8860B]" 
                bg="bg-[#D4AF37]/10"
                onClick={() => navigate('/family-list')}
            />
            <div className="h-[1px] bg-gray-100 mx-16"></div>
            <MenuItem 
                icon={FileText} 
                title="મારી રિક્વેસ્ટ & ચેટ" 
                subtitle="આવેલી અને મોકલેલી રિક્વેસ્ટ" 
                color="text-[#800000]" 
                bg="bg-[#800000]/5"
                onClick={() => navigate('/requests')}
            />
        </div>

        {/* Logout Button */}
        <button 
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 active:scale-95 transition-transform hover:bg-red-100"
        >
            <LogOut className="w-5 h-5" />
            <span>લોગ આઉટ કરો</span>
        </button>

        <p className="text-center text-gray-400 text-xs mt-4">Version 1.0.0 • Thakor Samaj Sangathan</p>
      </div>

      <BottomNav />
    </div>
  );
}

// Helper Component for Menu Items
function MenuItem({ icon: Icon, title, subtitle, color, bg, onClick }) {
    return (
        <button onClick={onClick} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
            <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                    <h3 className="text-gray-800 font-bold font-gujarati text-sm">{title}</h3>
                    <p className="text-gray-400 text-xs font-gujarati">{subtitle}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
    );
}