import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Heart, ArrowUpDown, CheckCircle, Share2, Save, Upload, Loader2, Send } from 'lucide-react';
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
  
  // Status tracking (કોને રિક્વેસ્ટ મોકલી છે તે યાદ રાખવા)
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  // Form State for My Profile
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

  // Fetch Profiles on Load
  useEffect(() => {
    fetchProfiles();
    fetchMyProfile();
    fetchSentRequests();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    // બીજાની પ્રોફાઇલ બતાવો (પોતાની નહીં)
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = supabase
      .from('matrimony_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (user) {
        query = query.neq('user_id', user.id); // Don't show my own profile
    }
    
    const { data } = await query;
    if (data) setProfiles(data);
    setLoading(false);
  };

  const fetchMyProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('matrimony_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setFormData({
            full_name: data.full_name || '',
            father_name: data.father_name || '',
            mother_name: data.mother_name || '',
            peta_atak: data.peta_atak || '',
            mother_peta_atak: data.mother_peta_atak || '',
            gol: data.gol || '',
            age: data.age ? data.age.toString() : '',
            village: data.village || '',
            taluka: data.taluka || '',
            district: data.district || '',
            education: data.education || '',
            occupation: data.occupation || '',
            kundali_available: data.kundali_available || false,
            image_url: data.image_url || ''
        });
      }
    }
  };

  // મેં કોને કોને રિક્વેસ્ટ મોકલી છે તે તપાસો
  const fetchSentRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
        .from('requests')
        .select('receiver_id')
        .eq('sender_id', user.id);
    
    if (data) {
        const ids = new Set(data.map(r => r.receiver_id));
        setSentRequests(ids);
    }
  };

  // 🚀 SEND REQUEST LOGIC
  const handleSendRequest = async (receiverId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("રિક્વેસ્ટ મોકલવા માટે લોગિન કરવું જરૂરી છે.");
            return;
        }

        if (sentRequests.has(receiverId)) {
            alert("તમે પહેલેથી જ રિક્વેસ્ટ મોકલી છે.");
            return;
        }

        const { error } = await supabase
            .from('requests')
            .insert([
                { sender_id: user.id, receiver_id: receiverId, status: 'pending' }
            ]);

        if (error) throw error;

        alert("રિક્વેસ્ટ સફળતાપૂર્વક મોકલાઈ ગઈ! ✅");
        setSentRequests(prev => new Set(prev).add(receiverId));

    } catch (error) {
        console.error(error);
        alert("ભૂલ આવી છે. ફરી પ્રયત્ન કરો.");
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: any) => {
    // ... (Upload logic remains same)
    // For brevity, skipping repeated code here, keep your existing upload logic
    alert("Upload logic placeholder");
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('કૃપા કરીને લોગીન કરો.');
        return;
      }

      const updates = {
        user_id: user.id,
        ...formData,
        age: parseInt(formData.age) || 0,
        updated_at: new Date(),
      };

      const { error } = await supabase
        .from('matrimony_profiles')
        .upsert(updates, { onConflict: 'user_id' });

      if (error) throw error;

      alert('પ્રોફાઈલ સેવ થઈ ગઈ!');
      fetchProfiles(); 
    } catch (error) {
      console.error(error);
      alert('પ્રોફાઈલ સેવ કરવામાં ભૂલ છે.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">મેટ્રિમોની</h1>
        <p className="text-white/80 text-sm">આદર્શ જીવનસાથી શોધો</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4 sticky top-0 z-10">
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-2 font-gujarati font-medium whitespace-nowrap transition-all ${
              activeTab === 'list' ? 'text-deep-blue border-b-2 border-deep-blue' : 'text-gray-500'
            }`}
          >
            પ્રોફાઈલ લિસ્ટ
          </button>
          <button
            onClick={() => setActiveTab('detail')}
            disabled={!selectedProfile}
            className={`pb-3 px-2 font-gujarati font-medium whitespace-nowrap transition-all ${
              activeTab === 'detail' ? 'text-deep-blue border-b-2 border-deep-blue' : 'text-gray-500'
            } ${!selectedProfile ? 'opacity-50' : ''}`}
          >
            પ્રોફાઈલ વિગત
          </button>
          <button
            onClick={() => setActiveTab('myprofile')}
            className={`pb-3 px-2 font-gujarati font-medium whitespace-nowrap transition-all ${
              activeTab === 'myprofile' ? 'text-deep-blue border-b-2 border-deep-blue' : 'text-gray-500'
            }`}
          >
            મારી પ્રોફાઈલ
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'list' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="શોધો..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
                />
              </div>
              <button className="px-4 py-3 bg-white border border-gray-200 rounded-2xl">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Profile Cards */}
            {loading ? (
                <div className="text-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500" />
                    <p className="mt-2 text-gray-500">પ્રોફાઇલ લાવી રહ્યા છીએ...</p>
                </div>
            ) : profiles.length === 0 ? (
                <div className="text-center py-10 text-gray-500">કોઈ પ્રોફાઇલ મળી નથી.</div>
            ) : (
                profiles.map((profile, index) => (
                <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="premium-card p-4"
                >
                    <div className="flex space-x-4">
                    <img
                        src={profile.image_url || 'https://via.placeholder.com/150'}
                        alt={profile.full_name}
                        className="w-24 h-24 rounded-2xl object-cover bg-gray-200"
                    />
                    <div className="flex-1 space-y-2">
                        <h3 className="font-gujarati font-bold text-gray-800">{profile.full_name}</h3>
                        <p className="text-sm text-gray-600 font-gujarati">
                        ગામ: {profile.village}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-mint/10 text-deep-blue rounded-full font-gujarati">
                            {profile.gol}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {profile.age} વર્ષ
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                    <button
                        onClick={() => {
                            setSelectedProfile(profile);
                            setActiveTab('detail');
                        }}
                        className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-gujarati font-medium"
                    >
                        વિગત જુઓ
                    </button>
                    {/* Send Request Button directly on card */}
                    <button 
                        onClick={() => handleSendRequest(profile.user_id)}
                        disabled={sentRequests.has(profile.user_id)}
                        className={`flex-1 py-2.5 rounded-xl font-gujarati font-medium text-white flex justify-center items-center space-x-2 ${
                            sentRequests.has(profile.user_id) ? 'bg-green-500' : 'bg-deep-blue'
                        }`}
                    >
                        {sentRequests.has(profile.user_id) ? (
                             <><span>Sent</span> <CheckCircle className="w-4 h-4" /></>
                        ) : (
                             <><span>Request</span> <Send className="w-4 h-4" /></>
                        )}
                    </button>
                    </div>
                </motion.div>
                ))
            )}
          </div>
        )}

        {activeTab === 'detail' && selectedProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Photo */}
            <div className="premium-card overflow-hidden">
              <img
                src={selectedProfile.image_url || 'https://via.placeholder.com/300'}
                alt={selectedProfile.full_name}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Basic Info & Family Info (Keeping it short for code length) */}
            <div className="premium-card p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 font-gujarati">માહિતી</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">નામ</p><p className="font-medium">{selectedProfile.full_name}</p></div>
                <div><p className="text-xs text-gray-500">ગામ</p><p className="font-medium">{selectedProfile.village}</p></div>
                <div><p className="text-xs text-gray-500">પિતા</p><p className="font-medium">{selectedProfile.father_name}</p></div>
                <div><p className="text-xs text-gray-500">શિક્ષણ</p><p className="font-medium">{selectedProfile.education}</p></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleSendRequest(selectedProfile.user_id)}
                disabled={sentRequests.has(selectedProfile.user_id)}
                className={`text-white font-gujarati font-semibold py-3 rounded-xl flex justify-center items-center space-x-2 ${
                    sentRequests.has(selectedProfile.user_id) ? 'bg-green-600' : 'bg-mint text-deep-blue'
                }`}
              >
                 {sentRequests.has(selectedProfile.user_id) ? 'રિક્વેસ્ટ મોકલેલ છે' : 'રીક્વેસ્ટ મોકલો'}
              </button>
              
              <button className="bg-deep-blue text-white font-gujarati font-semibold py-3 rounded-xl">
                શોર્ટલિસ્ટ કરો
              </button>
            </div>
          </motion.div>
        )}

        {/* My Profile Form (Keeping same as before) */}
        {activeTab === 'myprofile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
             {/* ... Same form code as before ... */}
             <div className="premium-card p-6 text-center">
                 <p className="text-gray-500">ફોર્મ અહીં દેખાશે (Code shortened for brevity)</p>
                 <button onClick={handleSaveProfile} className="mt-4 bg-deep-blue text-white py-3 px-6 rounded-xl">પ્રોફાઈલ અપડેટ કરો</button>
             </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}