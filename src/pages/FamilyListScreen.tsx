import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Users, MapPin, ChevronRight, Plus, User } from 'lucide-react';
import BottomNav from '../components/BottomNav';

interface FamilyMember {
  id: number;
  member_name: string;
  relationship: string;
  gender: string;
}

interface Family {
  id: number;
  head_name: string;
  sub_surname: string;
  gol: string;
  village: string;
  taluko: string;
  district: string;
  current_residence: string;
  members: FamilyMember[];
  created_at: string;
}

export default function FamilyListScreen() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVillage, setSearchVillage] = useState('');
  const [searchGol, setSearchGol] = useState('');

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      const response = await fetch('https://backend.youware.com/api/families');
      const data = await response.json();
      setFamilies(data.families || []);
    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (searchVillage) params.append('village', searchVillage);
      if (searchGol) params.append('gol', searchGol);

      const url = params.toString()
        ? `https://backend.youware.com/api/families/search?${params}`
        : 'https://backend.youware.com/api/families';

      const response = await fetch(url);
      const data = await response.json();
      setFamilies(data.families || []);
    } catch (error) {
      console.error('Error searching families:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery || searchVillage || searchGol) {
        handleSearch();
      } else {
        fetchFamilies();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery, searchVillage, searchGol]);

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
            <button
              onClick={() => navigate('/family-register')}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
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
              placeholder="મોભીનું નામ, ગામ, પેટા અટક શોધો..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-3 mt-4 overflow-x-auto hide-scrollbar">
            <input
              type="text"
              value={searchVillage}
              onChange={(e) => setSearchVillage(e.target.value)}
              placeholder="ગામ"
              className="px-4 py-2 bg-white/20 text-white placeholder-white/60 rounded-full text-sm font-gujarati focus:outline-none focus:bg-white/30 min-w-[100px]"
            />
            <input
              type="text"
              value={searchGol}
              onChange={(e) => setSearchGol(e.target.value)}
              placeholder="ગોળ"
              className="px-4 py-2 bg-white/20 text-white placeholder-white/60 rounded-full text-sm font-gujarati focus:outline-none focus:bg-white/30 min-w-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="px-6 py-4">
        <p className="text-sm text-gray-600 font-gujarati">
          {families.length} પરિવારો મળ્યા
        </p>
      </div>

      {/* Family List */}
      <div className="px-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-gujarati mt-4">લોડ થઈ રહ્યું છે...</p>
          </div>
        ) : families.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-mint/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-mint" />
            </div>
            <h3 className="font-gujarati font-bold text-gray-800 mb-2">
              કોઈ પરિવાર મળ્યો નથી
            </h3>
            <p className="text-sm text-gray-500 font-gujarati mb-4">
              નવો પરિવાર રજીસ્ટર કરો
            </p>
            <button
              onClick={() => navigate('/family-register')}
              className="bg-deep-blue text-white px-6 py-3 rounded-xl font-gujarati font-medium"
            >
              પરિવાર રજીસ્ટર કરો
            </button>
          </motion.div>
        ) : (
          families.map((family, index) => (
            <motion.button
              key={family.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/family/${family.id}`)}
              className="w-full premium-card p-6 text-left hover:shadow-elevated transition-all active:scale-98"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint to-teal-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-gujarati font-bold text-gray-800 text-lg mb-1">
                      {family.head_name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-deep-blue/10 text-deep-blue text-xs font-gujarati rounded-full">
                        {family.sub_surname}
                      </span>
                      <span className="px-2 py-1 bg-royal-gold/10 text-royal-gold text-xs font-gujarati rounded-full">
                        {family.gol}
                      </span>
                    </div>
                    {family.village && (
                      <div className="flex items-center text-sm text-gray-600 font-gujarati">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {family.village}
                        {family.district && `, ${family.district}`}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-mint mt-2 font-gujarati">
                      <Users className="w-4 h-4 mr-1" />
                      {family.members?.length || 0} સભ્યો
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
        className="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-br from-mint to-teal-500 rounded-full shadow-lg flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
      </motion.button>

      <BottomNav />
    </div>
  );
}
