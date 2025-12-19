import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Award,
  BookOpen,
  Quote,
  User,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import type { Achiever } from '../types/education';
import { getAchievers } from '../services/educationApi';

export default function AchieversScreen() {
  const navigate = useNavigate();
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchiever, setSelectedAchiever] = useState<Achiever | null>(null);

  useEffect(() => {
    fetchAchievers();
  }, []);

  const fetchAchievers = async () => {
    setLoading(true);
    const response = await getAchievers();
    if (response.success && response.data) {
      setAchievers(response.data);
    }
    setLoading(false);
  };

  const renderAchieverCard = (achiever: Achiever, index: number) => (
    <motion.div
      key={achiever.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => setSelectedAchiever(achiever)}
      className="premium-card p-5 mb-4 cursor-pointer active:scale-98 transition-transform"
    >
      <div className="flex items-start space-x-4">
        {achiever.photo ? (
          <img
            src={achiever.photo}
            alt={achiever.name}
            className="w-20 h-20 rounded-2xl object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-gujarati font-bold text-gray-800 text-lg">
            {achiever.name}
          </h3>
          <p className="text-gray-500 text-sm font-gujarati line-clamp-2 mt-1">
            {achiever.achievements}
          </p>
          <div className="flex items-center space-x-1 mt-2">
            <Star className="w-4 h-4 text-royal-gold fill-royal-gold" />
            <Star className="w-4 h-4 text-royal-gold fill-royal-gold" />
            <Star className="w-4 h-4 text-royal-gold fill-royal-gold" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/education')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-gujarati font-bold text-xl">
                સમાજના ગૌરવ
              </h1>
              <p className="text-mint text-sm font-gujarati">
                Community Pride
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-5 bg-gradient-to-br from-royal-gold/10 to-amber-50 border-l-4 border-royal-gold"
        >
          <div className="flex items-center space-x-3 mb-3">
            <Award className="w-8 h-8 text-royal-gold" />
            <h2 className="font-gujarati font-bold text-gray-800">
              આપણા સમાજના ગૌરવ
            </h2>
          </div>
          <p className="font-gujarati text-gray-600 text-sm">
            સમાજના સફળ વ્યક્તિઓ જેમણે પોતાની મહેનત અને લગનથી 
            ઉચ્ચ સિદ્ધિ મેળવી છે. તેમની journey થી પ્રેરણા લો.
          </p>
        </motion.div>
      </div>

      {/* Achievers List */}
      <div className="px-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-royal-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : achievers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-gujarati">હજુ કોઈ profile નથી</p>
            <p className="text-gray-400 text-sm font-gujarati mt-1">
              જલ્દી જ સમાજના ગૌરવ ઉમેરવામાં આવશે
            </p>
          </motion.div>
        ) : (
          <div>{achievers.map(renderAchieverCard)}</div>
        )}
      </div>

      {/* Quote */}
      <div className="px-6 py-4">
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-l-4 border-royal-gold">
          <p className="font-gujarati text-gray-700 text-sm italic">
            "આપણાં સમાજમાંથી પણ excellence ની ઓળખ બને"
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAchiever && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedAchiever(null)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            </div>

            <div className="px-6 pb-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4 mb-6">
                {selectedAchiever.photo ? (
                  <img
                    src={selectedAchiever.photo}
                    alt={selectedAchiever.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="font-gujarati font-bold text-xl text-gray-800">
                    {selectedAchiever.name}
                  </h2>
                  <p className="text-royal-gold font-gujarati text-sm mt-1">
                    {selectedAchiever.achievements}
                  </p>
                </div>
              </div>

              {/* Education Journey */}
              <div className="mb-6">
                <h3 className="font-gujarati font-semibold text-gray-800 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 text-mint mr-2" />
                  Education Journey
                </h3>
                <p className="text-gray-600 font-gujarati text-sm leading-relaxed">
                  {selectedAchiever.educationJourney}
                </p>
              </div>

              {/* Struggles */}
              <div className="mb-6">
                <h3 className="font-gujarati font-semibold text-gray-800 mb-3 flex items-center">
                  <Award className="w-5 h-5 text-mint mr-2" />
                  સંઘર્ષ
                </h3>
                <p className="text-gray-600 font-gujarati text-sm leading-relaxed">
                  {selectedAchiever.struggles}
                </p>
              </div>

              {/* Advice */}
              <div className="p-4 bg-gradient-to-r from-royal-gold/10 to-amber-50 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <Quote className="w-6 h-6 text-royal-gold flex-shrink-0" />
                  <div>
                    <h4 className="font-gujarati font-semibold text-gray-800 mb-2">
                      યુવાનો માટે સંદેશ
                    </h4>
                    <p className="text-gray-700 font-gujarati text-sm italic leading-relaxed">
                      "{selectedAchiever.adviceForYouth}"
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedAchiever(null)}
                className="w-full mt-6 py-3 border border-gray-200 rounded-xl font-gujarati text-gray-600"
              >
                બંધ કરો
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  );
}
