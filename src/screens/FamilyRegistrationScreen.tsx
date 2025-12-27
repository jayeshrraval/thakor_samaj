import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, MapPin, User, ChevronDown, Check, ArrowLeft, Loader2, Phone } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

interface FamilyMember {
  id: string;
  memberName: string;
  relationship: string;
  gender: string;
  memberMobile: string;
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [headName, setHeadName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [subSurname, setSubSurname] = useState('');
  const [gol, setGol] = useState('');
  const [village, setVillage] = useState('');
  const [taluko, setTaluko] = useState('');
  const [district, setDistrict] = useState('');
  
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: `new-${Date.now()}`, memberName: '', relationship: '', gender: '', memberMobile: '' },
  ]);

  useEffect(() => {
    loadExistingFamily();
  }, []);

  const resetForm = () => {
    setHeadName('');
    setMobileNumber('');
    setSubSurname('');
    setGol('');
    setVillage('');
    setTaluko('');
    setDistrict('');
    setMembers([{ id: `new-${Date.now()}`, memberName: '', relationship: '', gender: '', memberMobile: '' }]);
    setIsEditMode(false);
  };

  // ✅ તારું ઓરિજિનલ લોજિક: મોબાઈલ નંબર મેચિંગ
  const loadExistingFamily = async () => {
    try {
      setLoadingData(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      // ૧. લોગિન થયેલા યુઝરનો નંબર લો
      let userMobile = user.phone || user.user_metadata?.mobile_number || '';
      userMobile = userMobile.replace(/[^0-9]/g, '').slice(-10);

      if (!userMobile) {
        setLoadingData(false);
        return;
      }

      // ૨. ચેક કરો કે આ નંબર મોભી (mobile_number) કે સભ્ય (member_mobile) માં છે?
      const { data: matchedRecords, error: matchError } = await supabase
        .from('families')
        .select('mobile_number')
        .or(`mobile_number.eq.${userMobile},member_mobile.eq.${userMobile}`)
        .limit(1);

      if (matchError) throw matchError;

      // ૩. જો મેચ મળે, તો મોભીના નંબરથી આખી ફેમિલીનો ડેટા ખેંચો
      if (matchedRecords && matchedRecords.length > 0) {
        const foundHeadMobile = matchedRecords[0].mobile_number;

        const { data: fullFamily, error: fetchError } = await supabase
          .from('families')
          .select('*')
          .eq('mobile_number', foundHeadMobile);

        if (fetchError) throw fetchError;

        if (fullFamily && fullFamily.length > 0) {
          setIsEditMode(true);
          const headData = fullFamily[0];
          setHeadName(headData.head_name || '');
          setMobileNumber(headData.mobile_number || '');
          setSubSurname(headData.sub_surname || '');
          setGol(headData.gol || '');
          setVillage(headData.village || '');
          setTaluko(headData.taluko || '');
          setDistrict(headData.district || '');

          const loadedMembers = fullFamily.map((m: any) => ({
             id: m.id,
             memberName: m.member_name || '',
             relationship: m.relationship || '',
             gender: m.gender || '',
             memberMobile: m.member_mobile || ''
          }));

          setMembers(loadedMembers);
        }
      } else {
        resetForm();
      }
    } catch (error) {
      console.error('Error loading family:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const addMember = () => {
    setMembers([...members, { id: `new-${Date.now()}`, memberName: '', relationship: '', gender: '', memberMobile: '' }]);
  };

  const removeMember = async (id: string) => {
    if (members.length === 1) return;
    if (!id.toString().startsWith('new-')) {
       if(confirm("શું તમે આ સભ્યને કાયમી માટે ડીલીટ કરવા માંગો છો?")) {
          await supabase.from('families').delete().eq('id', id);
       } else { return; }
    }
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: keyof FamilyMember, value: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleSubmit = async () => {
    if (!headName.trim() || !subSurname.trim() || !gol.trim() || !mobileNumber.trim()) {
      alert('મહેરબાની કરીને બધી ફરજિયાત (*) વિગતો ભરો');
      return;
    }
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('લોગીન કરવું જરૂરી છે');

      const finalData = members
        .filter((m) => m.memberName.trim())
        .map((m) => {
            const baseObj: any = {
                user_id: user.id,
                head_name: headName,
                mobile_number: mobileNumber,
                sub_surname: subSurname,
                gol: gol,
                village: village,
                taluko: taluko,
                district: district,
                member_name: m.memberName,
                relationship: m.relationship,
                gender: m.gender,
                member_mobile: m.memberMobile
            };
            
            // ✅ UUID Fix: નવી ID હોય તો ડેટાબેઝમાં મોકલવી નહીં
            if (m.id && !m.id.toString().startsWith('new-')) {
                baseObj.id = m.id;
            }
            return baseObj;
        });

      const { error } = await supabase.from('families').upsert(finalData, { onConflict: 'id' });
      if (error) throw error;
      alert('પરિવારની વિગતો સફળતાપૂર્વક સેવ થઈ ગઈ!');
      navigate('/family-list');
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
        <button type="button" onClick={(e) => { e.stopPropagation(); setOpenDropdown(isOpen ? null : dropdownId); }}
          className="w-full px-4 py-3 border border-gray-200 rounded-2xl flex items-center justify-between bg-white">
          <span className={`font-gujarati ${value ? 'text-gray-800' : 'text-gray-400'}`}>{value || placeholder}</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
              className="absolute z-[100] w-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-48 overflow-y-auto">
              {options.map((opt: any) => (
                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpenDropdown(null); }}
                  className="w-full px-4 py-3 text-left font-gujarati hover:bg-mint/10 flex items-center justify-between border-b border-gray-50 last:border-0">
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

  if (loadingData) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 text-deep-blue animate-spin" />
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32" onClick={() => setOpenDropdown(null)}>
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top sticky top-0 z-50 shadow-lg">
        <div className="px-6 py-6 flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white font-gujarati font-bold text-xl">પરિવારની વિગત</h1>
            <p className="text-white/80 text-xs font-gujarati">{isEditMode ? 'માહિતી સુધારો' : 'નવી માહિતી ભરો'}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-6 space-y-6 font-gujarati">
        <div className="bg-white p-6 rounded-[30px] shadow-sm space-y-4 border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg"><User size={20} className="text-deep-blue"/> મુખ્ય માહિતી</h2>
          <input type="text" value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder="મોભીનું પૂરું નામ *" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mint" />
          <div className="relative">
            <input type="tel" maxLength={10} value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))} placeholder="મોભીનો મોબાઈલ નંબર *" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mint pl-12" />
            <Phone className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          </div>
          <input type="text" value={subSurname} onChange={(e) => setSubSurname(e.target.value)} placeholder="પેટા અટક *" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mint" />
          <input type="text" value={gol} onChange={(e) => setGol(e.target.value)} placeholder="ગોળ (દા.ત. કાશ્યપ) *" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-mint" />
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm space-y-4 border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg"><Users size={20} className="text-deep-blue"/> સભ્યોની યાદી</h2>
          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={member.id} className="bg-gray-50 p-5 rounded-[25px] space-y-3 relative border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-deep-blue/40 uppercase tracking-widest">સભ્ય #{index + 1}</span>
                  {members.length > 1 && (
                    <button onClick={() => removeMember(member.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
                <input type="text" value={member.memberName} onChange={(e) => updateMember(member.id, 'memberName', e.target.value)} placeholder="સભ્યનું પૂરું નામ" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
                <input type="tel" maxLength={10} value={member.memberMobile} onChange={(e) => updateMember(member.id, 'memberMobile', e.target.value.replace(/[^0-9]/g, ''))} placeholder="સભ્યનો મોબાઈલ નંબર" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl" />
                <div className="grid grid-cols-2 gap-3">
                  <SelectDropdown value={member.relationship} options={relationshipOptions} onChange={(v:any) => updateMember(member.id, 'relationship', v)} placeholder="સંબંધ" dropdownId={`rel-${member.id}`} />
                  <SelectDropdown value={member.gender} options={genderOptions} onChange={(v:any) => updateMember(member.id, 'gender', v)} placeholder="લિંગ" dropdownId={`gen-${member.id}`} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addMember} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-deep-blue flex items-center justify-center gap-2 font-bold bg-gray-50/50 hover:bg-gray-50 transition-all"><Plus size={18} /> બીજા સભ્ય ઉમેરો</button>
        </div>
        <div className="bg-white p-6 rounded-[30px] shadow-sm space-y-4 border border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2 text-lg"><MapPin size={20} className="text-deep-blue"/> રહેઠાણ</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="ગામ" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl" />
            <input type="text" value={taluko} onChange={(e) => setTaluko(e.target.value)} placeholder="તાલુકો" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl" />
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="જિલ્લો" className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl col-span-2" />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-deep-blue text-white font-bold py-5 rounded-[25px] shadow-2xl shadow-deep-blue/20 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 transition-all mb-10">
          {isSubmitting ? <Loader2 className="animate-spin" /> : 'માહિતી સેવ કરો'}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}