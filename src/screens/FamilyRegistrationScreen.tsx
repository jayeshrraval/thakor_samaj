import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, MapPin, User, ChevronDown, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

interface FamilyMember {
  id: string;
  memberName: string;
  relationship: string;
  gender: string;
}

interface FormErrors {
  headName?: string;
  subSurname?: string;
  gol?: string;
  members?: string;
}

const relationshipOptions = [
  { value: 'પત્ની', label: 'પત્ની' },
  { value: 'પુત્ર', label: 'પુત્ર' },
  { value: 'પુત્રી', label: 'પુત્રી' },
  { value: 'પિતા', label: 'પિતા' },
  { value: 'માતા', label: 'માતા' },
  { value: 'ભાઈ', label: 'ભાઈ' },
  { value: 'બહેન', label: 'બહેન' },
  { value: 'અન્ય', label: 'અન્ય' },
];

const genderOptions = [
  { value: 'પુરુષ', label: 'પુરુષ' },
  { value: 'સ્ત્રી', label: 'સ્ત્રી' },
];

// ❌ golOptions હટાવી દીધું છે

export default function FamilyRegistrationScreen() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Form state
  const [headName, setHeadName] = useState('');
  const [subSurname, setSubSurname] = useState('');
  const [gol, setGol] = useState(''); // હવે આમાં યુઝર જે લખશે તે સ્ટોર થશે
  const [village, setVillage] = useState('');
  const [taluko, setTaluko] = useState('');
  const [district, setDistrict] = useState('');
  const [currentResidence, setCurrentResidence] = useState('');

  // Members state
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', memberName: '', relationship: '', gender: '' },
  ]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const addMember = () => {
    setMembers([
      ...members,
      { id: Date.now().toString(), memberName: '', relationship: '', gender: '' },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const updateMember = (id: string, field: keyof FamilyMember, value: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!headName.trim()) newErrors.headName = 'મોભીનું નામ જરૂરી છે';
    if (!subSurname.trim()) newErrors.subSurname = 'પેટા અટક જરૂરી છે';
    if (!gol.trim()) newErrors.gol = 'ગોળ લખવું જરૂરી છે'; // ગોળ માટે વેલિડેશન

    const validMembers = members.filter((m) => m.memberName.trim() && m.relationship && m.gender);
    if (validMembers.length === 0) newErrors.members = 'ઓછામાં ઓછો એક સભ્ય પૂરી માહિતી સાથે ઉમેરો';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('પ્લીઝ લોગીન કરો');
        return;
      }

      // 1. Insert Family Data
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert([
          {
            head_name: headName,
            sub_surname: subSurname,
            gol: gol,
            village: village,
            district: district,
            total_members: members.length + 1,
          }
        ])
        .select()
        .single();

      if (familyError) throw familyError;

      const familyId = familyData.id;

      // 2. Prepare Members Data
      const validMembers = members
        .filter((m) => m.memberName.trim())
        .map((m) => ({
          family_id: familyId,
          member_name: m.memberName,
          relationship: m.relationship,
          gender: m.gender,
        }));

      // 3. Insert Members Data
      if (validMembers.length > 0) {
        const { error: memberError } = await supabase
          .from('members')
          .insert(validMembers);
        
        if (memberError) throw memberError;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/family-list');
      }, 2000);

    } catch (error: any) {
      console.error('Error:', error);
      alert('રજીસ્ટ્રેશનમાં ભૂલ છે: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const SelectDropdown = ({ value, options, onChange, placeholder, dropdownId }: any) => {
    const isOpen = openDropdown === dropdownId;
    const optionList = typeof options[0] === 'string'
      ? options.map((o: string) => ({ value: o, label: o }))
      : options;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(isOpen ? null : dropdownId)}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl flex items-center justify-between bg-white focus:outline-none focus:ring-2 focus:ring-mint"
        >
          <span className={`font-gujarati ${value ? 'text-gray-800' : 'text-gray-400'}`}>
            {value || placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-elevated border border-gray-100 max-h-60 overflow-y-auto"
            >
              {optionList.map((opt: any) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpenDropdown(null); }}
                  className={`w-full px-4 py-3 text-left font-gujarati hover:bg-mint/10 flex items-center justify-between ${
                    value === opt.value ? 'bg-mint/10 text-deep-blue' : 'text-gray-700'
                  }`}
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
    <div className="min-h-screen bg-gray-50 pb-24" onClick={() => setOpenDropdown(null)}>
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-gujarati font-bold text-2xl">પરિવાર રજીસ્ટ્રેશન</h1>
              <p className="text-white/80 text-sm font-gujarati">તમારા પરિવારની માહિતી નોંધો</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Family Head Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-deep-blue/10 flex items-center justify-center">
              <User className="w-5 h-5 text-deep-blue" />
            </div>
            <h2 className="font-gujarati font-bold text-gray-800 text-lg">પરિવારની મુખ્ય માહિતી</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 font-gujarati mb-2">પરિવારના મોભીનું પૂરું નામ <span className="text-red-500">*</span></label>
              <input type="text" value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder="મોભીનું નામ લખો" className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati ${errors.headName ? 'border-red-400' : 'border-gray-200'}`} />
            </div>
            <div>
              <label className="block text-sm text-gray-600 font-gujarati mb-2">પેટા અટક <span className="text-red-500">*</span></label>
              <input type="text" value={subSurname} onChange={(e) => setSubSurname(e.target.value)} placeholder="પેટા અટક લખો" className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati ${errors.subSurname ? 'border-red-400' : 'border-gray-200'}`} />
            </div>
            
            {/* ✅ અહિયાં ફેરફાર કર્યો: Input Box મૂક્યું છે */}
            <div>
              <label className="block text-sm text-gray-600 font-gujarati mb-2">ગોળ <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={gol} 
                onChange={(e) => setGol(e.target.value)} 
                placeholder="ગોળ લખો (દા.ત. કાશ્યપ, ભારદ્વાજ)" 
                className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-mint font-gujarati ${errors.gol ? 'border-red-400' : 'border-gray-200'}`} 
              />
              {errors.gol && (
                <p className="text-red-500 text-sm mt-1 font-gujarati flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {errors.gol}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Family Members */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-deep-blue" />
              <h2 className="font-gujarati font-bold text-gray-800 text-lg">પરિવારના સભ્યો</h2>
            </div>
            <span className="text-sm text-gray-500 font-gujarati">{members.length} સભ્ય</span>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <motion.div key={member.id} className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-deep-blue font-gujarati font-semibold">સભ્ય #{index + 1}</span>
                  {members.length > 1 && (
                    <button type="button" onClick={() => removeMember(member.id)} className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
                <input type="text" value={member.memberName} onChange={(e) => updateMember(member.id, 'memberName', e.target.value)} placeholder="સભ્યનું નામ" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none bg-white font-gujarati" />
                <div className="grid grid-cols-2 gap-3">
                  <SelectDropdown value={member.relationship} options={relationshipOptions} onChange={(val: string) => updateMember(member.id, 'relationship', val)} placeholder="સંબંધ" dropdownId={`rel-${member.id}`} />
                  <SelectDropdown value={member.gender} options={genderOptions} onChange={(val: string) => updateMember(member.id, 'gender', val)} placeholder="લિંગ" dropdownId={`gen-${member.id}`} />
                </div>
              </motion.div>
            ))}
          </div>
          <button type="button" onClick={addMember} className="w-full py-3 border-2 border-dashed border-mint text-deep-blue rounded-2xl font-gujarati font-medium flex items-center justify-center space-x-2 hover:bg-mint/5">
            <Plus className="w-5 h-5" /> <span>સભ્ય ઉમેરો +</span>
          </button>
        </motion.div>

        {/* Location Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card p-6 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-royal-gold" />
            <h2 className="font-gujarati font-bold text-gray-800 text-lg">સ્થળની માહિતી</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="ગામ" className="w-full px-4 py-3 border border-gray-200 rounded-2xl font-gujarati" />
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="જિલ્લો" className="w-full px-4 py-3 border border-gray-200 rounded-2xl font-gujarati" />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-deep-blue to-[#1A8FA3] text-white font-gujarati font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-98 disabled:opacity-70 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? 'રજીસ્ટર થઈ રહ્યું છે...' : 'પરિવાર રજીસ્ટર કરો'}
        </motion.button>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-32 left-6 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center space-x-3 z-50">
            <Check className="w-6 h-6" />
            <div>
              <p className="font-gujarati font-semibold">સફળતા!</p>
              <p className="text-sm font-gujarati opacity-90">પરિવાર સફળતાપૂર્વક રજીસ્ટર થયો</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}