import { useState } from 'react';
import { Search, SlidersHorizontal, Heart, ArrowUpDown, CheckCircle, Share2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { matrimonyProfiles } from '../data/mockData';
import BottomNav from '../components/BottomNav';

type TabType = 'list' | 'detail' | 'myprofile';

export default function MatrimonyScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [selectedProfile, setSelectedProfile] = useState(matrimonyProfiles[0]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">મેટ્રિમોની</h1>
        <p className="text-white/80 text-sm">આદર્શ જીવનસાથી શોધો</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 pt-4 sticky top-0 z-10">
        <div className="flex space-x-4 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-2 font-gujarati font-medium whitespace-nowrap transition-all ${
              activeTab === 'list'
                ? 'text-deep-blue border-b-2 border-deep-blue'
                : 'text-gray-500'
            }`}
          >
            પ્રોફાઈલ લિસ્ટ
          </button>
          <button
            onClick={() => setActiveTab('detail')}
            className={`pb-3 px-2 font-gujarati font-medium whitespace-nowrap transition-all ${
              activeTab === 'detail'
                ? 'text-deep-blue border-b-2 border-deep-blue'
                : 'text-gray-500'
            }`}
          >
            પ્રોફાઈલ વિગત
          </button>
          <button
            onClick={() => setActiveTab('myprofile')}
            className={`pb-3 px-2 font-gujarati font-medium whitespace-nowrap transition-all ${
              activeTab === 'myprofile'
                ? 'text-deep-blue border-b-2 border-deep-blue'
                : 'text-gray-500'
            }`}
          >
            મારી મેટ્રિમોની પ્રોફાઈલ
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {activeTab === 'list' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="શોધો..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
                />
              </div>
              <button className="px-4 py-3 bg-white border border-gray-200 rounded-2xl">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
              <button className="px-4 py-3 bg-white border border-gray-200 rounded-2xl">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Profile Cards */}
            {matrimonyProfiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="premium-card p-4"
              >
                <div className="flex space-x-4">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-24 h-24 rounded-2xl object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-gujarati font-bold text-gray-800">{profile.name}</h3>
                    <p className="text-sm text-gray-600 font-gujarati">
                      પિતા: {profile.fatherName}
                    </p>
                    <p className="text-sm text-gray-600 font-gujarati">
                      માતા: {profile.motherName}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-mint/10 text-deep-blue rounded-full font-gujarati">
                        {profile.gol}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {profile.age} વર્ષ
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-gujarati">
                        {profile.village}
                      </span>
                    </div>
                    {profile.kundaliAvailable && (
                      <span className="inline-flex items-center text-xs text-green-600 font-gujarati">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        કુંડળી ઉપલબ્ધ
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setSelectedProfile(profile);
                      setActiveTab('detail');
                    }}
                    className="flex-1 bg-deep-blue text-white py-2.5 rounded-xl font-gujarati font-medium"
                  >
                    વિગત જુઓ
                  </button>
                  <button className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'detail' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Photo */}
            <div className="premium-card overflow-hidden">
              <img
                src={selectedProfile.photo}
                alt={selectedProfile.name}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="premium-card p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 font-gujarati">મૂળભૂત માહિતી</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">નામ</p>
                  <p className="font-gujarati font-medium">{selectedProfile.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">ગોળ</p>
                  <p className="font-gujarati font-medium">{selectedProfile.gol}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">વય</p>
                  <p className="font-gujarati font-medium">{selectedProfile.age} વર્ષ</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">ગામ</p>
                  <p className="font-gujarati font-medium">{selectedProfile.village}</p>
                </div>
              </div>
            </div>

            {/* Education & Work */}
            <div className="premium-card p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 font-gujarati">શિક્ષણ & નોકરી</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">શિક્ષણ</p>
                  <p className="font-medium">{selectedProfile.education}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">નોકરી/ધંધો</p>
                  <p className="font-medium">{selectedProfile.occupation}</p>
                </div>
              </div>
            </div>

            {/* Family Info */}
            <div className="premium-card p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 font-gujarati">પરિવારિક માહિતી</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">પિતા નું નામ</p>
                  <p className="font-gujarati font-medium">{selectedProfile.fatherName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-gujarati">માતા નું નામ</p>
                  <p className="font-gujarati font-medium">{selectedProfile.motherName}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-mint text-deep-blue font-gujarati font-semibold py-3 rounded-xl">
                રીક્વેસ્ટ મોકલો
              </button>
              <button className="bg-deep-blue text-white font-gujarati font-semibold py-3 rounded-xl">
                સ્વીકારો
              </button>
              <button className="border border-gray-300 text-gray-700 font-gujarati font-medium py-3 rounded-xl flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>સેવ કરો</span>
              </button>
              <button className="border border-gray-300 text-gray-700 font-gujarati font-medium py-3 rounded-xl flex items-center justify-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>શેર કરો</span>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'myprofile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Photo Upload */}
            <div className="premium-card p-6">
              <h3 className="font-gujarati font-bold text-gray-800 mb-4">ફોટો</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <span className="text-gray-400 text-sm">મુખ્ય</span>
                </div>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200"
                  >
                    <span className="text-gray-400 text-xs">+</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="premium-card p-6 space-y-4">
              <h3 className="font-gujarati font-bold text-gray-800 mb-4">માહિતી</h3>
              {[
                'નામ',
                'પિતા નું નામ',
                'માતા નું નામ',
                'પેટા અટક',
                'માતાની પેટા અટક',
                'ગોળ',
                'વય',
                'ગામ',
                'તાલુકો',
                'જીલ્લો',
                'શિક્ષણ',
                'નોકરી/ધંધો',
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-600 font-gujarati mb-1">
                    {field}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
                    placeholder={`${field} દાખલ કરો`}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-gray-600 font-gujarati">કુંડળી ઉપલબ્ધ?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-mint rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint"></div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 bg-deep-blue text-white font-gujarati font-semibold py-4 rounded-2xl">
                પ્રોફાઈલ સેવ કરો
              </button>
              <button className="flex-1 border-2 border-gray-300 text-gray-700 font-gujarati font-medium py-4 rounded-2xl">
                ડ્રાફ્ટ સેવ કરો
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
