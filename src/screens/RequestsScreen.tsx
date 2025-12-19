import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MessageCircle, User, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function RequestsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'received' | 'connected'>('received');
  const [requests, setRequests] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (activeTab === 'received') {
        // 1. Fetch Pending Requests where I am the receiver
        const { data: reqs, error } = await supabase
          .from('requests')
          .select('*, sender:sender_id(*)') // Join logic might vary based on your FK setup
          .eq('receiver_id', user.id)
          .eq('status', 'pending');
        
        if (error) throw error;

        // If simple join doesn't work, we manually fetch profiles
        // (Safe fallback method)
        if (reqs && reqs.length > 0) {
            const senderIds = reqs.map(r => r.sender_id);
            const { data: profiles } = await supabase
                .from('matrimony_profiles')
                .select('user_id, full_name, image_url, village, age')
                .in('user_id', senderIds);
            
            // Merge profile data with request data
            const merged = reqs.map(r => ({
                ...r,
                profile: profiles?.find(p => p.user_id === r.sender_id)
            }));
            setRequests(merged);
        } else {
            setRequests([]);
        }

      } else {
        // 2. Fetch Accepted Requests (Where I am sender OR receiver)
        const { data: conns, error } = await supabase
          .from('requests')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted');

        if (error) throw error;

        if (conns && conns.length > 0) {
            // Find ID of the "Other" person
            const otherIds = conns.map(c => c.sender_id === user.id ? c.receiver_id : c.sender_id);
            
            const { data: profiles } = await supabase
                .from('matrimony_profiles')
                .select('user_id, full_name, image_url, village')
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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ACCEPT REQUEST LOGIC
  const handleAccept = async (requestId: number, senderId: string) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if(!user) return;

        // 1. Update Request Status
        await supabase
            .from('requests')
            .update({ status: 'accepted' })
            .eq('id', requestId);

        // 2. Create a Chat Room for these two
        // Check if room already exists first to avoid duplicates
        // (For simplicity, we just insert. You can add a check logic later)
        const { error: roomError } = await supabase
            .from('chat_rooms')
            .insert([{
                type: 'matrimony',
                participant_ids: [user.id, senderId] // Array of both IDs
            }]);

        if (roomError) console.error('Room creation error', roomError);

        alert("રિક્વેસ્ટ સ્વીકારાઈ ગઈ! હવે તમે ચેટ કરી શકો છો.");
        fetchRequests(); // Refresh list

    } catch (error) {
        console.error(error);
        alert("ભૂલ આવી છે.");
    }
  };

  // ❌ REJECT REQUEST
  const handleReject = async (requestId: number) => {
    if(!confirm("શું તમે ખરેખર રિક્વેસ્ટ નકારવા માંગો છો?")) return;
    
    await supabase.from('requests').update({ status: 'rejected' }).eq('id', requestId);
    fetchRequests();
  };

  // 💬 START CHAT
  const handleStartChat = async (otherId: string) => {
    // Find the room ID for these two users
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;

    // Supabase query to find room containing both IDs
    const { data } = await supabase
        .from('chat_rooms')
        .select('id')
        .contains('participant_ids', [user.id, otherId])
        .eq('type', 'matrimony')
        .single();

    if (data) {
        // Navigate to Private Chat Screen (We need to build this next)
        navigate(`/private-chat/${data.id}`);
    } else {
        alert("ચેટ રૂમ મળ્યો નથી. કૃપા કરીને રિફ્રેશ કરો.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 safe-area-top">
        <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-1 bg-white/20 rounded-full">
                <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-white font-gujarati font-bold text-xl">રિક્વેસ્ટ અને ચેટ</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm mb-4">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 py-4 font-gujarati font-bold text-center ${
            activeTab === 'received' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'
          }`}
        >
          આવેલી રિક્વેસ્ટ
        </button>
        <button
          onClick={() => setActiveTab('connected')}
          className={`flex-1 py-4 font-gujarati font-bold text-center ${
            activeTab === 'connected' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'
          }`}
        >
          જોડાયેલા (Chats)
        </button>
      </div>

      <div className="px-4 pb-20">
        {loading ? (
            <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-pink-500" />
            </div>
        ) : (
            <>
                {/* RECEIVED REQUESTS LIST */}
                {activeTab === 'received' && (
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <p className="text-center text-gray-500 mt-10 font-gujarati">કોઈ નવી રિક્વેસ્ટ નથી.</p>
                        ) : (
                            requests.map((req) => (
                                <motion.div 
                                    key={req.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src={req.profile?.image_url || 'https://via.placeholder.com/100'} 
                                            className="w-12 h-12 rounded-full object-cover bg-gray-200"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-800 font-gujarati">
                                                {req.profile?.full_name || 'Unknown User'}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-gujarati">
                                                {req.profile?.village || 'Village'}, {req.profile?.age} વર્ષ
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleAccept(req.id, req.sender_id)}
                                            className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 hover:bg-green-200"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleReject(req.id)}
                                            className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-200"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* CONNECTED / CHATS LIST */}
                {activeTab === 'connected' && (
                    <div className="space-y-3">
                        {connections.length === 0 ? (
                            <p className="text-center text-gray-500 mt-10 font-gujarati">હજુ સુધી કોઈની સાથે જોડાયા નથી.</p>
                        ) : (
                            connections.map((conn) => (
                                <motion.div 
                                    key={conn.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img 
                                            src={conn.profile?.image_url || 'https://via.placeholder.com/100'} 
                                            className="w-12 h-12 rounded-full object-cover bg-gray-200"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-800 font-gujarati">
                                                {conn.profile?.full_name || 'User'}
                                            </h3>
                                            <p className="text-xs text-green-600 font-gujarati flex items-center">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Connected
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleStartChat(conn.otherId)}
                                        className="px-4 py-2 bg-pink-500 text-white rounded-xl font-gujarati text-sm flex items-center space-x-2 shadow-lg shadow-pink-200"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span>Chat</span>
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}