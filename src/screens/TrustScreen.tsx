import React, { useState, useEffect } from 'react';
import { Calendar, Users, Heart, PartyPopper, MessageSquare, Send, Loader2, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; 

// TypeScript Interfaces
interface TrustEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees_count: number;
}

interface UserProfile {
  full_name: string;
  mobile: string;
  village: string;
}

export default function TrustScreen() {
  const [events, setEvents] = useState<TrustEvent[]>([]);
  const [suggestion, setSuggestion] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [regLoading, setRegLoading] = useState<string | null>(null);

  const sections = [
    { icon: Calendar, title: 'સંમેલન', color: 'from-blue-400 to-cyan-500' },
    { icon: Users, title: 'સમૂહ લગ્ન', color: 'from-pink-400 to-rose-500' },
    { icon: Heart, title: 'સેવાકાર્ય', color: 'from-green-400 to-emerald-500' },
    { icon: PartyPopper, title: 'ઈવેન્ટ્સ', color: 'from-purple-400 to-indigo-500' },
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('trust_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  // --- Suggestion Submit ---
  const handleSuggestionSubmit = async () => {
    if (!suggestion.trim()) return alert("કૃપા કરીને તમારું સૂચન લખો.");
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("કૃપા કરીને લોગીન કરો.");

      const { error } = await supabase
        .from('trust_suggestions')
        .insert([{ user_id: user.id, message: suggestion }]);

      if (error) throw error;

      alert("તમારું સૂચન સફળતાપૂર્વક મોકલાઈ ગયું છે! આભાર. 🙏");
      setSuggestion('');
    } catch (error: any) {
      alert("ભૂલ આવી: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Register for Event ---
  const handleRegister = async (event: TrustEvent) => {
    try {
        setRegLoading(event.id);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("રજીસ્ટ્રેશન કરવા માટે લોગીન કરવું જરૂરી છે.");
            return;
        }

        // ✅ સુધારો: 'profiles' ને બદલે 'users' ટેબલ વાપર્યું છે
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('full_name, mobile, village')
            .eq('id', user.id)
            .single();

        if (userError || !userData) {
            alert("તમારી પ્રોફાઇલ વિગત મળી નથી. કૃપા કરીને પહેલા તમારી પ્રોફાઇલ પૂર્ણ કરો.");
            return;
        }

        // --- Insert into 'trust_registrations' ---
        const { error: regError } = await supabase.from('trust_registrations').insert([
            {
                user_id: user.id,
                full_name: userData.full_name,
                mobile: userData.mobile,
                village: userData.village,
                event_type: event.title,
                details: `ઈવેન્ટ માટે રજીસ્ટ્રેશન: ${event.title}`,
                status: 'Pending'
            }
        ]);

        if (regError) throw regError;

        // --- Update Attendee Count ---
        await supabase
            .from('trust_events')
            .update({ attendees_count: (event.attendees_count || 0) + 1 })
            .eq('id', event.id);
            
        fetchEvents(); 

        alert(`સફળતાપૂર્વક નામ નોંધાઈ ગયું છે! ટ્રસ્ટના સભ્યો તમારો સંપર્ક કરશે. 🙏`);

    } catch (error: any) {
        alert('ભૂલ આવી: ' + error.message);
    } finally {
        setRegLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-gujarati">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 pt-12 px-6 py-6 rounded-b-[2rem] shadow-lg">
        <h1 className="text-white font-bold text-2xl">યોગી સમાજ ટ્રસ્ટ</h1>
        <p className="text-white/80 text-sm">સમાજ સેવા અને સર્વાંગી વિકાસ</p>
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* Trust Balance Card - ✅ Fund Set to 0 */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="p-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white overflow-hidden relative shadow-xl rounded-2xl border border-white/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-2 font-medium">ટ્રસ્ટ બેલેન્સ (Balance)</p>
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">₹0</h2>
            <p className="text-white/90 text-sm bg-black/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">સમાજ વિકાસ ફંડ</p>
          </div>
        </motion.div>

        {/* Section Cards */}
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.button 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }} 
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 flex flex-col items-center justify-center border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-3 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-700 text-sm">{section.title}</h3>
              </motion.button>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-lg px-2 border-l-4 border-emerald-500 pl-3">આગામી કાર્યક્રમો</h3>
          
          {loadingEvents ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-400">હાલમાં કોઈ નવા કાર્યક્રમ ઉપલબ્ધ નથી.</p>
            </div>
          ) : (
            events.map((event, index) => (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: index * 0.1 }} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">કાર્યક્રમ</span>
                    <h4 className="font-bold text-gray-800 text-lg mt-1">{event.title}</h4>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg text-center min-w-[60px] border border-emerald-100">
                      <span className="block text-xs text-emerald-400 font-bold uppercase">{new Date(event.date).toLocaleString('gu-IN', { month: 'short' })}</span>
                      <span className="block text-xl font-bold text-emerald-600">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1 font-bold"><Users size={14} className="text-emerald-500"/> {event.attendees_count} લોકો જોડાયા</div>
                    <div className="flex items-center gap-1 font-bold"><MapPin size={14} className="text-emerald-500"/> {event.location}</div>
                </div>

                <button 
                  onClick={() => handleRegister(event)}
                  disabled={regLoading === event.id}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex justify-center items-center gap-2 shadow-lg active:scale-95"
                >
                  {regLoading === event.id ? <Loader2 className="animate-spin w-5 h-5"/> : 'નામ નોંધાવો (Register)'}
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Youth Opinion Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800">સમાજના યુવાનોનું મંતવ્ય</h3>
          </div>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="તમારા વિચારો અને સૂચનો અહીં લખો..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none text-gray-700 placeholder-gray-400"
          />
          <button 
            onClick={handleSuggestionSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all disabled:opacity-70 shadow-lg active:scale-95"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            <span>મોકલો (Submit)</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}