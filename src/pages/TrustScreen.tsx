import { Calendar, Users, Heart, PartyPopper, MessageSquare, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { trustEvents } from '../data/mockData';
import BottomNav from '../components/BottomNav';

export default function TrustScreen() {
  const sections = [
    { icon: Calendar, title: 'સંમેલન', color: 'from-blue-400 to-cyan-500' },
    { icon: Users, title: 'સમૂહ લગ્ન', color: 'from-pink-400 to-rose-500' },
    { icon: Heart, title: 'સેવાકાર્ય', color: 'from-green-400 to-emerald-500' },
    { icon: PartyPopper, title: 'ઈવેન્ટ્સ', color: 'from-purple-400 to-indigo-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 safe-area-top px-6 py-6">
        <h1 className="text-white font-gujarati font-bold text-2xl">યોગી સમાજ ટ્રસ્ટ</h1>
        <p className="text-white/80 text-sm">સમાજ સેવા અને વિકાસ</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Trust Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-card p-8 bg-gradient-to-br from-royal-gold to-yellow-600 text-white overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-2">Trust Balance</p>
            <h2 className="text-4xl font-bold mb-4">₹2,45,680</h2>
            <p className="text-white/90 text-sm font-gujarati">
              સમાજ વિકાસ ફંડ • Community Development
            </p>
          </div>
        </motion.div>

        {/* Section Cards */}
        <div className="grid grid-cols-2 gap-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="premium-card p-6 hover:shadow-elevated transition-all active:scale-95"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-gujarati font-semibold text-gray-800 text-sm">
                  {section.title}
                </h3>
              </motion.button>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h3 className="font-gujarati font-bold text-gray-800 text-lg px-2">આગામી કાર્યક્રમો</h3>
          {trustEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card p-6 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-gujarati font-bold text-gray-800 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 font-gujarati mb-2">{event.description}</p>
                </div>
                <Calendar className="w-5 h-5 text-mint flex-shrink-0 ml-2" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <p className="text-gray-600 font-gujarati">
                    <span className="text-gray-500">તારીખ:</span> {event.date}
                  </p>
                  <p className="text-gray-600 font-gujarati">
                    <span className="text-gray-500">સ્થળ:</span> {event.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-mint/10 px-3 py-2 rounded-xl">
                  <Users className="w-4 h-4 text-deep-blue" />
                  <span className="text-sm font-semibold text-deep-blue">{event.attendees}</span>
                </div>
              </div>
              <button className="w-full bg-deep-blue text-white font-gujarati font-medium py-2.5 rounded-xl hover:bg-deep-blue/90 transition-colors">
                રજીસ્ટર કરો
              </button>
            </motion.div>
          ))}
        </div>

        {/* Youth Opinion Section */}
        <div className="premium-card p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="w-6 h-6 text-deep-blue" />
            <h3 className="font-gujarati font-bold text-gray-800">સમાજના યુવાનોનું મંતવ્ય</h3>
          </div>
          <textarea
            placeholder="તમારા વિચારો અને સૂચન અહીં લખો..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati resize-none"
          />
          <button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white font-gujarati font-semibold py-3 rounded-2xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all">
            <Send className="w-5 h-5" />
            <span>તમારું સૂચન મોકલો</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
