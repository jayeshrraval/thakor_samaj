import React, { useState, useEffect } from 'react';
import { Calendar, Users, Heart, PartyPopper, MessageSquare, Send, Loader2, MapPin, X, User, Phone, Upload, GraduationCap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; 

export default function TrustScreen() {
  const [events, setEvents] = useState([]);
  const [suggestion, setSuggestion] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // ✅ ફંડના આંકડા માટેનું સ્ટેટ
  const [fundStats, setFundStats] = useState({
    total_fund: '...',
    total_donors: '...',
    upcoming_events: '...'
  });

  // ✅ રજીસ્ટ્રેશન ફોર્મ અને અપલોડ માટેના સ્ટેટ્સ
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
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

  // ✅ Royal Theme Colors for Grid
  const sections = [
    { icon: Calendar, title: 'સંમેલન', color: 'from-[#800000] to-[#A00000]' }, // Maroon
    { icon: Users, title: 'સમૂહ લગ્ન', color: 'from-rose-500 to-pink-600' }, // Rose (Wedding)
    { icon: Heart, title: 'સેવાકાર્ય', color: 'from-[#D4AF37] to-[#B8860B]' }, // Gold (Seva)
    { icon: PartyPopper, title: 'ઈવેન્ટ્સ', color: 'from-blue-600 to-indigo-700' }, // Royal Blue
  ];

  useEffect(() => {
    fetchEvents();
    fetchFundStats(); 
  }, []);

  const fetchFundStats = async () => {
    try {
      const { data, error } = await supabase
        .from('fund_stats')
        .select('*')
        .single();

      if (data) {
        setFundStats({
          total_fund: data.total_fund,
          total_donors: data.total_donors,
          upcoming_events: data.upcoming_events
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

  const handleFileUpload = async (e) => {
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
    } catch (error) {
      alert("Upload Error: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.marksheet_url) return alert("કૃપા કરીને માર્કશીટનો ફોટો અપલોડ કરો.");
    if (formData.mobile.length < 10) return alert("કૃપા કરીને સાચો મોબાઈલ નંબર નાખો.");
     
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
                mobile: formData.mobile,
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
    } catch (error) {
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
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* ✅ Header: Maroon with Gold Glow */}
      <div className="bg-[#800000] pt-12 px-6 pb-20 rounded-b-[2.5rem] shadow-lg relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        
        <h1 className="text-white font-bold text-2xl font-gujarati relative z-10">ઠાકોર સમાજ ટ્રસ્ટ</h1>
        <p className="text-[#D4AF37] text-sm font-gujarati relative z-10">સમાજ સેવા અને વિકાસ</p>
      </div>

      {/* ✅ Fund Box */}
      <div className="px-6 -mt-12 relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="bg-white rounded-3xl shadow-lg p-5 border border-[#D4AF37]/20"
        >
          {/* Box Header */}
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h2 className="text-gray-800 font-bold font-gujarati flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#D4AF37] fill-current" />
              સમાજ વિકાસ ફંડ
            </h2>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-100">
            {/* Fund */}
            <div className="px-1">
              <p className="text-[#800000] font-black text-lg font-gujarati">{fundStats.total_fund}</p>
              <p className="text-gray-400 text-[10px] font-gujarati mt-1">કુલ ફંડ</p>
            </div>

            {/* Donors */}
            <div className="px-1">
              <p className="text-[#D4AF37] font-black text-lg font-gujarati">{fundStats.total_donors}</p>
              <p className="text-gray-400 text-[10px] font-gujarati mt-1">દાતાઓ</p>
            </div>

            {/* Events */}
            <div className="px-1">
              <p className="text-blue-800 font-black text-lg font-gujarati">{fundStats.upcoming_events}</p>
              <p className="text-gray-400 text-[10px] font-gujarati mt-1">કાર્યક્રમો</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        
        {/* Section Cards */}
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-3 shadow-md`}>
                  <section.icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-gray-700 text-sm font-gujarati">{section.title}</h3>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800 text-lg px-2 border-l-4 border-[#800000] pl-3 font-gujarati">આગામી કાર્યક્રમો</h3>
          {loadingEvents ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-[#800000] animate-spin" /></div>
          ) : events.map((event) => (
            <div key={event.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-[#800000]/10 text-[#800000] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Event</span>
                    <h4 className="font-bold text-gray-800 text-lg mt-1 font-gujarati">{event.title}</h4>
                  </div>
                  <div className="bg-[#D4AF37]/10 p-2 rounded-lg text-center min-w-[60px] border border-[#D4AF37]/20">
                      <span className="block text-xs text-[#B8860B] font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="block text-xl font-bold text-[#800000]">{new Date(event.date).getDate()}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl font-gujarati">{event.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 font-gujarati">
                    <div className="flex items-center gap-1"><Users size={14}/> {event.attendees_count} જોડાયા</div>
                    <div className="flex items-center gap-1"><MapPin size={14}/> {event.location}</div>
                </div>
                {/* Gold Gradient Button */}
                <button onClick={() => { setSelectedEvent(event); setShowRegModal(true); }} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-all font-gujarati">નામ નોંધાવો (Register)</button>
            </div>
          ))}
        </div>

        {/* Suggestion Box */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 font-gujarati"><MessageSquare className="text-[#800000]" /> સમાજના યુવાનોનું મંતવ્ય</h3>
          <textarea 
            value={suggestion} 
            onChange={(e) => setSuggestion(e.target.value)} 
            placeholder="તમારા વિચારો લખો..." 
            rows={3} 
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-[#D4AF37] text-gray-700 font-gujarati outline-none" 
          />
          <button onClick={handleSuggestionSubmit} disabled={submitting} className="w-full bg-[#800000] text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-lg font-gujarati active:scale-95 transition-all">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />} <span>મોકલો</span>
          </button>
        </div>
      </div>

      {/* ✅ વિદ્યાર્થી સન્માન રજીસ્ટ્રેશન ફોર્મ (Modal) */}
      <AnimatePresence>
        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative my-8"
            >
              <button onClick={() => setShowRegModal(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button>
              <h2 className="text-2xl font-bold text-[#800000] mb-6 text-center font-gujarati">વિદ્યાર્થી રજીસ્ટ્રેશન</h2>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 font-gujarati">
                <input required placeholder="વિદ્યાર્થીનું પૂરું નામ" className="w-full p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none" 
                value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})}/>
                
                <div className="grid grid-cols-2 gap-3">
                    <input required placeholder="પેટા અટક" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    value={formData.sub_surname} onChange={e => setFormData({...formData, sub_surname: e.target.value})}/>
                    <input required placeholder="ગોળ" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    value={formData.gol} onChange={e => setFormData({...formData, gol: e.target.value})}/>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <input required placeholder="ગામ" className="p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})}/>
                    <input required placeholder="તાલુકો" className="p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none" value={formData.taluko} onChange={e => setFormData({...formData, taluko: e.target.value})}/>
                    <input required placeholder="જિલ્લો" className="p-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}/>
                </div>

                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-4 text-gray-400" />
                  <input required type="tel" maxLength={10} placeholder="મોબાઈલ નંબર" className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                  value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}/>
                </div>

                <input required placeholder="સ્કૂલ/કોલેજ નું નામ" className="w-full p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                value={formData.school_college} onChange={e => setFormData({...formData, school_college: e.target.value})}/>

                <div className="grid grid-cols-2 gap-3">
                    <input required type="number" step="0.01" placeholder="ટકાવારી (%)" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    value={formData.percentage} onChange={e => setFormData({...formData, percentage: e.target.value})}/>
                    <input required placeholder="પાસીઈંગ યર" className="p-4 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                    value={formData.passing_year} onChange={e => setFormData({...formData, passing_year: e.target.value})}/>
                </div>

                <div className="border-2 border-dashed border-[#D4AF37] rounded-2xl p-4 text-center bg-gray-50 hover:bg-[#D4AF37]/5 transition-colors">
                    <input type="file" id="marksheet" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    <label htmlFor="marksheet" className="cursor-pointer flex flex-col items-center gap-2">
                        {uploading ? <Loader2 className="animate-spin text-[#800000]" /> : (
                            formData.marksheet_url ? <img src={formData.marksheet_url} className="h-24 rounded shadow" /> : 
                            <><Upload className="text-[#800000]" /> <span className="text-sm text-gray-500 font-medium">માર્કશીટનો ફોટો અપલોડ કરો</span></>
                        )}
                    </label>
                </div>

                <button disabled={regLoading || uploading} type="submit" className="w-full bg-[#800000] text-white font-bold py-4 rounded-2xl shadow-lg flex justify-center items-center gap-2 active:scale-95 transition-all">
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