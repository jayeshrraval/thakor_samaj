import { User, Globe, Bell, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function SettingsScreen() {
  const navigate = useNavigate();

  const settingsGroups = [
    {
      title: 'Account',
      titleGu: 'એકાઉન્ટ',
      items: [
        { icon: User, label: 'Edit Profile', labelGu: 'પ્રોફાઈલ એડિટ કરો', path: '/profile' },
        { icon: Globe, label: 'Change Language', labelGu: 'ભાષા બદલો', action: 'language' },
      ],
    },
    {
      title: 'Preferences',
      titleGu: 'પસંદગી',
      items: [
        { icon: Bell, label: 'Notification Preferences', labelGu: 'નોટીફિકેશન સેટિંગ', action: 'notifications' },
        { icon: Lock, label: 'Privacy', labelGu: 'પ્રાઈવસી', action: 'privacy' },
      ],
    },
    {
      title: 'Support',
      titleGu: 'સહાય',
      items: [
        { icon: HelpCircle, label: 'Help & Support', labelGu: 'સહાય અને સપોર્ટ', path: '/about' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">સેટિંગ્સ</h1>
        <p className="text-white/80 text-sm">Settings & Account Options</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
            className="space-y-3"
          >
            <div className="px-2">
              <h3 className="font-gujarati font-bold text-gray-800">{group.titleGu}</h3>
              <p className="text-xs text-gray-500">{group.title}</p>
            </div>
            <div className="premium-card overflow-hidden">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={() => item.path && navigate(item.path)}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      itemIndex !== group.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-gujarati font-medium text-gray-800">{item.labelGu}</p>
                        <p className="text-xs text-gray-500">{item.label}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/')}
          className="w-full premium-card p-4 flex items-center justify-center space-x-3 hover:shadow-elevated transition-all active:scale-98 border-2 border-red-100"
        >
          <LogOut className="w-6 h-6 text-red-500" />
          <span className="font-gujarati font-semibold text-red-500 text-lg">લૉગઆઉટ કરો</span>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}
