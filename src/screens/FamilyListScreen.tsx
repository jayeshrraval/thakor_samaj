import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Users, MapPin, ChevronRight, Plus, User, Loader2, FileText, Download } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Family {
  id: string;
  head_name: string;
  sub_surname: string;
  gol: string;
  village: string;
  district: string;
  total_members: number;
}

export default function FamilyListScreen() {
  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 20;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchVillage, setSearchVillage] = useState('');
  const [searchGol, setSearchGol] = useState('');

  useEffect(() => {
    setPage(0);
    setFamilies([]);
    fetchFamilies(0, true);
  }, [searchQuery, searchVillage, searchGol]);

  const fetchFamilies = async (currentPage: number, isNewSearch: boolean = false) => {
    try {
      setLoading(true);
      let query = supabase
        .from('families')
        .select('*');

      if (searchQuery) {
        query = query.or(`head_name.ilike.%${searchQuery}%,sub_surname.ilike.%${searchQuery}%`);
      }
      if (searchVillage) query = query.ilike('village', `%${searchVillage}%`);
      if (searchGol) query = query.ilike('gol', `%${searchGol}%`);

      const from = currentPage * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (isNewSearch) {
        setFamilies(data || []);
      } else {
        setFamilies(prev => [...prev, ...(data || [])]);
      }
      
      setLoadMore(data?.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 📄 PDF Export Function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Yogi Samaj Family List", 14, 15);
    
    const tableData = families.map(f => [
      f.head_name,
      f.sub_surname,
      f.gol,
      f.village,
      f.total_members
    ]);

    autoTable(doc, {
      head: [['Name', 'Surname', 'Gol', 'Village', 'Members']],
      body: tableData,
      startY: 20,
    });

    doc.save('Family_List.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top sticky top-0 z-20 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-white font-gujarati font-bold text-2xl">પરિવાર યાદી</h1>
            <div className="flex space-x-2">
              <button 
                onClick={exportToPDF}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                title="Export PDF"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => navigate('/family-register')}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="નામ અથવા અટક શોધો..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl focus:outline-none shadow-inner font-gujarati"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-6 mt-4 space-y-4">
        {families.map((family, index) => (
          <motion.div
            key={family.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(`/family-detail/${family.id}`)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-mint/10 rounded-xl flex items-center justify-center text-mint font-bold">
                {family.head_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 font-gujarati">{family.head_name}</h3>
                <p className="text-xs text-gray-500 font-gujarati">{family.village} | સભ્યો: {family.total_members}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </motion.div>
        ))}

        {/* Load More Button */}
        {loadMore && !loading && (
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchFamilies(nextPage);
            }}
            className="w-full py-3 text-deep-blue font-bold font-gujarati bg-white rounded-xl border border-gray-200 shadow-sm"
          >
            વધારે પરિવારો જુઓ
          </button>
        )}

        {loading && <Loader2 className="w-6 h-6 animate-spin mx-auto text-deep-blue mt-4" />}
      </div>

      <BottomNav />
    </div>
  );
}