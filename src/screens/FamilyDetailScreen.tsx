import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, User, Share2, Calendar, Loader2, Download } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ... (Interfaces remain same as your code)

export default function FamilyDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [family, setFamily] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchFamily();
  }, [id]);

  const fetchFamily = async () => {
    try {
      setLoading(true);
      const { data: familyData } = await supabase.from('families').select('*').eq('id', id).single();
      const { data: membersData } = await supabase.from('members').select('*').eq('family_id', id);
      
      setFamily({ ...familyData, members: membersData || [] });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 📄 PDF Generator for Single Family
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("Yogi Samaj - Family Details", 14, 20);
    
    // Family Head Info
    doc.setFontSize(12);
    doc.text(`Head of Family: ${family.head_name}`, 14, 35);
    doc.text(`Surname/Gol: ${family.sub_surname} (${family.gol})`, 14, 42);
    doc.text(`Location: ${family.village}, ${family.taluko}, ${family.district}`, 14, 49);

    // Members Table
    const tableBody = family.members.map((m: any, i: number) => [
      i + 1,
      m.member_name,
      m.relationship,
      m.gender
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Sr.', 'Member Name', 'Relationship', 'Gender']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillStyle: '#0A2647' }
    });

    doc.save(`${family.head_name}_Family.pdf`);
  };

  // ... (getGenderIcon and getRelationshipColor functions remain same)

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-mint animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with PDF Button */}
      <div className="bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint safe-area-top shadow-lg rounded-b-[2.5rem]">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex space-x-3">
              <button onClick={generatePDF} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Download className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Share2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center border border-white/30 shadow-2xl backdrop-blur-sm">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-white font-gujarati font-bold text-2xl drop-shadow-md">{family.head_name}</h1>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold font-gujarati rounded-full border border-white/20 uppercase tracking-wider">
                  {family.sub_surname}
                </span>
                <span className="px-3 py-1 bg-royal-gold/30 text-white text-[10px] font-bold font-gujarati rounded-full border border-white/20">
                  {family.gol}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Location Info (Optimized for Taluko) */}
        <div className="premium-card p-6 bg-white shadow-xl shadow-gray-200/50">
           <div className="flex items-center space-x-3 mb-4">
             <MapPin className="text-royal-gold" size={20} />
             <h2 className="font-gujarati font-bold text-gray-800">રહેઠાણની વિગત</h2>
           </div>
           <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 p-2 rounded-xl">
                <p className="text-[10px] text-gray-400 font-gujarati">ગામ</p>
                <p className="text-sm font-bold font-gujarati">{family.village}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl">
                <p className="text-[10px] text-gray-400 font-gujarati">તાલુકો</p>
                <p className="text-sm font-bold font-gujarati">{family.taluko || '-'}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl">
                <p className="text-[10px] text-gray-400 font-gujarati">જિલ્લો</p>
                <p className="text-sm font-bold font-gujarati">{family.district}</p>
              </div>
           </div>
        </div>

        {/* Family Members List (Your logic integrated) */}
        <div className="premium-card p-6 bg-white shadow-xl shadow-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-gujarati font-bold text-gray-800 text-lg flex items-center gap-2">
              <Users className="text-deep-blue" size={22} /> પરિવારના સભ્યો
            </h2>
            <span className="bg-deep-blue/5 text-deep-blue text-xs font-bold px-3 py-1 rounded-full border border-deep-blue/10">
              {family.members.length + 1} સભ્યો
            </span>
          </div>

          <div className="space-y-4">
            {/* Display Head First */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="flex items-center space-x-4">
                 <div className="text-2xl">👨‍🦳</div>
                 <div>
                   <p className="font-gujarati font-bold text-gray-800 text-sm">{family.head_name}</p>
                   <p className="text-[10px] text-deep-blue font-bold font-gujarati uppercase">પરિવારના મોભી</p>
                 </div>
               </div>
            </div>

            {family.members.map((member: any) => (
              <div key={member.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getGenderIcon(member.gender)}</div>
                  <div>
                    <p className="font-gujarati font-semibold text-gray-800 text-sm">{member.member_name}</p>
                    <span className={`px-2 py-0.5 text-[10px] font-bold font-gujarati rounded-full ${getRelationshipColor(member.relationship)}`}>
                      {member.relationship}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}