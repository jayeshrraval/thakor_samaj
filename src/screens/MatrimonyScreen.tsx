import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, CheckCircle, Loader2, Send, Save, Upload } from 'lucide-react';
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

  const fetchSentRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('requests').select('receiver_id').eq('sender_id', user.id);
    if (data) setSentRequests(new Set(data.map(r => r.receiver_id)));
  };

  const handleSendRequest = async (receiverId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("લોગિન જરૂરી છે.");
    const { error } = await supabase.from('requests').insert([{ sender_id: user.id, receiver_id: receiverId, status: 'pending' }]);
    if (error) alert("ભૂલ આવી.");
    else {
      alert("રિક્વેસ્ટ મોકલાઈ ગઈ! ✅");
      setSentRequests(prev => new Set(prev).add(receiverId));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert('લોગીન કરો.');
      
      const { error } = await supabase
        .from('matrimony_profiles')
        .upsert({ user_id: user.id, ...formData, age: parseInt(formData.age) || 0, updated_at: new Date() }, { onConflict: 'user_id' });

      if (error) throw error;
      alert('પ્રોફાઈલ સફળતાપૂર્વક સેવ થઈ ગઈ! 🎉');
      setActiveTab('list');
      fetchProfiles();
    } catch (error) {
      alert('ભૂલ આવી છે.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-8">
        <h1 className="text-white font-gujarati font-bold text-2xl">મેટ્રિમોની</h1>
        <p className="text-white/80 text-sm">યોગ્ય જીવનસાથીની શોધ અહીં પૂરી થશે</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10 flex justify-around px-2">
        {['list', 'detail', 'myprofile'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            disabled={tab === 'detail' && !selectedProfile}
            className={`py-4 px-2 font-gujarati text-sm font-medium ${activeTab === tab ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
          >
            {tab === 'list' ? 'પ્રોફાઈલ લિસ્ટ' : tab === 'detail' ? 'વિગત' : 'મારી પ્રોફાઈલ'}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'list' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-3 text-gray-400" size={18} />
              <input type="text" placeholder="શોધો..." className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm font-gujarati" />
            </div>

            {loading ? <Loader2 className="animate-spin mx-auto text-pink-500 mt-10" /> : 
              profiles.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex space-x-4">
                    <img src={p.image_url || 'https://via.placeholder.com/100'} className="w-20 h-20 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 font-gujarati">{p.full_name}</h3>
                      <p className="text-xs text-gray-500 font-gujarati">{p.village} | {p.age} વર્ષ</p>
                      <button onClick={() => { setSelectedProfile(p); setActiveTab('detail'); }} className="mt-2 text-pink-500 text-xs font-bold font-gujarati">વધારે જુઓ</button>
                    </div>
                    <button onClick={() => handleSendRequest(p.user_id)} disabled={sentRequests.has(p.user_id)} className={`p-3 rounded-full ${sentRequests.has(p.user_id) ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'}`}>
                      {sentRequests.has(p.user_id) ? <CheckCircle size={20} /> : <Send size={20} />}
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {activeTab === 'detail' && selectedProfile && (
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <img src={selectedProfile.image_url || 'https://via.placeholder.com/300'} className="w-full h-72 object-cover" />
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold font-gujarati">{selectedProfile.full_name}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm font-gujarati">
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-gray-500 text-xs">ગામ</p><p>{selectedProfile.village}</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-gray-500 text-xs">ઉંમર</p><p>{selectedProfile.age} વર્ષ</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-gray-500 text-xs">શિક્ષણ</p><p>{selectedProfile.education}</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-gray-500 text-xs">ગોત્ર</p><p>{selectedProfile.peta_atak}</p></div>
              </div>
              <button onClick={() => handleSendRequest(selectedProfile.user_id)} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-bold font-gujarati">પસંદ કરો / રિક્વેસ્ટ મોકલો</button>
            </div>
          </div>
        )}

        {activeTab === 'myprofile' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-gujarati text-gray-800">મારી માહિતી ભરો</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 font-gujarati ml-1">પૂરું નામ</label>
                <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none font-gujarati" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-gujarati ml-1">ઉંમર</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-gujarati ml-1">ગામ</label>
                  <input type="text" value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none font-gujarati" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-gujarati ml-1">પેટા અટક (ગોત્ર)</label>
                <input type="text" value={formData.peta_atak} onChange={(e) => setFormData({...formData, peta_atak: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none font-gujarati" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-gujarati ml-1">શિક્ષણ</label>
                <input type="text" value={formData.education} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none font-gujarati" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-gujarati ml-1">વ્યવસાય</label>
                <input type="text" value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border-none font-gujarati" />
              </div>
              <button onClick={handleSaveProfile} disabled={loading} className="w-full bg-deep-blue text-white py-4 rounded-2xl font-bold font-gujarati shadow-lg">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : 'પ્રોફાઈલ સેવ કરો'}
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}