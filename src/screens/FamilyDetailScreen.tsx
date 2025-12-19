import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, User, Share2, Calendar, Loader2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient'; // ✅ Connect Supabase

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

export default function FamilyDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // URL માંથી ID મળશે
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchFamily();
  }, [id]);

  const fetchFamily = async () => {
    try {
      setLoading(true);

      // 1. Fetch Family Details
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .select('*')
        .eq('id', id)
        .single();

      if (familyError) throw familyError;

      // 2. Fetch Family Members (Linked by family_id)
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('family_id', id);

      if (membersError) throw membersError;

      // Combine Data
      setFamily({
        ...familyData,
        members: membersData || []
      });

    } catch (error) {
      console.error('Error fetching family:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderIcon = (gender: string) => {
    return gender === 'પુરુષ' ? '👨' : '👩';
  };

  const getRelationshipColor = (relationship: string) => {
    const colors: { [key: string]: string } = {
      'પત્ની': 'bg-pink-100 text-pink-700',
      'પુત્ર': 'bg-blue-100 text-blue-700',
      'પુત્રી': 'bg-purple-100 text-purple-700',
      'પિતા': 'bg-amber-100 text-amber-700',
      'માતા': 'bg-rose-100 text-rose-700',
      'ભાઈ': 'bg-cyan-100 text-cyan-700',
      'બહેન': 'bg-indigo-100 text-indigo-700',
    };
    return colors[relationship] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-mint animate-spin mx-auto" />
          <p className="text-gray-500 font-gujarati mt-4">પરિવારની માહિતી લાવી રહ્યા છીએ...</p>
        </div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-gujarati">પરિવાર મળ્યો નથી</p>
          <button
            onClick={() => navigate('/family-list')}
            className="mt-4 bg-deep-blue text-white px-6 py-2 rounded-xl font-gujarati"
          >
            પાછા જાઓ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Family Head Card */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-white font-gujarati font-bold text-2xl mb-1 leading-tight">
                {family.head_name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {family.sub_surname && (
                  <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold font-gujarati rounded-full border border-white/10">
                    {family.sub_surname}
                  </span>
                )}
                {family.gol && (
                  <span className="px-3 py-1 bg-royal-gold/40 text-white text-xs font-bold font-gujarati rounded-full border border-white/10">
                    {family.gol}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {(family.members?.length || 0) + 1}
              </p>
              <p className="text-white/80 text-xs font-gujarati">કુલ સભ્યો</p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <p className="text-xl font-bold text-white font-gujarati">
                {family.village || '-'}
              </p>
              <p className="text-white/80 text-xs font-gujarati">મૂળ ગામ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6 border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-royal-gold/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-royal-gold" />
            </div>
            <h2 className="font-gujarati font-bold text-gray-800 text-lg">
              સ્થળની માહિતી
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-gujarati mb-1">ગામ</p>
              <p className="font-gujarati font-medium text-gray-800 text-sm">
                {family.village || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-gujarati mb-1">તાલુકો</p>
              <p className="font-gujarati font-medium text-gray-800 text-sm">
                {family.taluko || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-gujarati mb-1">જિલ્લો</p>
              <p className="font-gujarati font-medium text-gray-800 text-sm">
                {family.district || '-'}
              </p>
            </div>
            {/* If current_residence field exists in your DB, uncomment below */}
            {/* <div>
              <p className="text-xs text-gray-500 font-gujarati mb-1">હાલનું રહેઠાણ</p>
              <p className="font-gujarati font-medium text-gray-800 text-sm">
                {family.current_residence || '-'}
              </p>
            </div> */}
          </div>
        </motion.div>

        {/* Family Members Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-deep-blue" />
              </div>
              <h2 className="font-gujarati font-bold text-gray-800 text-lg">
                પરિવારના સભ્યો
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-500 font-gujarati bg-gray-100 px-2 py-1 rounded-lg">
              {(family.members?.length || 0) + 1}
            </span>
          </div>

          <div className="space-y-3">
            {/* Head Member (Always on Top) */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-deep-blue/5 to-mint/5 rounded-xl border border-deep-blue/10">
              <div className="w-12 h-12 rounded-full bg-deep-blue flex items-center justify-center text-xl shadow-md border-2 border-white">
                👨‍🦳
              </div>
              <div className="flex-1">
                <p className="font-gujarati font-bold text-gray-800 text-sm">
                  {family.head_name}
                </p>
                <span className="px-2 py-0.5 bg-deep-blue text-white text-[10px] font-bold font-gujarati rounded-full inline-block mt-1">
                  પરિવારના મોભી
                </span>
              </div>
            </div>

            {/* Other Members */}
            {family.members?.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xl shadow-sm">
                  {getGenderIcon(member.gender)}
                </div>
                <div className="flex-1">
                  <p className="font-gujarati font-semibold text-gray-800 text-sm">
                    {member.member_name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {member.relationship && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold font-gujarati rounded-full ${getRelationshipColor(
                          member.relationship
                        )}`}
                      >
                        {member.relationship}
                      </span>
                    )}
                    {member.gender && (
                      <span className="text-[10px] text-gray-400 font-gujarati border border-gray-200 px-1.5 rounded">
                        {member.gender}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {family.members?.length === 0 && (
                <p className="text-center text-gray-400 text-xs py-2 font-gujarati">અન્ય કોઈ સભ્યો ઉમેરાયા નથી.</p>
            )}
          </div>
        </motion.div>

        {/* Registration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-4 flex items-center justify-center space-x-2 text-gray-400 border border-gray-100"
        >
          <Calendar className="w-4 h-4" />
          <p className="text-xs font-gujarati">
            રજીસ્ટ્રેશન: {new Date(family.created_at).toLocaleDateString('gu-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}