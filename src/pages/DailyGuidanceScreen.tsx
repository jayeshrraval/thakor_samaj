import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Newspaper,
  Briefcase,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import type { GuidancePost } from '../types/education';
import { getGuidancePosts, getTodayGuidance } from '../services/educationApi';

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
  const [posts, setPosts] = useState<GuidancePost[]>([]);
  const [todayPost, setTodayPost] = useState<GuidancePost | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<GuidancePost | null>(null);
  const [filterTopic, setFilterTopic] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch today's guidance
    const todayResponse = await getTodayGuidance();
    if (todayResponse.success && todayResponse.data) {
      setTodayPost(todayResponse.data);
    }

    // Fetch all posts
    const postsResponse = await getGuidancePosts();
    if (postsResponse.success && postsResponse.data) {
      setPosts(postsResponse.data);
    }
    
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
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

  const renderPostCard = (post: GuidancePost, index: number) => {
    const config = topicConfig[post.topic];
    const Icon = config.icon;

    return (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => setSelectedPost(post)}
        className="premium-card p-4 mb-3 cursor-pointer active:scale-98 transition-transform"
      >
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-gujarati font-semibold text-gray-800 line-clamp-1">
              {post.title}
            </h3>
            <p className="text-gray-500 text-xs font-gujarati mt-1 line-clamp-2">
              {post.content}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-gujarati ${config.bgColor} ${config.textColor}`}>
                {config.label}
              </span>
              <span className="text-gray-400 text-xs">
                {formatDate(post.publishDate)}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
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
                આજનું શિક્ષણ માર્ગદર્શન
              </h1>
              <p className="text-mint text-sm font-gujarati">
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
            className="premium-card p-5 bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-200 cursor-pointer"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-rose-500" />
              <span className="text-rose-600 font-gujarati font-semibold text-sm">
                આજનું માર્ગદર્શન
              </span>
            </div>
            <h2 className="font-gujarati font-bold text-gray-800 text-lg mb-2">
              {todayPost.title}
            </h2>
            <p className="text-gray-600 font-gujarati text-sm line-clamp-3">
              {todayPost.content}
            </p>
            <div className="flex items-center justify-end mt-3">
              <span className="text-rose-500 font-gujarati text-sm flex items-center">
                વધુ વાંચો
                <ChevronRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Topic Filters */}
      <div className="px-6 pb-4">
        <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
          <button
            onClick={() => setFilterTopic('')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-gujarati ${
              !filterTopic
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            બધા
          </button>
          {Object.entries(topicConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterTopic(key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-gujarati ${
                filterTopic === key
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="px-6">
        <h3 className="font-gujarati font-semibold text-gray-800 mb-4">
          તમામ પોસ્ટ્સ
        </h3>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-gujarati">કોઈ પોસ્ટ મળી નથી</p>
            <p className="text-gray-400 text-sm font-gujarati mt-1">
              જલ્દી જ નવી માર્ગદર્શન પોસ્ટ ઉમેરવામાં આવશે
            </p>
          </motion.div>
        ) : (
          <div>{filteredPosts.map(renderPostCard)}</div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setSelectedPost(null)}
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
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${topicConfig[selectedPost.topic].color} flex items-center justify-center`}>
                  {(() => {
                    const Icon = topicConfig[selectedPost.topic].icon;
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-gujarati ${topicConfig[selectedPost.topic].bgColor} ${topicConfig[selectedPost.topic].textColor}`}>
                    {topicConfig[selectedPost.topic].label}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">
                    {formatDate(selectedPost.publishDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <h2 className="font-gujarati font-bold text-xl text-gray-800 mb-4">
                {selectedPost.title}
              </h2>
              <div className="prose prose-sm">
                <p className="text-gray-700 font-gujarati text-sm leading-relaxed whitespace-pre-line">
                  {selectedPost.content}
                </p>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
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
