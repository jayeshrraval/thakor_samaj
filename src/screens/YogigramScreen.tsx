import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Play, Plus, Image as ImageIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { feedPosts } from '../data/mockData';
import BottomNav from '../components/BottomNav';

type TabType = 'feed' | 'videos';

export default function YogigramScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 safe-area-top px-6 py-6 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-gujarati font-bold text-2xl">યોગીગ્રામ</h1>
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-2 rounded-full font-gujarati font-medium transition-all ${
              activeTab === 'feed'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 text-white'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-6 py-2 rounded-full font-gujarati font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-white text-purple-600'
                : 'bg-white/20 text-white'
            }`}
          >
            Videos
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {activeTab === 'feed' && (
          <>
            {feedPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="premium-card overflow-hidden"
              >
                {/* Post Header */}
                <div className="flex items-center space-x-3 p-4">
                  <img
                    src={post.userAvatar}
                    alt={post.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-gujarati font-semibold text-gray-800">{post.userName}</h3>
                    <p className="text-xs text-gray-500 font-gujarati">{post.time}</p>
                  </div>
                </div>

                {/* Post Image */}
                <img src={post.image} alt="Post" className="w-full aspect-[4/3] object-cover" />

                {/* Post Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-1 group">
                        <Heart className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
                        <span className="text-sm text-gray-600">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 group">
                        <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm text-gray-600">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 group">
                        <Share2 className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
                        <span className="text-sm text-gray-600">{post.shares}</span>
                      </button>
                    </div>
                    <button>
                      <Bookmark className="w-6 h-6 text-gray-600 hover:text-royal-gold transition-colors" />
                    </button>
                  </div>

                  {/* Caption */}
                  <p className="text-sm text-gray-700 font-gujarati leading-relaxed">
                    {post.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-4">
            {[1, 2, 3].map((video) => (
              <motion.div
                key={video}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card overflow-hidden aspect-[9/16] relative"
              >
                <img
                  src={`https://images.unsplash.com/photo-${1511632765486 + video * 100}-a01980e01a18?w=400`}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 flex flex-col justify-end p-6">
                  <div className="flex items-end justify-between">
                    <div className="flex-1 space-y-2">
                      <p className="text-white font-gujarati text-sm">
                        સમાજના યુવાનો સાથે સુંદર સમય...
                      </p>
                      <div className="flex items-center space-x-2">
                        <img
                          src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100`}
                          alt="User"
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                        <span className="text-white text-xs font-gujarati">રાજેશ પટેલ</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </button>
                      <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full p-6 space-y-4 safe-area-bottom"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>

              <h2 className="text-xl font-bold text-gray-800 font-gujarati">નવી પોસ્ટ બનાવો</h2>

              <input
                type="text"
                placeholder="શીર્ષક"
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-gujarati"
              />

              <textarea
                placeholder="તમારા વિચારો લખો..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-gujarati resize-none"
              />

              <div className="flex space-x-3">
                <button className="flex-1 py-3 border-2 border-purple-200 text-purple-600 rounded-2xl font-gujarati font-medium flex items-center justify-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>ફોટો ઉમેરો</span>
                </button>
                <button className="flex-1 py-3 border-2 border-purple-200 text-purple-600 rounded-2xl font-gujarati font-medium flex items-center justify-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>વિડિયો ઉમેરો</span>
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600 font-gujarati">સામાન્ય પોસ્ટ / રીલ</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-gujarati font-semibold py-4 rounded-2xl shadow-lg">
                પોસ્ટ કરો
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
