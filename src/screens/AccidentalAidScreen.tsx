import { ArrowLeft, AlertTriangle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    title: 'હેલ્પલાઇન સંપર્ક',
    description: 'આપત્તિ વખતે તરત સંપર્ક કરો',
  },
  {
    title: 'પરિસ્થિતિની તપાસ',
    description: 'જરૂરી માહિતી અને ચકાસણી',
  },
  {
    title: 'સીધી આર્થિક સહાય',
    description: 'જરૂર મુજબ સહાય આપવામાં આવશે',
  },
];

export default function AccidentalAidScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0B4F6C] to-[#1A8FA3] rounded-b-3xl px-6 pt-12 pb-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="font-gujarati text-2xl font-bold text-white leading-snug">
          અકસ્માત આર્થિક સહાય યોજના
        </h1>
        <p className="font-gujarati text-lg text-teal-100 mt-3">
          આપત્તિના સમયે જ્ઞાતિનો સધિયારો
        </p>
      </header>

      <main className="px-6 pt-8 pb-28 space-y-8">
        {/* Disclaimer */}
        <section className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-7 h-7 text-orange-500" />
            </div>
            <p className="font-gujarati text-lg text-gray-700 leading-relaxed">
              નોંધ: આ યોજનાનો લાભ માત્ર આર્થિક રીતે નબળા અને જરૂરિયાતમંદ પરિવારો માટે જ છે.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-5 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[#0B4F6C] flex items-center justify-center text-white font-semibold text-lg">
                {index + 1}
              </div>
              <div>
                <p className="font-gujarati text-xl font-semibold text-gray-800 leading-snug">
                  {step.title}
                </p>
                <p className="font-gujarati text-base text-gray-600 mt-2 leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-5">
        <button
          type="button"
          onClick={() => window.open('tel:+919000000000')}
          className="w-full bg-[#0B4F6C] text-white rounded-2xl py-4 flex items-center justify-center gap-3 text-lg font-gujarati font-semibold shadow-lg"
        >
          <Phone className="w-6 h-6" />
          તાત્કાલિક સહાય માટે કોલ કરો
        </button>
      </div>
    </div>
  );
}
