import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Users, MapPin, ChevronRight, ArrowLeft, 
  Loader2, UserPlus, Trash2, Edit2, Phone 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import BottomNav from '../components/BottomNav';

const PAGE_SIZE = 20; // ✅ એક વખતમાં ૨૦ રેકોર્ડ આવશે

export default function FamilyListScreen() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMobile, setUserMobile] = useState(null);
  
  // ✅ નવા ઉમેરેલા State (Pagination માટે)
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        let mobile = user.phone || user.user_metadata?.mobile_number || '';
        mobile = mobile.replace(/[^0-9]/g, '').slice(-10);
        setUserMobile(mobile);
      }
      fetchFamilies(0); // ✅ શરૂઆતમાં પહેલું પેજ (0) મંગાવો
    };
    init();

    // ✅ સ્ક્રોલ લિસનર (જ્યારે યુઝર નીચે પહોંચે ત્યારે નવો ડેટા લાવે)
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ સ્ક્રોલ થાય ત્યારે આ ફંક્શન ચાલે
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight ||
      loading
    ) {
      // જો યુઝર છેક નીચે પહોંચી જાય તો જ નવો ડેટા મંગાવો
      // અહીં આપણે ચેક કરીશું કે હજુ ડેટા લાવવાનો બાકી છે કે નહિ
    }
  };

  // ✅ Infinite Scroll માટે useEffect જે page બદલાય ત્યારે કોલ કરે
  useEffect(() => {
    if (page > 0) {
      fetchFamilies(page);
    }
  }, [page]);

  // ✅ સ્ક્રીન નીચે અડે ત્યારે પેજ નંબર વધારવાનું લોજીક
  const onScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore && !isFetchingMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasMore, isFetchingMore]);


  const fetchFamilies = async (pageNumber) => {
    try {
      if (pageNumber === 0) setLoading(true);
      else setIsFetchingMore(true);

      // ✅ ગણિત: ક્યાંથી ક્યાં સુધીનો ડેટા લાવવો
      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('families')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to); // ✅ સુપાબેઝને કહીએ છીએ કે ટુકડામાં ડેટા આપ

      if (error) throw error;

      // ડેટા ખલાસ થઈ ગયો હોય તો બંધ કરો
      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      const grouped = data.reduce((acc, curr) => {
        const key = `${curr.head_name}-${curr.village}`;
        if (!acc[key]) {
          acc[key] = {
            id: curr.id,
            head_name: curr.head_name,
            sub_surname: curr.sub_surname,
            village: curr.village,
            district: curr.district,
            mobile_number: curr.mobile_number,
            members: []
          };
        }
        acc[key].members.push(curr);
        return acc;
      }, {});

      const newFamilies = Object.values(grouped);

      // ✅ જો પહેલું પેજ હોય તો રિપ્લેસ કરો, નહીંતર જૂનામાં નવું ઉમેરો (Append)
      if (pageNumber === 0) {
        setFamilies(newFamilies);
      } else {
        setFamilies((prev) => [...prev, ...newFamilies]);
      }

    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const removeMember = async (memberId) => {
    if (window.confirm("શું તમે આ સભ્યને યાદીમાંથી કાઢવા માંગો છો?")) {
      const { error } = await supabase.from('families').delete().eq('id', memberId);
      if (error) alert(error.message);
      else {
        // ડિલીટ કર્યા પછી લિસ્ટ રિફ્રેશ કરવા માટે (અત્યારે સાદી રીતે પેજ 0 લાવીએ)
        setPage(0);
        fetchFamilies(0); 
      }
    }
  };

  const filteredFamilies = families.filter(f => 
    f.head_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-gujarati">
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate('/')} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-white font-bold text-2xl">પરિવાર લિસ્ટ</h1>
            </div>
            <button 
              onClick={() => navigate('/family-registration')}
              className="bg-mint text-deep-blue p-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg active:scale-95 transition-all"
            >
              <UserPlus size={18} /> ઉમેરો
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="પરિવાર અથવા ગામ શોધો..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur-sm border-none rounded-2xl py-4 pl-12 pr-4 shadow-xl outline-none font-gujarati"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {loading && page === 0 ? (
          <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-deep-blue" /></div>
        ) : filteredFamilies.length === 0 ? (
          <div className="text-center py-20"><Users className="w-16 h-16 text-gray-200 mx-auto mb-4" /><p className="text-gray-500 font-bold">કોઈ માહિતી મળી નથી</p></div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredFamilies.map((family, index) => {
                const isMyFamily = family.members.some(m => 
                  m.member_mobile === userMobile || m.mobile_number === userMobile
                );

                // કી યુનિક રાખવા માટે index નો ઉપયોગ (જો કદાચ ડુપ્લીકેટ આવે તો એરર ના આવે)
                return (
                  <motion.div
                    key={`${family.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-5 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{family.head_name}</h3>
                        <div className="flex items-center text-gray-500 text-xs gap-1 mt-1">
                          <MapPin size={12} className="text-orange-500" />
                          <span>{family.village}, {family.district}</span>
                        </div>
                        <div className="flex items-center text-deep-blue text-xs gap-1 mt-1.5 font-bold">
                          <Phone size={12} />
                          <span>{family.mobile_number || 'નંબર નથી'}</span>
                        </div>
                      </div>
                      <span className="bg-deep-blue/10 text-deep-blue px-3 py-1 rounded-full text-xs font-bold">
                        {family.members.length} સભ્યો
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      {family.members.map((m) => (
                        <div key={m.id} className="flex justify-between items-center bg-white border border-gray-50 p-3 rounded-xl shadow-sm">
                          <div>
                            <p className="font-bold text-gray-700 text-sm">{m.member_name}</p>
                            <p className="text-[10px] text-gray-400">{m.relationship} | {m.gender}</p>
                          </div>
                          
                          {isMyFamily && (
                            <div className="flex gap-2">
                              <button onClick={() => removeMember(m.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                              <button onClick={() => navigate(`/family-registration`)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* ✅ નીચે ડેટા લોડ થાય ત્યારે લોડર બતાવવા માટે */}
            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}