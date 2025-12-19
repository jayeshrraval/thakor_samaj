import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Users, MapPin, ChevronRight, Plus, User, Loader2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; // ✅ Supabase Client

// Types Updated based on Supabase
interface Family {
  id: number;
  head_name: string;
  sub_surname: string;
  gol: string;
  village: string;
  district: string;
  total_members: number; // We use a direct count column for performance
}

export default function FamilyListScreen() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVillage, setSearchVillage] = useState('');
  const [searchGol, setSearchGol] = useState('');

  useEffect(() => {
    // Debounce Search (ટાઈપ કર્યાના 500ms પછી જ સર્ચ થશે)
    const delaySearch = setTimeout(() => {
      fetchFamilies();
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, searchVillage, searchGol]);

  const fetchFamilies = async () => {
    try {
      setLoading(true);

      // 🚀 SUPABASE QUERY BUILDER
      let query = supabase
        .from('families')
        .select('*')
        .range(0, 49); // 🔥 Limit to 50 records only (For Speed)

      // Apply Filters if user typed something
      if (searchQuery) {
        // Search in Name OR Sub-Surname
        query = query.or(`head_name.ilike.%${searchQuery}%,sub_surname.ilike.%${searchQuery}%`);
      }
      if (searchVillage) {
        query = query.ilike('village', `%${searchVillage}%`);
      }
      if (searchGol) {
        query = query.ilike('gol', `%${searchGol}%`);
      }

      // Order by latest
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      setFamilies(data || []);

    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-gujarati font-bold text-2xl">
                પરિવાર યાદી
              </h1>
              <p className="text-white/80 text-sm font-gujarati">
                રજીસ્ટર થયેલ પરિવારો
              </p>
            </div>
            {/* Add Button - Navigates to Register Screen (We will make this next) */}
            <button
              onClick={() => navigate('/family-register')}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm active:scale-95 transition-transform"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="મોભીનું નામ અથવા અટક શોધો..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati text-gray-800"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-3 mt-4 overflow-x-auto hide-scrollbar pb-2">
            <input
              type="text"
              value={searchVillage}
              onChange={(e) => setSearchVillage(e.target.value)}
              placeholder="ગામ ફિલ્ટર"
              className="px-4 py-2 bg-white/20 text-white placeholder-white/70 rounded-full text-sm font-gujarati focus:outline-none focus:bg-white/30 min-w-[100px] border border-transparent focus:border-white/50 transition-all"
            />
            <input
              type="text"
              value={searchGol}
              onChange={(e) => setSearchGol(e.target.value)}
              placeholder="ગોળ ફિલ્ટર"
              className="px-4 py-2 bg-white/20 text-white placeholder-white/70 rounded-full text-sm font-gujarati focus:outline-none focus:bg-white/30 min-w-[100px] border border-transparent focus:border-white/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 py-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 font-gujarati">
          {families.length} પરિવારો દેખાઈ રહ્યા છે
        </p>
        {loading && <Loader2 className="w-4 h-4 text-deep-blue animate-spin" />}
      </div>

      {/* Family List */}
      <div className="px-6 space-y-4">
        {loading && families.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 text-mint animate-spin" />
            <p className="text-gray-500 font-gujarati mt-4">ડેટા લાવી રહ્યા છીએ...</p>
          </div>
        ) : families.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-12 text-center border border-gray-100"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-gujarati font-bold text-gray-800 mb-2">
              કોઈ પરિવાર મળ્યો નથી
            </h3>
            <p className="text-sm text-gray-500 font-gujarati mb-6">
              તમારા સર્ચ મુજબ કોઈ ડેટા નથી અથવા હજુ કોઈ એન્ટ્રી નથી.
            </p>
            <button
              onClick={() => navigate('/family-register')}
              className="bg-deep-blue text-white px-6 py-3 rounded-xl font-gujarati font-medium shadow-lg active:scale-95 transition-transform"
            >
              નવો પરિવાર ઉમેરો
            </button>
          </motion.div>
        ) : (
          families.map((family, index) => (
            <motion.button
              key={family.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/family-detail/${family.id}`)} // We will create this detail screen later
              className="w-full premium-card p-5 text-left hover:shadow-lg transition-all active:scale-98 border border-transparent hover:border-mint/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-gujarati font-bold text-gray-800 text-lg mb-1 truncate">
                      {family.head_name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {family.sub_surname && (
                        <span className="px-2.5 py-1 bg-deep-blue/10 text-deep-blue text-xs font-bold font-gujarati rounded-md">
                          {family.sub_surname}
                        </span>
                      )}
                      {family.gol && (
                        <span className="px-2.5 py-1 bg-royal-gold/10 text-royal-gold text-xs font-bold font-gujarati rounded-md">
                          {family.gol}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 font-gujarati">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {family.village || 'ગામ નથી નાખ્યું'}
                      {family.district && `, ${family.district}`}
                    </div>
                    
                    <div className="flex items-center text-sm text-mint mt-2 font-gujarati font-medium">
                      <Users className="w-3.5 h-3.5 mr-1" />
                      કુલ સભ્યો: {family.total_members || 1}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-4" />
              </div>
            </motion.button>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => navigate('/family-register')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-deep-blue to-[#1A8FA3] rounded-full shadow-xl flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
      </motion.button>

      <BottomNav />
    </div>
  );
}