import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  GraduationCap,
  Calendar,
  FileText,
  ExternalLink,
  Phone,
  Clock,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import type { Scholarship } from '../types/education';
import { getScholarships } from '../services/educationApi';

export default function ScholarshipScreen() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    const response = await getScholarships({ query: searchQuery, isActive: true });
    if (response.success && response.data) {
      setScholarships(response.data);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchScholarships();
  };

  const isExpired = (dateStr: string) => {
    const date = new Date(dateStr);
    return date < new Date();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('gu-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderScholarshipCard = (scholarship: Scholarship) => {
    const expired = isExpired(scholarship.lastDate);
    
    return (
      <motion.div
        key={scholarship.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setSelectedScholarship(scholarship)}
        className={`premium-card p-5 mb-4 cursor-pointer active:scale-98 transition-transform ${
          expired ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-gujarati font-semibold text-gray-800 text-lg">
              {scholarship.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className={`text-sm font-gujarati ${expired ? 'text-red-500' : 'text-gray-500'}`}>
                {expired ? 'સમય પૂરો' : `છેલ્લી તારીખ: ${formatDate(scholarship.lastDate)}`}
              </span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-gujarati ${
            expired 
              ? 'bg-red-100 text-red-600' 
              : 'bg-mint/20 text-mint'
          }`}>
            {expired ? 'બંધ' : 'ખુલ્લું'}
          </div>
        </div>

        <p className="text-gray-600 text-sm font-gujarati line-clamp-2 mb-3">
          {scholarship.eligibility}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-royal-gold" />
            <span className="text-xs text-gray-500 font-gujarati">વિગતો જુઓ</span>
          </div>
          <ExternalLink className="w-4 h-4 text-mint" />
        </div>
      </motion.div>
    );
  };

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
                સ્કોલરશિપ અને સહાય
              </h1>
              <p className="text-mint text-sm font-gujarati">
                Scholarships & Support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="સ્કોલરશિપ શોધો..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Scholarships List */}
      <div className="px-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scholarships.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-gujarati">કોઈ સ્કોલરશિપ મળી નથી</p>
            <p className="text-gray-400 text-sm font-gujarati mt-1">
              જલ્દી જ નવી સ્કોલરશિપ ઉમેરવામાં આવશે
            </p>
          </motion.div>
        ) : (
          <div>
            {scholarships.map(renderScholarshipCard)}
          </div>
        )}
      </div>

      {/* Quote */}
      <div className="px-6 py-4">
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-l-4 border-emerald-500">
          <p className="font-gujarati text-gray-700 text-sm italic">
            "સમાજનો એક પણ વિદ્યાર્થી માત્ર માહિતીના અભાવે પાછળ ન રહી જાય"
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setSelectedScholarship(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100">
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                <h2 className="font-gujarati font-bold text-xl text-gray-800">
                  {selectedScholarship.name}
                </h2>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Last Date */}
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-mint mt-0.5" />
                  <div>
                    <p className="font-gujarati text-xs text-gray-500">છેલ્લી તારીખ</p>
                    <p className={`font-gujarati font-semibold ${
                      isExpired(selectedScholarship.lastDate) ? 'text-red-500' : 'text-gray-800'
                    }`}>
                      {formatDate(selectedScholarship.lastDate)}
                    </p>
                  </div>
                </div>

                {/* Eligibility */}
                <div>
                  <h3 className="font-gujarati font-semibold text-gray-800 mb-2 flex items-center">
                    <GraduationCap className="w-4 h-4 text-mint mr-2" />
                    કોણ apply કરી શકે
                  </h3>
                  <p className="text-gray-600 font-gujarati text-sm leading-relaxed">
                    {selectedScholarship.eligibility}
                  </p>
                </div>

                {/* Required Documents */}
                <div>
                  <h3 className="font-gujarati font-semibold text-gray-800 mb-2 flex items-center">
                    <FileText className="w-4 h-4 text-mint mr-2" />
                    જરૂરી Documents
                  </h3>
                  <p className="text-gray-600 font-gujarati text-sm leading-relaxed whitespace-pre-line">
                    {selectedScholarship.requiredDocuments}
                  </p>
                </div>

                {/* Contact Details */}
                {selectedScholarship.contactDetails && (
                  <div>
                    <h3 className="font-gujarati font-semibold text-gray-800 mb-2 flex items-center">
                      <Phone className="w-4 h-4 text-mint mr-2" />
                      સંપર્ક
                    </h3>
                    <p className="text-gray-600 font-gujarati text-sm">
                      {selectedScholarship.contactDetails}
                    </p>
                  </div>
                )}

                {/* Apply Button */}
                {selectedScholarship.applyLink && !isExpired(selectedScholarship.lastDate) && (
                  <a
                    href={selectedScholarship.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-gradient-to-r from-mint to-teal-500 text-white rounded-xl font-gujarati font-semibold text-center shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4 inline-block mr-2" />
                    Apply કરો
                  </a>
                )}

                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="w-full py-3 border border-gray-200 rounded-xl font-gujarati text-gray-600"
                >
                  બંધ કરો
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
