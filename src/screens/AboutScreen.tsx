import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ Handshake આઈકન ઈમ્પોર્ટ કર્યો
import { ArrowLeft, Info, ShieldCheck, FileText, Heart, Handshake } from 'lucide-react';

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
      
      {/* Header: Maroon with Gold Glow */}
      <div className="bg-[#800000] p-4 safe-area-top sticky top-0 z-10 shadow-md relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-50%] left-[-10%] w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="flex items-center space-x-4 relative z-10">
          <button onClick={() => navigate(-1)} className="p-1 text-white active:scale-90 transition-transform bg-white/10 rounded-full hover:bg-white/20">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white font-bold text-xl">માહિતી અને નિયમો</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex border-b sticky top-[64px] z-10 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-[15px] font-bold transition-all border-b-4 ${
              activeTab === tab.id 
                ? 'border-[#800000] text-[#800000]' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
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
            <div className="flex flex-col items-center py-8 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-[#800000] via-[#D4AF37] to-[#800000]"></div>
               
               {/* Logo Container with Handshake Icon */}
               <div className="w-24 h-24 rounded-3xl bg-[#D4AF37]/10 flex items-center justify-center mb-4 border-2 border-[#D4AF37] shadow-lg">
                   {/* ✅ અહીં Handshake આઈકન મૂક્યો (Maroon Color) */}
                   <Handshake className="w-14 h-14 text-[#800000]" strokeWidth={1.5} />
               </div>

               <h2 className="text-xl font-bold text-gray-800">ઠાકોર સમાજ સંગઠન</h2>
               <p className="text-[#D4AF37] text-sm font-bold tracking-wider mt-1">Version 1.0.0</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#800000] mb-3 flex items-center gap-2 text-lg">
                <Info size={20} /> અમારો હેતુ
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm text-justify">
                ગુજરાતના ઠાકોર સમાજને એકતાના તાંતણે બાંધવા અને સમાજના દરેક સભ્યને ડિજિટલ યુગમાં જોડાવા માટે આ પ્લેટફોર્મ તૈયાર કરવામાં આવ્યું છે. આ એપ દ્વારા મેટ્રિમોની, રોજગાર અને શિક્ષણ ક્ષેત્રે પરસ્પર મદદ પૂરી પાડવામાં આવશે.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 animate-in slide-in-from-right duration-300 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
               <ShieldCheck size={20} className="text-[#800000]" /> ડેટા પ્રાઈવસી
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p className="flex gap-2"><span className="text-[#D4AF37] font-bold">•</span> અમે યુઝરની પ્રાઈવસીનું પૂરેપૂરું સન્માન કરીએ છીએ.</p>
              <p className="flex gap-2"><span className="text-[#D4AF37] font-bold">•</span> તમારા ખાનગી ડેટા (મોબાઈલ નંબર, એડ્રેસ) કોઈ પણ તૃતીય પક્ષને વહેંચવામાં આવતા નથી.</p>
              <p className="flex gap-2"><span className="text-[#D4AF37] font-bold">•</span> એપમાં અપલોડ કરેલી માહિતી માત્ર રજીસ્ટર્ડ સમાજ સભ્યો જ જોઈ શકે છે.</p>
              <p className="flex gap-2"><span className="text-[#D4AF37] font-bold">•</span> તમે ગમે ત્યારે તમારી પ્રોફાઈલ ડીલીટ કરી શકો છો.</p>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 animate-in slide-in-from-right duration-300 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
               <FileText size={20} className="text-[#B8860B]" /> શરતો અને નિયમો
            </h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>૧. આ એપનો ઉપયોગ માત્ર ઠાકોર સમાજના સભ્યો માટે જ છે.</p>
              <p>૨. મેટ્રિમોની અને અન્ય ફોર્મમાં સાચી માહિતી જ આપવી.</p>
              <p>૩. કોઈ પણ સભ્ય સાથે અભદ્ર કે અસભ્ય વર્તન કાયદેસરની કાર્યવાહીને પાત્ર બનશે.</p>
              <p>૪. એડમિન પાસે કોઈ પણ શંકાસ્પદ પ્રોફાઈલને બ્લોક કરવાનો અધિકાર રહેશે.</p>
            </div>
          </div>
        )}

        {/* Final Professional Footer */}
        <div className="mt-16 text-center space-y-2 border-t pt-6">
            <p className="text-[10px] text-gray-400 font-bold flex items-center justify-center gap-1 uppercase tracking-widest">
              Developed with <Heart size={10} className="text-red-500 fill-red-500" /> by Thakor Samaj Sangathan Team
            </p>
            <p className="text-[9px] text-[#800000] italic font-gujarati">
              © 2025 ઠાકોર સમાજ. સર્વ હક સ્વાધીન.
            </p>
        </div>
      </div>
    </div>
  );
}