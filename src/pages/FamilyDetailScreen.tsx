import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  User, 
  Share2,
  Calendar
} from 'lucide-react';
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

export default function FamilyDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFamily();
  }, [id]);

  const fetchFamily = async () => {
    try {
      const response = await fetch(`https://backend.youware.com/api/families/${id}`);
      const data = await response.json();
      setFamily(data);
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
          <div className="w-12 h-12 border-4 border-mint border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-gujarati mt-4">લોડ થઈ રહ્યું છે...</p>
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
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-white font-gujarati font-bold text-2xl mb-1">
                {family.head_name}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-gujarati rounded-full">
                  {family.sub_surname}
                </span>
                <span className="px-3 py-1 bg-royal-gold/30 text-white text-sm font-gujarati rounded-full">
                  {family.gol}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around bg-white/10 rounded-2xl p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {(family.members?.length || 0) + 1}
              </p>
              <p className="text-white/80 text-sm font-gujarati">કુલ સભ્યો</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <p className="text-xl font-bold text-white font-gujarati">
                {family.village || '-'}
              </p>
              <p className="text-white/80 text-sm font-gujarati">મૂળ ગામ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Location Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6"
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
              <p className="font-gujarati font-medium text-gray-800">
                {family.village || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-gujarati mb-1">તાલુકો</p>
              <p className="font-gujarati font-medium text-gray-800">
                {family.taluko || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-gujarati mb-1">જિલ્લો</p>
              <p className="font-gujarati font-medium text-gray-800">
                {family.district || '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-gujarati mb-1">હાલનું રહેઠાણ</p>
              <p className="font-gujarati font-medium text-gray-800">
                {family.current_residence || '-'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Family Members Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6"
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
            <span className="text-sm text-gray-500 font-gujarati">
              {(family.members?.length || 0) + 1} સભ્યો
            </span>
          </div>

          <div className="space-y-3">
            {/* Head Member */}
            <div className="flex items-center space-x-3 p-3 bg-deep-blue/5 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-deep-blue flex items-center justify-center text-xl">
                👨‍👩‍👧‍👦
              </div>
              <div className="flex-1">
                <p className="font-gujarati font-semibold text-gray-800">
                  {family.head_name}
                </p>
                <span className="px-2 py-0.5 bg-deep-blue text-white text-xs font-gujarati rounded-full">
                  પરિવારના મોભી
                </span>
              </div>
            </div>

            {/* Other Members */}
            {family.members?.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + index * 0.05 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-xl">
                  {getGenderIcon(member.gender)}
                </div>
                <div className="flex-1">
                  <p className="font-gujarati font-semibold text-gray-800">
                    {member.member_name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-0.5 text-xs font-gujarati rounded-full ${getRelationshipColor(
                        member.relationship
                      )}`}
                    >
                      {member.relationship}
                    </span>
                    <span className="text-xs text-gray-500 font-gujarati">
                      {member.gender}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Registration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-4"
        >
          <div className="flex items-center space-x-3 text-gray-500">
            <Calendar className="w-5 h-5" />
            <p className="text-sm font-gujarati">
              રજીસ્ટ્રેશન તારીખ:{' '}
              {new Date(family.created_at).toLocaleDateString('gu-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
