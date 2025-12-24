import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// ✅ બધા જ આઈકોન્સ અને CheckCircle અહીં ઈમ્પોર્ટ કર્યા છે
import { 
  ArrowLeft, Check, X, MessageCircle, User, Loader2, 
  CheckCircle, UserPlus, Clock, ShieldCheck, Heart 
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function RequestsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'received' | 'connected'>('received');
  const [requests, setRequests] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ટેબ બદલાય ત્યારે ડેટા ખેંચો
  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setLoading(false);
        return;
    }

    try {
      if (activeTab === 'received') {
        // ૧. મને આવેલી પેન્ડિંગ રિક્વેસ્ટ અને મોકલનારની વિગતો મેળવો
        const { data: reqs, error } = await supabase
          .from('requests')
          .select('*')
          .eq('receiver_id', user.id)
          .eq('status', 'pending');
        
        if (error) throw error;

        if (reqs && reqs.length > 0) {
            const senderIds = reqs.map(r => r.sender_id);
            const { data: profiles } = await supabase
                .from('matrimony_profiles')
                .select('user_id, full_name, image_url, village, age, peta_atak, occupation')
                .in('user_id', senderIds);
            
            const merged = reqs.map(r => ({
                ...r,
                profile: profiles?.find(p => p.user_id === r.sender_id)
            }));
            setRequests(merged);
        } else {
            setRequests([]);
        }

      } else {
        // ૨. સ્વીકારેલા કનેક્શન અને ચેટ રૂમની લિસ્ટ ખેંચો
        const { data: conns, error } = await supabase
          .from('requests')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted');

        if (error) throw error;

        if (conns && conns.length > 0) {
            const otherIds = conns.map(c => c.sender_id === user.id ? c.receiver_id : c.sender_id);
            const { data: profiles } = await supabase
                .from('matrimony_profiles')
                .select('user_id, full_name, image_url, village, age, occupation')
                .in('user_id', otherIds);

            const merged = conns.map(c => {
                const otherId = c.sender_id === user.id ? c.receiver_id : c.sender_id;
                return {
                    ...c,
                    otherId: otherId,
                    profile: profiles?.find(p => p.user_id === otherId)
                };
            });
            setConnections(merged);
        } else {
            setConnections([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ રિક્વેસ્ટ સ્વીકારવાનું લોજિક
  const handleAccept = async (requestId: number, senderId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;

        // સ્ટેટસ અપડેટ કરો
        const { error: updateError } = await supabase
            .from('requests')
            .update({ status: 'accepted' })
            .eq('id', requestId);

        if (updateError) throw updateError;

        // ચેટ રૂમ બનાવો (White blank screen રોકવા માટે)
        const { error: roomError } = await supabase
            .from('chat_rooms')
            .insert([{
                type: 'matrimony',
                participant_ids: [user.id, senderId] 
            }]);

        if (roomError) console.error('Chat Room Creation Error:', roomError);

        alert("રિક્વેસ્ટ સ્વીકારાઈ ગઈ! હવે તમે 'જોડાયેલા' ટેબમાં ચેટ કરી શકો છો.");
        fetchRequests(); 

    } catch (error) {
        console.error(error);
        alert("રિક્વેસ્ટ સ્વીકારવામાં તકલીફ થઈ છે.");
    }
  };

  // ❌ રિક્વેસ્ટ નકારવાનું લોજિક
  const handleReject = async (requestId: number) => {
    if(!confirm("શું તમે ખરેખર આ રિક્વેસ્ટ નકારવા માંગો છો?")) return;
    try {
        await supabase.from('requests').update({ status: 'rejected' }).eq('id', requestId);
        fetchRequests();
    } catch (error) {
        alert("ભૂલ આવી છે.");
    }
  };

  // 💬 ચેટ શરૂ કરવાનું લોજિક (મજબૂત લોજિક - બ્લેન્ક સ્ક્રીન નહીં આવે)
  const handleStartChat = async (otherId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;

    // ૧. પહેલા ચેક કરો કે રૂમ છે કે નહીં
    const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('id')
        .contains('participant_ids', [user.id, otherId])
        .eq('type', 'matrimony')
        .maybeSingle();

    if (existingRoom) {
        navigate(`/private-chat/${existingRoom.id}`);
    } else {
        // ૨. જો કોઈ કારણસર રૂમ નથી, તો નવો બનાવીને જ અંદર મોકલો
        const { data: newRoom, error: createError } = await supabase
            .from('chat_rooms')
            .insert([{ type: 'matrimony', participant_ids: [user.id, otherId] }])
            .select()
            .single();
            
        if(newRoom) {
            navigate(`/private-chat/${newRoom.id}`);
        } else {
            alert("ચેટ કનેક્ટ કરવામાં ભૂલ છે. ફરી પ્રયાસ કરો.");
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-gujarati pb-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-500 p-8 safe-area-top shadow-xl">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/20 rounded-2xl backdrop-blur-md hover:bg-white/40 transition-all active:scale-90">
                    <ArrowLeft className="w-7 h-7 text-white" />
                </button>
                <div>
                    <h1 className="text-white font-bold text-2xl tracking-tight">રિક્વેસ્ટ અને ચેટ</h1>
                    <p className="text-pink-100 text-[10px] uppercase font-bold tracking-widest mt-1">Yogi Samaj Community</p>
                </div>
            </div>
            <div className="bg-white/10 p-3 rounded-full border border-white/20">
                <Heart className="text-white w-6 h-6 animate-pulse" />
            </div>
        </div>
      </div>

      {/* Modern Tabs Section */}
      <div className="flex bg-white shadow-md sticky top-0 z-40">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-5 font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'received' ? 'text-pink-600 border-b-4 border-pink-600 bg-pink-50/20' : 'text-gray-400'
          }`}
        >
          <UserPlus size={20} />
          <span>આવેલી રિક્વેસ્ટ</span>
        </button>
        <button
          onClick={() => setActiveTab('connected')}
          className={`flex-1 py-5 font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'connected' ? 'text-pink-600 border-b-4 border-pink-600 bg-pink-50/20' : 'text-gray-400'
          }`}
        >
          <MessageCircle size={20} />
          <span>જોડાયેલા (Chats)</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-5 py-8">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="animate-spin text-pink-500 w-12 h-12" />
                <p className="text-gray-400 font-bold animate-pulse">માહિતી લોડ થઈ રહી છે...</p>
            </div>
        ) : (
            <AnimatePresence mode="wait">
                {activeTab === 'received' ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[50px] border-2 border-dashed border-gray-200">
                                <Clock className="mx-auto text-gray-300 mb-3" size={50} />
                                <p className="text-gray-500 font-bold">હાલમાં કોઈ નવી રિક્વેસ્ટ નથી.</p>
                            </div>
                        ) : (
                            requests.map((req) => (
                                <motion.div key={req.id} layout className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-5">
                                        <div className="relative">
                                            <img src={req.profile?.image_url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-3xl object-cover bg-gray-50 border-2 border-pink-50 shadow-inner" />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white shadow-sm"></div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg leading-tight">{req.profile?.full_name || 'Member'}</h3>
                                            <p className="text-[11px] text-pink-600 font-black uppercase mt-1.5 bg-pink-50 px-2 py-0.5 rounded-lg w-fit">
                                                {req.profile?.village} | {req.profile?.age} વર્ષ
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1 italic">{req.profile?.peta_atak}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleAccept(req.id, req.sender_id)} className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100 active:scale-90 hover:bg-green-600 transition-all"><Check size={28} /></button>
                                        <button onClick={() => handleReject(req.id)} className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 active:scale-90 hover:bg-red-50 hover:text-red-400 transition-all"><X size={28} /></button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                        {connections.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-[50px] border-2 border-dashed border-gray-200">
                                <MessageCircle className="mx-auto text-gray-300 mb-3" size={50} />
                                <p className="text-gray-500 font-bold">હજુ સુધી કોઈ ચેટ શરૂ થઈ નથી.</p>
                            </div>
                        ) : (
                            connections.map((conn) => (
                                <motion.div key={conn.id} className="bg-white p-6 rounded-[35px] shadow-sm flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center space-x-5">
                                        <img src={conn.profile?.image_url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-3xl object-cover shadow-inner" />
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg">{conn.profile?.full_name}</h3>
                                            <p className="text-[10px] text-green-600 font-black flex items-center uppercase mt-1">
                                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> વાતચીત માટે તૈયાર
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleStartChat(conn.otherId)}
                                        className="px-6 py-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-2xl font-black text-sm flex items-center space-x-2 shadow-2xl shadow-pink-200 active:scale-95 hover:shadow-pink-300 transition-all uppercase tracking-wider"
                                    >
                                        <MessageCircle size={20} />
                                        <span>ચેટ</span>
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        )}
      </div>

      {/* Security Info */}
      <div className="px-10 text-center opacity-40 py-4">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center space-x-2">
            <ShieldCheck size={12} />
            <span>Secure community chat environment</span>
        </p>
      </div>
    </div>
  );
}