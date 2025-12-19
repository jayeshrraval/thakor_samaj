import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Info, Lock } from 'lucide-react';

export default function AboutScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'privacy' | 'terms'>('about');

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-deep-blue p-6 safe-area-top">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-1 bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white font-gujarati font-bold text-xl">માહિતી અને નિયમો</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white shadow-sm mb-4 sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-4 font-gujarati font-bold text-center text-sm ${
            activeTab === 'about' ? 'text-deep-blue border-b-2 border-deep-blue' : 'text-gray-500'
          }`}
        >
          એપ વિશે
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-4 font-gujarati font-bold text-center text-sm ${
            activeTab === 'privacy' ? 'text-deep-blue border-b-2 border-deep-blue' : 'text-gray-500'
          }`}
        >
          પ્રાઈવસી
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 py-4 font-gujarati font-bold text-center text-sm ${
            activeTab === 'terms' ? 'text-deep-blue border-b-2 border-deep-blue' : 'text-gray-500'
          }`}
        >
          નિયમો
        </button>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4">
        
        {/* ABOUT APP TAB */}
        {activeTab === 'about' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <div className="w-20 h-20 bg-deep-blue rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg">
                 <span className="text-3xl">🙏</span>
              </div>
              <h2 className="text-xl font-bold text-deep-blue font-gujarati">યોગી સમાજ એપ</h2>
              <p className="text-gray-500 text-sm">Version 1.0.0</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-3">
              <h3 className="font-bold text-gray-800 font-gujarati flex items-center">
                <Info className="w-5 h-5 mr-2 text-deep-blue" /> ઉદ્દેશ્ય
              </h3>
              <p className="text-gray-600 text-sm font-gujarati leading-relaxed">
                આ એપ્લિકેશનનો મુખ્ય ઉદ્દેશ્ય આપણા સમાજના તમામ પરિવારોને એક ડિજિટલ પ્લેટફોર્મ પર એકત્રિત કરવાનો છે. 
                જેથી મેટ્રિમોની, રોજગાર, શિક્ષણ અને સામાજિક પ્રસંગોમાં એકબીજાને મદદરૂપ થઈ શકાય.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
              <p className="text-gray-400 text-xs font-gujarati">Developed with ❤️ by YouWare</p>
            </div>
          </motion.div>
        )}

        {/* PRIVACY POLICY TAB */}
        {activeTab === 'privacy' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
               <div className="flex items-center space-x-2 text-deep-blue mb-2">
                 <Lock className="w-6 h-6" />
                 <h2 className="text-lg font-bold font-gujarati">તમારો ડેટા સુરક્ષિત છે</h2>
               </div>
               
               <div className="space-y-3">
                 <PolicyItem title="1. ડેટા કલેક્શન" content="અમે ફક્ત તમારું નામ, મોબાઈલ નંબર અને સમાજને લગતી જરૂરી માહિતી જ સેવ કરીએ છીએ." />
                 <PolicyItem title="2. ફોટા અને ડોક્યુમેન્ટ" content="તમારા ફોટા સુરક્ષિત સર્વર પર સ્ટોર થાય છે અને તમે ઈચ્છો ત્યારે તેને ડિલીટ કરી શકો છો." />
                 <PolicyItem title="3. ડેટા શેરિંગ" content="તમારો ડેટા કોઈ પણ ત્રીજી પાર્ટી (Third Party) ને વેચવામાં આવતો નથી." />
               </div>
            </div>
          </motion.div>
        )}

        {/* TERMS & CONDITIONS TAB */}
        {activeTab === 'terms' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
               <div className="flex items-center space-x-2 text-deep-blue mb-2">
                 <FileText className="w-6 h-6" />
                 <h2 className="text-lg font-bold font-gujarati">ઉપયોગના નિયમો</h2>
               </div>
               
               <div className="space-y-3">
                 <PolicyItem title="1. સાચી માહિતી" content="એપમાં રજીસ્ટ્રેશન કરતી વખતે સાચી અને સચોટ માહિતી આપવી ફરજિયાત છે." />
                 <PolicyItem title="2. સભ્યપદ" content="માત્ર આપણા સમાજના સભ્યો જ આ એપનો ઉપયોગ કરી શકશે. એડમિન પાસે એકાઉન્ટ બ્લોક કરવાનો હક રહેશે." />
                 <PolicyItem title="3. મર્યાદા" content="કોઈ પણ પ્રકારની અભદ્ર ભાષા કે પોસ્ટ મૂકવા બદલ કાયદેસરની કાર્યવાહી થઈ શકે છે." />
               </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

// Helper Component
function PolicyItem({ title, content }: { title: string, content: string }) {
  return (
    <div className="pb-3 border-b border-gray-100 last:border-0">
      <h4 className="font-bold text-gray-800 text-sm font-gujarati mb-1">{title}</h4>
      <p className="text-gray-500 text-xs font-gujarati leading-relaxed">{content}</p>
    </div>
  );
}