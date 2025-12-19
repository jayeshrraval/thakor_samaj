import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Heart, Info, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

export default function NotificationsScreen() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    markAllAsRead(); // સ્ક્રીન ખોલે એટલે બધું વંચાઈ ગયું ગણાય
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }); // નવા ઉપર

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);
    }
  };

  // નોટિફિકેશન પર ક્લિક કરતા ક્યાં જવું?
  const handleNotificationClick = (type: string) => {
    if (type === 'request') {
      navigate('/requests');
    } else if (type === 'profile') {
      navigate('/profile');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'request': return <Heart className="w-6 h-6 text-pink-500" />;
      case 'welcome': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Bell className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'request': return 'bg-pink-50';
      case 'welcome': return 'bg-green-50';
      default: return 'bg-blue-50';
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
            <p className="text-white/80 text-sm">તમારા અપડેટ્સ</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-3">
        {loading ? (
           <div className="flex justify-center pt-10">
             <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
           </div>
        ) : notifications.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="premium-card p-12 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-gujarati font-bold text-gray-800 mb-2">કોઈ નોટીફિકેશન નથી</h3>
            <p className="text-sm text-gray-500 font-gujarati">
              જ્યારે કોઈ અપડેટ આવશે ત્યારે અહીં દેખાશે.
            </p>
          </motion.div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleNotificationClick(notification.type)}
              className={`premium-card p-4 hover:shadow-elevated transition-all active:scale-98 cursor-pointer ${
                !notification.is_read ? 'border-l-4 border-teal-500 bg-white' : 'bg-gray-50/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-12 h-12 rounded-2xl ${getBgColor(notification.type)} flex items-center justify-center flex-shrink-0`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-gujarati font-semibold text-gray-800 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-gujarati leading-relaxed mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 font-gujarati">
                    {new Date(notification.created_at).toLocaleDateString('gu-IN')} • {new Date(notification.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                {!notification.is_read && (
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}