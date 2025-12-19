import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, Smartphone, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'success'>('request');
  const [errorMsg, setErrorMsg] = useState('');

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length !== 10) {
      setErrorMsg('કૃપા કરીને સાચો ૧૦ અંકનો મોબાઈલ નંબર નાખો.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const fakeEmail = `${mobile}@samaj.app`;
      
      // Supabase પાસવર્ડ રીસેટ લિંક મોકલશે (ઈમેલ પર જાય, પણ આપણે અહીં સક્સેસ બતાવીશું)
      const { error } = await supabase.auth.resetPasswordForEmail(fakeEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setStep('success');
    } catch (error: any) {
      console.error(error);
      setErrorMsg('આ મોબાઈલ નંબર રજીસ્ટર્ડ નથી અથવા કોઈ ભૂલ છે.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-deep-blue p-6 safe-area-top flex items-center space-x-4">
        <button onClick={() => navigate('/')} className="p-2 bg-white/10 rounded-full text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-white font-gujarati font-bold text-xl">પાસવર્ડ રીસેટ</h1>
      </div>

      <div className="flex-1 px-6 py-10">
        {step === 'request' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <KeyRound className="w-10 h-10 text-deep-blue" />
            </div>

            <div className="text-center mb-8">
              <h2 className="font-gujarati font-bold text-2xl text-gray-800 mb-2">પાસવર્ડ ભૂલી ગયા?</h2>
              <p className="font-gujarati text-gray-500 text-sm leading-relaxed">
                ચિંતા કરશો નહીં! તમારો રજીસ્ટર્ડ મોબાઈલ નંબર નાખો, અમે તમને પાસવર્ડ રીસેટ કરવાની લિંક મોકલીશું.
              </p>
            </div>

            <form onSubmit={handleResetRequest} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-gujarati mb-2 text-sm">મોબાઈલ નંબર</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10 અંકનો નંબર"
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati"
                    required
                  />
                </div>
                {errorMsg && <p className="text-red-500 text-xs mt-2 font-gujarati">{errorMsg}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-mint text-deep-blue font-gujarati font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex justify-center items-center"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'આગળ વધો'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="font-gujarati font-bold text-2xl text-gray-800 mb-2">વિનંતી મોકલાઈ ગઈ!</h2>
            <p className="font-gujarati text-gray-500 text-sm leading-relaxed mb-8">
              જો આ નંબર રજીસ્ટર્ડ હશે, તો તમને પાસવર્ડ રીસેટ કરવાની સૂચના મળશે. (નોંધ: હાલમાં આ ઈમેલ `${mobile}@samaj.app` પર લિંક મોકલે છે).
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-deep-blue text-white font-gujarati font-bold py-4 rounded-2xl"
            >
              લોગીન પેજ પર પાછા જાઓ
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}