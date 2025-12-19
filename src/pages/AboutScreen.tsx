import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, ChevronDown, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Handshake } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function AboutScreen() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: 'યોગી સમાજ સંબંધ એપ્લિકેશન શું છે?',
      questionEn: 'What is Yogi Samaj Sambandh app?',
      answer: 'યોગી સમાજ સંબંધ એ રાવળ યોગી સમાજ માટે ખાસ બનાવેલ મેટ્રિમોની અને કમ્યુનિટી એપ્લિકેશન છે.',
    },
    {
      question: 'પ્રોફાઈલ કેવી રીતે બનાવવી?',
      questionEn: 'How to create a profile?',
      answer: 'મેટ્રિમોની સેક્શનમાં જઈને "મારી પ્રોફાઈલ" પર ક્લિક કરો અને જરૂરી માહિતી ભરો.',
    },
    {
      question: 'સબ્સ્ક્રિપ્શન કેવી રીતે લેવું?',
      questionEn: 'How to subscribe?',
      answer: 'સબ્સ્ક્રિપ્શન પેજ પર જઈને તમારી પસંદગીનો પ્લાન પસંદ કરો અને પેમેન્ટ કરો.',
    },
    {
      question: 'સપોર્ટ માટે કોને સંપર્ક કરવો?',
      questionEn: 'Who to contact for support?',
      answer: 'તમે અમને support@yogisamaj.com પર ઈમેલ કરી શકો છો અથવા +91 98765 43210 પર કૉલ કરી શકો છો.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top px-6 py-6">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-gujarati font-bold text-2xl">સહાય અને સપોર્ટ</h1>
            <p className="text-white/80 text-sm">Help & Support</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* App Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-8 text-center space-y-4"
        >
          <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-mint to-teal-500 flex items-center justify-center shadow-lg">
            <Handshake className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 font-gujarati mb-2">યોગી સમાજ સંબંધ</h2>
            <p className="text-sm text-gray-600 mb-4">Community Connection Platform</p>
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-full">
              <p className="text-xs text-gray-600">Version 1.0.0</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-700 font-gujarati leading-relaxed">
              રાવળ યોગી સમાજ માટે ખાસ બનાવેલ મેટ્રિમોની અને કમ્યુનિટી પ્લેટફોર્મ. સંસ્કૃતિ, સંબંધ અને સેવા.
            </p>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 space-y-4"
        >
          <h3 className="font-gujarati font-bold text-gray-800 mb-4">સંપર્ક માહિતી</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-deep-blue flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">support@yogisamaj.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-deep-blue flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-800">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-deep-blue flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500 font-gujarati">સરનામું</p>
                <p className="text-sm font-medium text-gray-800 font-gujarati">અમદાવાદ, ગુજરાત</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="font-gujarati font-bold text-gray-800 px-2">વારંવાર પૂછાતા પ્રશ્નો (FAQ)</h3>
          {faqs.map((faq, index) => (
            <div key={index} className="premium-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 pr-4">
                  <p className="font-gujarati font-semibold text-gray-800 mb-1">{faq.question}</p>
                  <p className="text-xs text-gray-500">{faq.questionEn}</p>
                </div>
                <motion.div
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-700 font-gujarati leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Legal Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card overflow-hidden"
        >
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="font-gujarati font-medium text-gray-800">શરતો અને નિયમો</span>
            </div>
          </button>
          <div className="border-t border-gray-100"></div>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="font-gujarati font-medium text-gray-800">ગોપનીયતા નીતિ</span>
            </div>
          </button>
        </motion.div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-mint/10 border border-mint/20 rounded-2xl p-4"
        >
          <p className="text-sm text-deep-blue font-gujarati text-center leading-relaxed">
            <strong>નોંધ:</strong> Right now I only need the complete UI/UX design; no backend or functionality is required at this stage.
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
