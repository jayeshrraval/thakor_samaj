import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Zap, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '../components/BottomNav';

export default function SubscriptionScreen() {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'monthly',
      name: 'માસિક પ્લાન',
      nameEn: 'Monthly Plan',
      price: '₹49',
      period: '/મહિનો',
      color: 'from-mint to-teal-500',
      icon: Zap,
      badge: null,
    },
    {
      id: 'yearly',
      name: 'વાર્ષિક પ્લાન',
      nameEn: 'Yearly Plan',
      price: '₹480',
      period: '/વર્ષ',
      color: 'from-royal-gold to-yellow-600',
      icon: Crown,
      badge: 'Best Value',
      savings: '₹108 બચત',
    },
  ];

  const benefits = [
    'અમર્યાદિત પ્રોફાઈલ જોવા',
    'Unlimited profile views',
    'પ્રાયોરિટી સપોર્ટ',
    'Priority customer support',
    'એડવાન્સ સર્ચ ફિલ્ટર્સ',
    'Advanced search filters',
    'મેસેજ રીડ રીસીપ્ટ',
    'Message read receipts',
    'પ્રોફાઈલ હાઈલાઈટ',
    'Profile highlight feature',
    'એડ ફ્રી અનુભવ',
    'Ad-free experience',
  ];

  const handleSubscribe = (planName: string) => {
    alert(`તમે ${planName} પસંદ કર્યો છે. પેમેન્ટ સુવિધા ટૂંક સમયમાં શરૂ થશે.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-blue via-[#1A8FA3] to-mint pb-24">
      {/* Header */}
      <div className="safe-area-top px-6 py-8 text-center relative">
        <button 
            onClick={() => navigate(-1)} 
            className="absolute top-8 left-6 p-2 bg-white/20 rounded-full text-white"
        >
            <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block mb-4"
        >
          <div className="w-20 h-20 rounded-full bg-royal-gold/20 flex items-center justify-center mx-auto">
            <Crown className="w-10 h-10 text-royal-gold" />
          </div>
        </motion.div>
        <h1 className="text-white font-gujarati font-bold text-3xl mb-2">સબ્સ્ક્રિપ્શન પ્લાન્સ</h1>
        <p className="text-white/80 text-sm">પ્રીમિયમ સુવિધાઓનો લાભ લો</p>
      </div>

      <div className="px-6 space-y-6">
        {/* Plan Cards */}
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="premium-card p-6 relative overflow-hidden bg-white rounded-3xl shadow-lg"
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-royal-gold to-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-gold">
                  {plan.badge}
                </div>
              )}

              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="font-gujarati font-bold text-xl text-gray-800 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600">{plan.nameEn}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-deep-blue">{plan.price}</span>
                  <span className="text-gray-600 font-gujarati">{plan.period}</span>
                </div>
                {plan.savings && (
                  <p className="text-green-600 text-sm font-gujarati font-semibold mt-2">
                    {plan.savings}
                  </p>
                )}
              </div>

              <button 
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full bg-gradient-to-r ${plan.color} text-white font-gujarati font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95`}
              >
                પ્લાન સબ્સ્ક્રાઇબ કરો
              </button>
            </motion.div>
          );
        })}

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6 bg-white rounded-3xl"
        >
          <h3 className="font-gujarati font-bold text-xl text-gray-800 mb-6">
            સબ્સ્ક્રિપ્શન લાભો
          </h3>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-start space-x-3"
              >
                <div className="w-6 h-6 rounded-full bg-mint/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-deep-blue" strokeWidth={3} />
                </div>
                <p className={`text-gray-700 ${index % 2 === 0 ? 'font-gujarati font-medium' : 'text-sm'}`}>
                  {benefit}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-white/60 text-xs space-y-2 py-6"
        >
          <p className="font-gujarati">કોઈપણ સમયે કેન્સલ કરી શકાય છે</p>
          <p>Cancel anytime • No hidden charges</p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}