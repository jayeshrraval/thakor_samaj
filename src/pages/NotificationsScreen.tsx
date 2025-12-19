import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function NotificationsScreen() {
  const navigate = useNavigate();

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'profile':
        return 'bg-pink-50';
      case 'message':
        return 'bg-blue-50';
      case 'event':
        return 'bg-purple-50';
      case 'like':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-mint to-teal-500 safe-area-top px-6 py-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-gujarati font-bold text-2xl">નોટીફિકેશન</h1>
            <p className="text-white/80 text-sm">Notifications Center</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="premium-card p-4 hover:shadow-elevated transition-all active:scale-98 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              <div className={`w-12 h-12 rounded-2xl ${getIconBgColor(notification.type)} flex items-center justify-center flex-shrink-0 text-2xl`}>
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-gujarati font-semibold text-gray-800 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 font-gujarati leading-relaxed mb-2">
                  {notification.description}
                </p>
                <p className="text-xs text-gray-400 font-gujarati">{notification.time}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State */}
        {notifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔔</span>
            </div>
            <h3 className="font-gujarati font-bold text-gray-800 mb-2">કોઈ નોટીફિકેશન નથી</h3>
            <p className="text-sm text-gray-500">No notifications yet</p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
