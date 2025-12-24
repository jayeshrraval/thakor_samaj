import React, { useState, useEffect } from 'react';
import { Search, Heart, Loader2, User, MapPin, Briefcase, GraduationCap, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; 

type TabType = 'list' | 'detail' | 'myprofile';

export default function MatrimonyScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // પોતાની પ્રોફાઇલ સિવાયની બધી પ્રોફાઇલ બતાવો
    let query = supabase.from('matrimony_profiles').select('*').order('created_at', { ascending: false });
    
    // જો તમે ઇચ્છો કે બધાની પ્રોફાઇલ દેખાય (પોતાની પણ), તો નીચેની લાઇન કાઢી નાખવી
    if (user) query = query.neq('user_id', user.id);
    
    const { data, error } = await query;
    if (data) setProfiles(data);
    setLoading(false);
  };

  const fetchMyProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('matrimony_profiles').select('*').eq('user_id', user.id).maybeSingle();
      if (data) setFormData({ ...data, age: data.age?.toString() || '' });
    }
  };

  // ✅ ફોટો અપલોડ કરવાનું લોજિક
  const handleImageUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `matrimony/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // ખાતરી કરો કે આ બકેટ પબ્લિક છે
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      alert('ફોટો અપલોડ થઈ ગયો! હવે પ્રોફાઇલ સેવ કરો.');

    } catch (error: any) {
      alert('અપલોડમાં ભૂલ: ' + error.message);
    } finally {
      setUploading(false);
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
    } catch (error: any) {
      alert('ભૂલ આવી: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-gujarati">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 px-6 py-8 shadow-lg">
        <h1 className="text-white font-bold text-3xl">મેટ્રિમોની</h1>
        <p className="text-pink-100 text-sm mt-1 opacity-90 tracking-wide">યોગ્ય જીવનસાથીની પસંદગી</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4 sticky top-0 z-20 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="flex space-x-6">
          {[
            { id: 'list', label: 'પ્રોફાઈલ લિસ્ટ' },
            { id: 'myprofile', label: 'મારી પ્રોફાઈલ' },
            { id: 'detail', label: 'વિગત' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-3 px-1 font-bold transition-all text-sm ${
                activeTab === tab.id ? 'text-pink-600 border-b-4 border-pink-600' : 'text-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'list' && (
          <div className="space-y-4">
            {loading ? (
                <Loader2 className="animate-spin mx-auto mt-10 text-pink-500" />
            ) : profiles.length === 0 ? (
                <p className="text-center text-gray-400 mt-10 font-bold">કોઈ પ્રોફાઇલ મળી નથી.</p>
            ) : (
                profiles.map((profile) => (
                    <motion.div 
                        key={profile.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-4 rounded-[30px] shadow-sm border border-gray-100 flex gap-4 items-center"
                    >
                       <div className="w-20 h-20 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0 border border-pink-100 overflow-hidden shadow-inner">
                           {profile.image_url ? (
                               <img src={profile.image_url} className="w-full h-full object-cover" />
                           ) : (
                               <User className="text-pink-200 w-10 h-10" />
                           )}
                       </div>
                       <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg leading-tight">{profile.full_name}</h3>
                          <p className="text-pink-600 text-xs font-bold mt-1 bg-pink-50 w-fit px-2 py-0.5 rounded-full">{profile.age} વર્ષ | {profile.village}</p>
                          <div className="mt-2 flex gap-2">
                             <button 
                                onClick={() => { setSelectedProfile(profile); setActiveTab('detail'); }}
                                className="bg-pink-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-90 transition-all"
                             >
                                વિગત જુઓ
                             </button>
                          </div>
                       </div>
                    </motion.div>
                ))
            )}
          </div>
        )}

        {activeTab === 'detail' && (
            <div className="space-y-6">
                {selectedProfile ? (
                    <div className="bg-white rounded-[40px] p-6 shadow-xl border border-pink-50">
                        <div className="text-center mb-6">
                            <div className="w-32 h-32 bg-pink-50 rounded-full mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                {selectedProfile.image_url ? (
                                   <img src={selectedProfile.image_url} className="w-full h-full object-cover" />
                                ) : (
                                   <User className="text-pink-200 w-16 h-16" />
                                )}
                            </div>
                            <h2 className="text-2xl font-black text-gray-800">{selectedProfile.full_name}</h2>
                            <p className="text-pink-500 font-bold uppercase text-xs tracking-widest">{selectedProfile.peta_atak}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 border-t pt-6">
                            <DetailRow icon={MapPin} label="ગામ" value={selectedProfile.village} />
                            <DetailRow icon={Briefcase} label="ધંધો" value={selectedProfile.occupation} />
                            <DetailRow icon={GraduationCap} label="શિક્ષણ" value={selectedProfile.education} />
                            <DetailRow icon={Heart} label="ગોળ" value={selectedProfile.gol} />
                        </div>
                    </div>
                ) : <p className="text-center text-gray-400">કૃપા કરીને લિસ્ટમાંથી પ્રોફાઇલ પસંદ કરો.</p>}
            </div>
        )}

        {activeTab === 'myprofile' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 space-y-4">
              
              {/* ✅ ફોટો અપલોડ સેક્શન */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-pink-200 overflow-hidden flex items-center justify-center shadow-inner">
                    {formData.image_url ? (
                      <img src={formData.image_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-pink-100" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-pink-600 p-3 rounded-2xl shadow-lg cursor-pointer active:scale-90 transition-transform">
                    {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-widest">તમારો સારો ફોટો અપલોડ કરો</p>
              </div>

              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">વ્યક્તિગત માહિતી</h3>
              {[
                { label: 'પૂરું નામ', field: 'full_name' },
                { label: 'પિતા નું નામ', field: 'father_name' },
                { label: 'માતા નું નામ', field: 'mother_name' },
                { label: 'પેટા અટક', field: 'peta_atak' },
                { label: 'માતાની પેટા અટક', field: 'mother_peta_atak' },
                { label: 'ગોળ (દા.ત. કાશ્યપ)', field: 'gol' },
                { label: 'વય (ઉંમર)', field: 'age' },
                { label: 'ગામ', field: 'village' },
                { label: 'તાલુકો', field: 'taluka' },
                { label: 'જીલ્લો', field: 'district' },
                { label: 'શિક્ષણ', field: 'education' },
                { label: 'નોકરી/ધંધો', field: 'occupation' },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-[10px] text-gray-400 font-black uppercase mb-1 ml-1">{item.label}</label>
                  <input
                    type="text"
                    value={(formData as any)[item.field]}
                    onChange={(e) => setFormData({ ...formData, [item.field]: e.target.value })}
                    className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-pink-500 font-bold text-gray-700"
                    placeholder={`${item.label} લખો`}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl">
                <span className="text-sm font-bold text-pink-700">કુંડળી ઉપલબ્ધ છે?</span>
                <input 
                  type="checkbox" 
                  className="w-6 h-6 accent-pink-600 rounded"
                  checked={formData.kundali_available}
                  onChange={(e) => setFormData({...formData, kundali_available: e.target.checked})}
                />
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={loading || uploading}
                className="w-full bg-pink-600 text-white font-black py-4 rounded-[20px] shadow-lg active:scale-95 transition-all mt-6 uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto text-white" /> : 'પ્રોફાઇલ સેવ કરો'}
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

// Helper Component
function DetailRow({ icon: Icon, label, value }: any) {
    return (
        <div className="flex flex-col p-3 bg-gray-50 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className="text-pink-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{label}</span>
            </div>
            <p className="text-sm font-bold text-gray-700 truncate">{value || '-'}</p>
        </div>
    );
}