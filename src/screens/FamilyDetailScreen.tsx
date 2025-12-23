import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, MapPin, User, Heart, 
  GraduationCap, Loader2, Info 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import BottomNav from '../components/BottomNav';

interface FamilyHead {
  id: string;
  family_name: string;
  village: string;
  address: string;
  total_members: number;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  gender: string;
  age: number;
  education: string;
}

export default function FamilyDetailsScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [familyHead, setFamilyHead] = useState<FamilyHead | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    if (id) fetchFamilyDetails();
  }, [id]);

  const fetchFamilyDetails = async () => {
    try {
      setLoading(true);
      
      // ૧. પરિવારના મોભીની વિગત મેળવો
      const { data: headData, error: headError } = await supabase
        .from('family_heads')
        .select('*')
        .eq('id', id)
        .single();

      if (headError) throw headError;
      setFamilyHead(headData);

      // ૨. આ પરિવારના બધા સભ્યોની લિસ્ટ મેળવો (head_id ના આધારે)
      const { data: membersData, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('head_id', id);

      if (membersError) throw membersError;
      setMembers(membersData || []);

    } catch (error: any) {
      console.error('Error:', error.message);
      alert('માહિતી મેળવવામાં ભૂલ આવી');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-deep-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-gujarati">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top shadow-lg">
        <div className="px-6 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white font-bold text-xl uppercase tracking-tight">પરિવારની વિગત</h1>
          </div>
          
          {familyHead && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-white">
              <h2 className="text-2xl font-black mb-2">{familyHead.family_name}</h2>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin size={14}/> {familyHead.village}</span>
                <span className="flex items-center gap-1"><Users size={14}/> {familyHead.total_members} સભ્યો</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-6 py-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <Info className="text-deep-blue" size={20} /> પરિવારના સભ્યોની લિસ્ટ
        </h3>

        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400">આ પરિવારમાં કોઈ સભ્યની એન્ટ્રી મળી નથી.</p>
            </div>
          ) : (
            members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${member.gender === 'સ્ત્રી' ? 'bg-pink-50' : 'bg-blue-50'}`}>
                  <User className={member.gender === 'સ્ત્રી' ? 'text-pink-500' : 'text-blue-500'} size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 text-base">{member.name}</h4>
                    <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded-full text-gray-500 uppercase tracking-tighter">
                      {member.relation}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                       {member.gender}
                    </span>
                    {member.education && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <GraduationCap size={12} className="text-deep-blue" /> {member.education}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}