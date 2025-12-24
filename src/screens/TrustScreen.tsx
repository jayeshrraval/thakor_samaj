import React, { useState, useEffect } from 'react';
import { Calendar, Users, Heart, PartyPopper, MessageSquare, Send, Loader2, MapPin, X, User, Phone, Upload, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; 

// TypeScript Interfaces (ડેટા ના પ્રકાર નક્કી કર્યા)
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
  const [regLoading, setRegLoading] = useState(false);

  // ✅ નવું: રજીસ્ટ્રેશન ફોર્મ અને અપલોડ માટેના સ્ટેટ્સ
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TrustEvent | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    sub_surname: '',
    village: '',
    taluko: '',
    district: '',
    gol: '',
    school_college: '',
    percentage: '',
    passing_year: '',
    marksheet_url: '',
    mobile: ''
  });

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

  // ✅ માર્કશીટ અપલોડ કરવાનું પાવરફુલ લોજિક
  const handleFileUpload = async (e: any) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `marksheets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trust-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('trust-documents').getPublicUrl(filePath);
      setFormData({ ...formData, marksheet_url: data.publicUrl });
      alert("✅ માર્કશીટ અપલોડ થઈ ગઈ!");
    } catch (error: any) {
      alert("Upload Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // ✅ રજીસ્ટ્રેશન સબમિટ કરવાનું લોજિક
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.marksheet_url) return alert("કૃપા કરીને માર્કશીટનો ફોટો અપલોડ કરો.");
    
    setRegLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return alert("રજીસ્ટ્રેશન કરવા માટે લોગીન જરૂરી છે.");

        const { error: regError } = await supabase.from('trust_registrations').insert([
            {
                user_id: user.id,
                full_name: formData.full_name,
                sub_surname: formData.sub_surname,
                village: formData.village,
                taluko: formData.taluko,
                district: formData.district,
                gol: formData.gol,
                school_college: formData.school_college,
                percentage: formData.percentage,
                passing_year: formData.passing_year,
                marksheet_url: formData.marksheet_url,
                mobile: fromData.mobile,
                event_type: selectedEvent?.title,
                status: 'Pending'
            }
        ]);

        if (regError) throw regError;

        if (selectedEvent) {
            await supabase
                .from('trust_events')
                .update({ attendees_count: (selectedEvent.attendees_count || 0) + 1 })
                .eq('id', selectedEvent.id);
        }
        
        alert(`સફળતાપૂર્વક રજીસ્ટ્રેશન થઈ ગયું છે! 🙏`);
        setShowRegModal(false);
        setFormData({ full_name: '', sub_surname: '', village: '', taluko: '', district: '', gol: '', school_college: '', percentage: '', passing_year: '', marksheet_url: '', mobile: '' });
        fetchEvents();
    } catch (error: any) {
        alert('Error: ' + error.message);
    } finally {
        setRegLoading(false);
    }
  };

  const handleSuggestionSubmit = async () => {
    if (!suggestion.trim()) return alert("કૃપા કરીને કંઈક લખો.");
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("પ્લીઝ લોગીન કરો.");
      const { error } = await supabase.from('trust_suggestions').insert([{ user_id: user.id, message: suggestion }]);
      if (error) throw error;
      alert("તમારું સૂચન મોકલાઈ ગયું છે! આભાર. 🙏");
      setSuggestion('');
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 pt-12 px-6 py-6 rounded-b-[2rem] shadow-lg">
        <h1 className="text-white font-bold text-2xl">યોગી સમાજ ટ્રસ્ટ</h1>
        <p className="text-white/80 text-sm">સમાજ સેવા અને વિકાસ</p>
      </div>

      <div className="px-6 -mt-8 space-y-6">
        {/* Trust Balance Card */}
        <div className="p-8 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white overflow-hidden relative shadow-xl rounded-2xl border border-white/20">
            <p className="text-white/80 text-sm mb-2 font-medium">Trust Balance</p>
            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">₹0</h2>
            <p className="text-white/90 text-sm bg-black/10 inline-block px-3 py-1 rounded-full backdrop-blur-sm">સમાજ વિકાસ ફંડ</p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-3 shadow-md`}>
                  <section.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-700 text-sm">{section.title}</h3>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-lg px-2 border-l-4 border-emerald-500 pl-3">આગામી કાર્યક્રમો</h3>
          {loadingEvents ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
          ) : events.map((event) => (
            <div key={event.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Event</span>
                    <h4 className="font-bold text-gray-800 text-lg mt-1">{event.title}</h4>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg text-center min-w-[60px]">
                      <span className="block text-xs text-gray-400 font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="block text-xl font-bold text-emerald-600">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">{event.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1"><Users size={14}/> {event.attendees_count} જોડાયા</div>
                    <div className="flex items-center gap-1"><MapPin size={14}/> {event.location}</div>
                </div>
                <button onClick={() => { setSelectedEvent(event); setShowRegModal(true); }} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">નામ નોંધાવો (Register)</button>
            </div>
          ))}
        </div>

        {/* Suggestion Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><MessageSquare className="text-blue-600" /> સમાજના યુવાનોનું મંતવ્ય</h3>
          <textarea value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="તમારા વિચારો લખો..." rows={3} className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-700" />
          <button onClick={handleSuggestionSubmit} disabled={submitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} <span>મોકલો</span>
          </button>
        </div>
      </div>

      {/* ✅ નવું: વિદ્યાર્થી સન્માન રજીસ્ટ્રેશન ફોર્મ (Modal) */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative my-8"
            >
              <button onClick={() => setShowRegModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500"><X size={20}/></button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">વિદ્યાર્થી રજીસ્ટ્રેશન</h2>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <input required placeholder="વિદ્યાર્થીનું પૂરું નામ" className="w-full p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-emerald-500" 
                value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}/>
                
                <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="પેટા અટક" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-emerald-500"
                    value={formData.sub_surname} onChange={e => setFormData({...formData, sub_surname: e.target.value})}/>
                    <input required placeholder="ગોળ" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-emerald-500"
                    value={formData.gol} onChange={e => setFormData({...formData, gol: e.target.value})}/>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <input required placeholder="ગામ" className="p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})}/>
                    <input required placeholder="તાલુકો" className="p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500" value={formData.taluko} onChange={e => setFormData({...formData, taluko: e.target.value})}/>
                    <input required placeholder="જિલ્લો" className="p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-emerald-500" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}/>
                </div>

                <input required placeholder="સ્કૂલ/કોલેજ નું નામ" className="w-full p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-emerald-500"
                value={formData.school_college} onChange={e => setFormData({...formData, school_college: e.target.value})}/>

                <div className="grid grid-cols-2 gap-3">
                    <input required type="number" step="0.01" placeholder="ટકાવારી (%)" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-emerald-500"
                    value={formData.percentage} onChange={e => setFormData({...formData, percentage: e.target.value})}/>
                    <input required placeholder="પાસીઈંગ યર" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-emerald-500"
                    value={formData.passing_year} onChange={e => setFormData({...formData, passing_year: e.target.value})}/>
                </div>

                {/* માર્કશીટ અપલોડ */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center bg-gray-50">
                    <input type="file" id="marksheet" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    <label htmlFor="marksheet" className="cursor-pointer flex flex-col items-center gap-2">
                        {uploading ? <Loader2 className="animate-spin text-emerald-500" /> : (
                            formData.marksheet_url ? <img src={formData.marksheet_url} className="h-24 rounded shadow" /> : 
                            <><Upload className="text-gray-400" /> <span className="text-sm text-gray-500 font-medium">માર્કશીટનો ફોટો અપલોડ કરો</span></>
                        )}
                    </label>
                </div>

                <button disabled={regLoading || uploading} type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg flex justify-center items-center gap-2 active:scale-95 transition-all">
                    {regLoading ? <Loader2 className="animate-spin"/> : <Send size={20}/>} સબમિટ કરો
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}