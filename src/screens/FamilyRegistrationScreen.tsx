import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, MapPin, User, ChevronDown, Check, ArrowLeft, Loader2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

interface FamilyMember {
  id: string;
  memberName: string;
  relationship: string;
  gender: string;
}

const relationshipOptions = [
  { value: 'પત્ની', label: 'પત્ની' }, { value: 'પુત્ર', label: 'પુત્ર' },
  { value: 'પુત્રી', label: 'પુત્રી' }, { value: 'પુત્રવધૂ', label: 'પુત્રવધૂ' },
  { value: 'પૌત્ર', label: 'પૌત્ર' }, { value: 'પૌત્રી', label: 'પૌત્રી' },
  { value: 'પિતા', label: 'પિતા' }, { value: 'માતા', label: 'માતા' },
  { value: 'ભાઈ', label: 'ભાઈ' }, { value: 'બહેન', label: 'બહેન' },
  { value: 'અન્ય', label: 'અન્ય' },
];

const genderOptions = [
  { value: 'પુરુષ', label: 'પુરુષ' }, { value: 'સ્ત્રી', label: 'સ્ત્રી' },
];

export default function FamilyRegistrationScreen() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [headName, setHeadName] = useState('');
  const [subSurname, setSubSurname] = useState('');
  const [gol, setGol] = useState('');
  const [village, setVillage] = useState('');
  const [taluko, setTaluko] = useState('');
  const [district, setDistrict] = useState('');
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', memberName: '', relationship: '', gender: '' },
  ]);

  const addMember = () => {
    setMembers([...members, { id: Date.now().toString(), memberName: '', relationship: '', gender: '' }]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: keyof FamilyMember, value: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = async () => {
    if (!headName.trim() || !subSurname.trim() || !gol.trim()) {
      alert('મહેરબાની કરીને બધી ફરજિયાત (*) વિગતો ભરો');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('લોગીન કરવું જરૂરી છે');

      // ✅ બધા સભ્યોને 'families' ટેબલના ફોર્મેટમાં તૈયાર કરો
      const finalData = members
        .filter((m) => m.memberName.trim())
        .map((m) => ({
          user_id: user.id,
          head_name: headName,
          sub_surname: subSurname,
          gol: gol,
          village: village,
          taluko: taluko,
          district: district,
          member_name: m.memberName,
          relationship: m.relationship,
          gender: m.gender
        }));

      if (finalData.length === 0) throw new Error('ઓછામાં ઓછા એક સભ્યનું નામ લખો');

      // ✅ એક જ ટેબલમાં બધો ડેટા ઇન્સર્ટ કરો
      const { error } = await supabase
        .from('families')
        .insert(finalData);

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => navigate('/family-list'), 2000);

    } catch (error: any) {
      alert('ભૂલ: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectDropdown = ({ value, options, onChange, placeholder, dropdownId }: any) => {
    const isOpen = openDropdown === dropdownId;
    return (
      <div className="relative">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpenDropdown(isOpen ? null : dropdownId); }}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl flex items-center justify-between bg-white focus:ring-2 focus:ring-mint transition-all"
        >
          <span className={`font-gujarati ${value ? 'text-gray-800' : 'text-gray-400'}`}>
            {value || placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto"
            >
              {options.map((opt: any) => (
                <button
                  key={opt.value} type="button"
                  onClick={() => { onChange(opt.value); setOpenDropdown(null); }}
                  className="w-full px-4 py-3 text-left font-gujarati hover:bg-gray-50 flex items-center justify-between"
                >
                  {opt.label}
                  {value === opt.value && <Check className="w-4 h-4 text-deep-blue" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32" onClick={() => setOpenDropdown(null)}>
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6 flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-gujarati font-bold text-2xl">પરિવાર રજીસ્ટ્રેશન</h1>
            <p className="text-white/80 text-sm font-gujarati">બધી વિગત એકસાથે સેવ થશે</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 font-gujarati">
        {/* Step 1: Head Info */}
        <div className="premium-card p-6 space-y-4 bg-white rounded-3xl shadow-sm">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><User size={20}/> મુખ્ય માહિતી</h2>
          <input type="text" value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder="મોભીનું પૂરું નામ *" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" />
          <input type="text" value={subSurname} onChange={(e) => setSubSurname(e.target.value)} placeholder="પેટા અટક *" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" />
          <input type="text" value={gol} onChange={(e) => setGol(e.target.value)} placeholder="ગોળ (દા.ત. કાશ્યપ) *" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" />
        </div>

        {/* Step 2: Members */}
        <div className="premium-card p-6 space-y-4 bg-white rounded-3xl shadow-sm">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><Users size={20}/> પરિવારના સભ્યોની યાદી</h2>
          {members.map((member, index) => (
            <div key={member.id} className="bg-gray-50 p-4 rounded-2xl space-y-3 relative border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">સભ્ય #{index + 1}</span>
                {members.length > 1 && <button onClick={() => removeMember(member.id)}><Trash2 className="w-4 h-4 text-red-400" /></button>}
              </div>
              <input type="text" value={member.memberName} onChange={(e) => updateMember(member.id, 'memberName', e.target.value)} placeholder="સભ્યનું નામ" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                <SelectDropdown value={member.relationship} options={relationshipOptions} onChange={(v:any) => updateMember(member.id, 'relationship', v)} placeholder="સંબંધ" dropdownId={`rel-${member.id}`} />
                <SelectDropdown value={member.gender} options={genderOptions} onChange={(v:any) => updateMember(member.id, 'gender', v)} placeholder="લિંગ" dropdownId={`gen-${member.id}`} />
              </div>
            </div>
          ))}
          <button onClick={addMember} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-deep-blue flex items-center justify-center gap-2 font-bold">
            <Plus size={18} /> બીજા સભ્ય ઉમેરો
          </button>
        </div>

        {/* Step 3: Location */}
        <div className="premium-card p-6 space-y-4 bg-white rounded-3xl shadow-sm">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><MapPin size={20}/> રહેઠાણની વિગત</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="ગામ" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" />
            <input type="text" value={taluko} onChange={(e) => setTaluko(e.target.value)} placeholder="તાલુકો" className="w-full px-4 py-3 border border-gray-200 rounded-2xl" />
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="જિલ્લો" className="w-full px-4 py-3 border border-gray-200 rounded-2xl col-span-2" />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-deep-blue text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'બધી માહિતી સેવ કરો'}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}