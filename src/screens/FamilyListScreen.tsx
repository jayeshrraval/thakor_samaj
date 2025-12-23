import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Users, MapPin, ChevronRight, ArrowLeft, 
  Loader2, Filter, UserPlus 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import BottomNav from '../components/BottomNav';

interface FamilyHead {
  id: string;
  family_name: string;
  village: string;
  address: string;
  total_members: number;
}

export default function FamilyListScreen() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<FamilyHead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      // 'family_heads' ટેબલમાંથી બધો ડેટા ફેચ કરો
      const { data, error } = await supabase
        .from('family_heads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilies(data || []);
    } catch (error: any) {
      console.error('Error fetching families:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFamilies = families.filter(f => 
    f.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.village.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-gujarati">
      {/* Header */}
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="પરિવાર અથવા ગામ શોધો..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur-sm border-none rounded-2xl py-4 pl-12 pr-4 shadow-xl focus:ring-2 focus:ring-mint outline-none transition-all font-gujarati"
            />
          </div>
        </div>
      </div>

      {/* Family List Content */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-deep-blue" />
            <p>માહિતી લોડ થઈ રહી છે...</p>
          </div>
        ) : filteredFamilies.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">કોઈ માહિતી મળી નથી</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredFamilies.map((family, index) => (
                <motion.div
                  key={family.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/family-details/${family.id}`)}
                  className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-mint/10 rounded-2xl flex items-center justify-center shadow-inner">
                      <Users className="text-deep-blue w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                        {family.family_name}
                      </h3>
                      <div className="flex items-center text-gray-500 text-xs gap-1">
                        <MapPin size={12} className="text-orange-500" />
                        <span>{family.village}</span>
                        <span className="mx-1">•</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-deep-blue font-bold">
                          {family.total_members} સભ્યો
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-full text-gray-400">
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}