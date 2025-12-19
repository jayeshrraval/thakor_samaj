import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, ArrowUpDown, CheckCircle, Share2, Save, Loader2, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; 

type TabType = 'list' | 'detail' | 'myprofile';

export default function MatrimonyScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  // Form State - તારા UI મુજબ
  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    mother_name: '',
    peta_atak: '',
    mother_peta_atak: '',
    gol: '',
    age: '',
    village: '',
    taluka: '',
    district: '',
    education: '',
    occupation: '',
    kundali_available: false,
    image_url: ''
  });

  useEffect(() => {
    fetchProfiles();
    fetchMyProfile();
    fetchSentRequests();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    let query = supabase.from('matrimony_profiles').select('*').order('created_at', { ascending: false });
    if (user) query = query.neq('user_id', user.id);
    const { data } = await query;
    if (data) setProfiles(data);
    setLoading(false);
  };

  const fetchMyProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('matrimony_profiles').select('*').eq('user_id', user.id).single();
      if (data) setFormData({ ...data, age: data.age?.toString() || '' });
    }
  };

  const fetchSentRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('requests').select('receiver_id').eq('sender_id', user.id);
      if (data) setSentRequests(new Set(data.map(r => r.receiver_id)));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert('લોગીન કરો.');

      const { error } = await supabase.from('matrimony_profiles').upsert({
        user_id: user.id,
        ...formData,
        age: parseInt(formData.age) || 0,
        updated_at: new Date()
      }, { onConflict: 'user_id' });

      if (error) throw error;
      alert('તમારી પ્રોફાઇલ સફળતાપૂર્વક સેવ થઈ ગઈ! 🎉');
      setActiveTab('list');
      fetchProfiles();
    } catch (error) {
      alert('ભૂલ આવી: ડેટાબેઝ ચેક કરો.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">મેટ્રિમોની</h1>
        <p className="text-white/80 text-sm">આદર્શ જીવનસાથી શોધો</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4 sticky top-0 z-10">
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar">
          {['list', 'detail', 'myprofile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`pb-3 px-2 font-gujarati font-medium whitespace-nowrap transition-all ${
                activeTab === tab ? 'text-deep-blue border-b-2 border-deep-blue' : 'text-gray-500'
              }`}
            >
              {tab === 'list' ? 'પ્રોફાઈલ લિસ્ટ' : tab === 'detail' ? 'પ્રોફાઈલ વિગત' : 'મારી મેટ્રિમોની પ્રોફાઈલ'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'list' && (
          <div className="space-y-4">
             {/* Search & Profiles Logic - તારા અગાઉના UI મુજબ */}
             {profiles.map((profile, index) => (
                <motion.div key={profile.id} className="premium-card p-4">
                   <div className="flex space-x-4">
                      <img src={profile.image_url || 'https://via.placeholder.com/150'} className="w-24 h-24 rounded-2xl object-cover bg-gray-100" />
                      <div className="flex-1">
                         <h3 className="font-gujarati font-bold text-gray-800">{profile.full_name}</h3>
                         <p className="text-xs text-gray-500 font-gujarati">{profile.village} | {profile.age} વર્ષ</p>
                         <button onClick={() => { setSelectedProfile(profile); setActiveTab('detail'); }} className="mt-2 text-pink-500 text-xs font-bold font-gujarati">વિગત જુઓ</button>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        )}

        {activeTab === 'myprofile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Form Fields - તારા UI મુજબ લાઇન ટુ લાઇન */}
            <div className="premium-card p-6 space-y-4">
              <h3 className="font-gujarati font-bold text-gray-800 mb-4">માહિતી</h3>
              {[
                { label: 'નામ', field: 'full_name' },
                { label: 'પિતા નું નામ', field: 'father_name' },
                { label: 'માતા નું નામ', field: 'mother_name' },
                { label: 'પેટા અટક', field: 'peta_atak' },
                { label: 'માતાની પેટા અટક', field: 'mother_peta_atak' },
                { label: 'ગોળ', field: 'gol' },
                { label: 'વય', field: 'age' },
                { label: 'ગામ', field: 'village' },
                { label: 'તાલુકો', field: 'taluka' },
                { label: 'જીલ્લો', field: 'district' },
                { label: 'શિક્ષણ', field: 'education' },
                { label: 'નોકરી/ધંધો', field: 'occupation' },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-sm text-gray-600 font-gujarati mb-1">{item.label}</label>
                  <input
                    type="text"
                    value={(formData as any)[item.field]}
                    onChange={(e) => setFormData({ ...formData, [item.field]: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
                    placeholder={`${item.label} દાખલ કરો`}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600 font-gujarati">કુંડળી ઉપલબ્ધ?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.kundali_available}
                    onChange={(e) => setFormData({...formData, kundali_available: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-mint after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 bg-deep-blue text-white font-gujarati font-semibold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'પ્રોફાઈલ સેવ કરો'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}