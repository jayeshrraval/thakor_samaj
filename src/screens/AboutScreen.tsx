import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, ShieldCheck, FileText, Heart, Globe, Mail } from 'lucide-react';

export default function AboutScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'એપ વિશે' },
    { id: 'privacy', label: 'પ્રાઈવસી' },
    { id: 'rules', label: 'નિયમો' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-gujarati">
      {/* Header */}
      <div className="bg-[#075e54] p-4 safe-area-top sticky top-0 z-10 shadow-md">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-1 text-white active:scale-90 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white font-bold text-xl">માહિતી અને નિયમો</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex border-b sticky top-[64px] z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-[15px] font-bold transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'border-[#075e54] text-[#075e54]' 
                : 'border-transparent text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col items-center py-8 bg-white rounded-3xl shadow-sm border border-gray-100">
               <img 
                 src="/icon-192x192.png" 
                 alt="App Icon" 
                 className="w-20 h-20 rounded-2xl shadow-lg mb-4 object-cover"
                 onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext y='20' font-size='20'%3E🙏%3C/text%3E%3C/svg%3E"; }}
               />
               <h2 className="text-xl font-bold text-gray-800">યોગી સમાજ એપ</h2>
               <p className="text-gray-400 text-sm">Version 1.0.0</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#075e54] mb-3 flex items-center gap-2">
                <Info size={18} /> અમારો હેતુ
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                રાવળ યોગી સમાજને એકતાના તાંતણે બાંધવા અને સમાજના દરેક સભ્યને ડિજિટલ યુગમાં જોડાવા માટે આ પ્લેટફોર્મ તૈયાર કરવામાં આવ્યું છે. આ એપ દ્વારા મેટ્રિમોની, રોજગાર અને શિક્ષણ ક્ષેત્રે પરસ્પર મદદ પૂરી પાડવામાં આવશે.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 animate-in slide-in-from-right duration-300">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
               <ShieldCheck size={20} className="text-green-600" /> ડેટા પ્રાઈવસી
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>• અમે યુઝરની પ્રાઈવસીનું પૂરેપૂરું સન્માન કરીએ છીએ.</p>
              <p>• તમારા ખાનગી ડેટા (મોબાઈલ નંબર, એડ્રેસ) કોઈ પણ તૃતીય પક્ષને વહેંચવામાં આવતા નથી.</p>
              <p>• એપમાં અપલોડ કરેલી માહિતી માત્ર રજીસ્ટર્ડ સમાજ સભ્યો જ જોઈ શકે છે.</p>
              <p>• તમે ગમે ત્યારે તમારી પ્રોફાઈલ ડીલીટ કરી શકો છો.</p>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 animate-in slide-in-from-right duration-300">
            <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
               <FileText size={20} className="text-orange-600" /> શરતો અને નિયમો
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>૧. આ એપનો ઉપયોગ માત્ર રાવળ યોગી સમાજના સભ્યો માટે જ છે.</p>
              <p>૨. મેટ્રિમોની અને અન્ય ફોર્મમાં સાચી માહિતી જ આપવી.</p>
              <p>૩. કોઈ પણ સભ્ય સાથે અભદ્ર કે અસભ્ય વર્તન કાયદેસરની કાર્યવાહીને પાત્ર બનશે.</p>
              <p>૪. એડમિન પાસે કોઈ પણ શંકાસ્પદ પ્રોફાઈલને બ્લોક કરવાનો અધિકાર રહેશે.</p>
            </div>
          </div>
        )}

        {/* ✅ Final Professional Footer */}
        <div className="mt-16 text-center space-y-2 border-t pt-6">
            <p className="text-[10px] text-gray-400 font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
              Developed with <Heart size={10} className="text-red-500 fill-red-500" /> by Raval Yogi Samaj Team
            </p>
            <p className="text-[9px] text-gray-300 italic font-gujarati">
              © 2025 રાવળ યોગી સમાજ. સર્વ હક સ્વાધીન.
            </p>
        </div>
      </div>
    </div>
  );
}