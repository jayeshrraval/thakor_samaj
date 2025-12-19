import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, Phone, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function PrivateChatScreen() {
  const { roomId } = useParams(); // URL માંથી Room ID મળશે
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // સામેવાળાની વિગત
  const [otherUser, setOtherUser] = useState<{ name: string; image: string } | null>(null);
  
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (roomId) {
      fetchChatDetails();
      
      // 🔴 Realtime Listener for THIS specific room
      const channel = supabase
        .channel(`room:${roomId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
            setTimeout(scrollToBottom, 100);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [roomId]);

  const fetchChatDetails = async () => {
    try {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUserId(user.id);

      // 2. Find who is the "Other Person" in this room
      const { data: roomData } = await supabase
        .from('chat_rooms')
        .select('participant_ids')
        .eq('id', roomId)
        .single();

      if (roomData) {
        // Find ID that is NOT mine
        const otherId = roomData.participant_ids.find((id: string) => id !== user.id);
        
        if (otherId) {
          // Fetch their Name & Photo from Matrimony Profile
          const { data: profile } = await supabase
            .from('matrimony_profiles')
            .select('full_name, image_url')
            .eq('user_id', otherId)
            .single();
          
          if (profile) {
            setOtherUser({
              name: profile.full_name,
              image: profile.image_url || 'https://via.placeholder.com/100'
            });
          } else {
             // Fallback if no profile found
             setOtherUser({ name: 'Unknown User', image: 'https://via.placeholder.com/100' });
          }
        }
      }

      // 3. Fetch Old Messages
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (msgs) {
        setMessages(msgs);
        setTimeout(scrollToBottom, 500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !roomId) return;

    const msgToSend = newMessage;
    setNewMessage(''); // Clear input

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          room_id: roomId,
          sender_id: currentUserId,
          content: msgToSend
        }
      ]);

    if (error) {
      alert('મેસેજ મોકલવામાં નિષ્ફળ.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5DDD5] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-3 safe-area-top sticky top-0 z-10 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            
            {loading ? (
                <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse"></div>
            ) : (
                <img 
                  src={otherUser?.image} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  alt="User"
                />
            )}
            
            <div>
              <h1 className="text-white font-bold font-gujarati text-lg leading-tight">
                {otherUser?.name || 'Loading...'}
              </h1>
              <p className="text-white/80 text-xs font-gujarati flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                ઓનલાઇન
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4 text-white/90">
            <Phone className="w-5 h-5" />
            <MoreVertical className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-10">
        {loading ? (
          <div className="flex justify-center pt-10">
            <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative text-sm font-gujarati ${
                    isMe 
                      ? 'bg-[#DCF8C6] text-gray-800 rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                  <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-green-800/60' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white safe-area-bottom flex items-center space-x-2 shadow-lg">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="મેસેજ લખો..."
          className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 focus:ring-2 focus:ring-pink-500/20 outline-none font-gujarati"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 active:scale-90 transition-transform shadow-md"
        >
          <Send className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}