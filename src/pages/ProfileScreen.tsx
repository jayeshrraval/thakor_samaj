import { User, Phone, Mail, MapPin, Calendar, Settings, Heart, Bookmark, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function ProfileScreen() {
  const navigate = useNavigate();

  const profileSections = [
    {
      title: 'Personal Information',
      titleGu: 'વ્યક્તિગત માહિતી',
      items: [
        { icon: User, label: 'નામ', value: 'રાજેશ પટેલ' },
        { icon: Phone, label: 'મોબાઇલ', value: '+91 98765 43210' },
        { icon: Mail, label: 'ઈમેલ', value: 'rajesh@example.com' },
        { icon: MapPin, label: 'સ્થળ', value: 'અમદાવાદ, ગુજરાત' },
        { icon: Calendar, label: 'જન્મ તારીખ', value: '15 જાન્યુઆરી 1995' },
      ],
    },
  ];

  const quickActions = [
    { icon: Heart, label: 'સેવ કરેલ પ્રોફાઈલ', labelEn: 'Saved Profiles', path: '/matrimony', color: 'text-pink-500 bg-pink-50' },
    { icon: Bookmark, label: 'સેવ કરેલ પોસ્ટ', labelEn: 'Saved Posts', path: '/yogigram', color: 'text-purple-500 bg-purple-50' },
    { icon: Settings, label: 'સેટિંગ્સ', labelEn: 'Settings', path: '/settings', color: 'text-blue-500 bg-blue-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Profile */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 safe-area-top pb-20">
        <div className="px-6 py-6 flex items-center justify-between">
          <h1 className="text-white font-gujarati font-bold text-2xl">મારી પ્રોફાઈલ</h1>
          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Card Overlapping Header */}
      <div className="px-6 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 font-gujarati">રાજેશ પટેલ</h2>
              <p className="text-sm text-gray-600">Rajesh Patel</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="px-3 py-1 bg-mint/10 text-deep-blue text-xs font-gujarati font-semibold rounded-full">
                  કાશ્યપ
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  28 વર્ષ
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-mint">24</p>
              <p className="text-xs text-gray-500 font-gujarati">પ્રોફાઈલ જોયા</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-royal-gold">12</p>
              <p className="text-xs text-gray-500 font-gujarati">રસ દાખવ્યો</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-deep-blue">8</p>
              <p className="text-xs text-gray-500 font-gujarati">મેસેજ</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(action.path)}
                className="premium-card p-4 flex flex-col items-center space-y-2 hover:shadow-elevated transition-all active:scale-95"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-gujarati font-semibold text-gray-800 leading-tight">
                    {action.label}
                  </p>
                  <p className="text-[10px] text-gray-500">{action.labelEn}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Profile Information */}
        {profileSections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + sectionIndex * 0.1 }}
            className="premium-card p-6 space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-gujarati font-bold text-gray-800">{section.titleGu}</h3>
                <p className="text-xs text-gray-500">{section.title}</p>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="text-deep-blue text-sm font-medium hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div key={itemIndex} className="flex items-center space-x-3 py-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-gujarati">{item.label}</p>
                      <p className="text-sm font-medium text-gray-800 font-gujarati">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Account Settings Link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate('/settings')}
          className="w-full premium-card p-4 flex items-center justify-between hover:shadow-elevated transition-all active:scale-98"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-deep-blue/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-deep-blue" />
            </div>
            <div className="text-left">
              <p className="font-gujarati font-semibold text-gray-800">સેટિંગ્સ અને એકાઉન્ટ</p>
              <p className="text-xs text-gray-500">Settings & Account Options</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </motion.button>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate('/')}
          className="w-full premium-card p-4 flex items-center justify-center space-x-2 hover:shadow-elevated transition-all active:scale-98 border-2 border-red-100"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span className="font-gujarati font-semibold text-red-500">લૉગઆઉટ કરો</span>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
