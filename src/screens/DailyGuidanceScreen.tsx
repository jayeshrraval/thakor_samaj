import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Newspaper,
  Briefcase,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Loader2
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

// ડેટાબેઝના ડેટાનું ફોર્મેટ
const topicConfig = {
  career: {
    icon: Briefcase,
    label: 'Career Awareness',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  skills: {
    icon: Lightbulb,
    label: 'Skill Importance',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  myths: {
    icon: AlertTriangle,
    label: 'Education Myths',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
  },
  general: {
    icon: Newspaper,
    label: 'General',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
};

export default function DailyGuidanceScreen() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [todayPost, setTodayPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [filterTopic, setFilterTopic] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // Fetch all posts ordered by date
      const { data, error } = await supabase
        .from('daily_guidance')
        .select('*')
        .order('display_date', { ascending: false });

      if (error) throw error;

      if (data) {
        setPosts(data);
        
        // આજની પોસ્ટ શોધો
        const today = data.find((p) => p.display_date === todayDate);
        if (today) setTodayPost(today);
        // જો આજની ન હોય, તો સૌથી તાજેતરની (First) બતાવો
        else if (data.length > 0) setTodayPost(data[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('gu-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredPosts = filterTopic
    ? posts.filter((p) => p.topic === filterTopic)
    : posts;

  const renderPostCard = (post, index) => {
    // જો ટોપિક મેચ ન થાય તો ડિફોલ્ટ 'general' લેવું
    const config = topicConfig[post.topic] || topicConfig['general'];
    const Icon = config.icon;

    return (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => setSelectedPost(post)}
        className="bg-white rounded-[24px] p-4 mb-3 cursor-pointer active:scale-98 transition-all shadow-sm border border-gray-100 hover:shadow-md"
      >
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-gujarati font-bold text-gray-800 line-clamp-1 text-base">
              {post.title || 'No Title'}
            </h3>
            <p className="text-gray-500 text-xs font-gujarati mt-1 line-clamp-2">
              {post.content || 'વાંચવા માટે ક્લિક કરો...'}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-gujarati ${config.bgColor} ${config.textColor}`}>
                {config.label}
              </span>
              <span className="text-gray-400 text-[10px] font-medium">
                {formatDate(post.display_date)}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-gujarati">
      {/* Header: Maroon with Gold Glow */}
      <div className="bg-[#800000] safe-area-top shadow-lg relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="px-6 py-6 relative z-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/education')}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-gujarati font-bold text-xl">
                આજનું શિક્ષણ માર્ગદર્શન
              </h1>
              <p className="text-[#D4AF37] text-sm font-gujarati font-medium">
                Daily Guidance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Post */}
      {todayPost && (
        <div className="px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedPost(todayPost)}
            className="bg-white rounded-[24px] p-5 border-l-4 border-[#D4AF37] shadow-sm cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4AF37]/10 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-[#800000]" />
              <span className="text-[#800000] font-gujarati font-bold text-sm">
                આજનું માર્ગદર્શન
              </span>
            </div>
            <h2 className="font-gujarati font-bold text-gray-800 text-lg mb-2 relative z-10">
              {todayPost.title}
            </h2>
            <p className="text-gray-600 font-gujarati text-sm line-clamp-3 relative z-10">
              {todayPost.content}
            </p>
            <div className="flex items-center justify-end mt-3 relative z-10">
              <span className="text-[#D4AF37] font-bold font-gujarati text-sm flex items-center">
                વધુ વાંચો
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Topic Filters */}
      <div className="px-6 pb-4">
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide py-2">
          <button
            onClick={() => setFilterTopic('')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold font-gujarati transition-all ${
              !filterTopic
                ? 'bg-[#800000] text-white shadow-md'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            બધા
          </button>
          {Object.entries(topicConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterTopic(key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold font-gujarati transition-all ${
                filterTopic === key
                  ? 'bg-[#800000] text-white shadow-md'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="px-6">
        <h3 className="font-gujarati font-bold text-gray-800 mb-4 text-lg">
          તમામ પોસ્ટ્સ
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#800000] animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-[30px] border-2 border-dashed border-gray-100"
          >
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-gujarati font-bold">કોઈ પોસ્ટ મળી નથી</p>
            <p className="text-gray-400 text-xs font-gujarati mt-1">
              જલ્દી જ નવી માર્ગદર્શન પોસ્ટ ઉમેરવામાં આવશે
            </p>
          </motion.div>
        ) : (
          <div>{filteredPosts.map(renderPostCard)}</div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-[40px] max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white/90 backdrop-blur-md px-6 py-4 border-b border-gray-100 z-10">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${topicConfig[selectedPost.topic]?.color || topicConfig['general'].color} flex items-center justify-center shadow-lg`}>
                    {(() => {
                      const Icon = topicConfig[selectedPost.topic]?.icon || topicConfig['general'].icon;
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-gujarati uppercase tracking-wider ${topicConfig[selectedPost.topic]?.bgColor || 'bg-gray-100'} ${topicConfig[selectedPost.topic]?.textColor || 'text-gray-700'}`}>
                      {topicConfig[selectedPost.topic]?.label || 'General'}
                    </span>
                    <p className="text-gray-400 text-xs mt-1 font-medium">
                      {formatDate(selectedPost.display_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 pb-10">
                <h2 className="font-gujarati font-black text-2xl text-gray-800 mb-6 leading-tight">
                  {selectedPost.title}
                </h2>
                
                {selectedPost.image_url && (
                    <img src={selectedPost.image_url} className="w-full h-56 object-cover rounded-3xl mb-6 shadow-md" alt="Post" />
                )}

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 font-gujarati text-base leading-relaxed whitespace-pre-line">
                    {selectedPost.content}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-full mt-8 py-4 bg-gray-100 rounded-2xl font-bold font-gujarati text-gray-500 uppercase tracking-widest text-xs hover:bg-gray-200 transition-all"
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