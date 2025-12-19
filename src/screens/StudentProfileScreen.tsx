import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, Plus, User, GraduationCap, MapPin, 
  Target, Filter, Check
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { supabase } from '../supabaseClient';

const studyLevelOptions = [
  { value: 'School', label: 'School' },
  { value: 'College', label: 'College' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'ITI', label: 'ITI' },
  { value: 'Other', label: 'Other' },
];

// ❌ golOptions array removed

export default function StudentProfileScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'list' | 'register'>('list');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStudyLevel, setFilterStudyLevel] = useState('');
  const [filterGol, setFilterGol] = useState(''); // Text input for filter

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    studyLevel: '',
    fieldOfStudy: '',
    currentInstitution: '',
    futureGoal: '',
    isFirstGraduate: false,
    village: '',
    taluko: '',
    district: '',
    gol: '' // Free text
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    fetchStudents();
  }, [filterStudyLevel, filterGol]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply Filters
      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,village.ilike.%${searchQuery}%,field_of_study.ilike.%${searchQuery}%`);
      }
      if (filterStudyLevel) {
        query = query.eq('study_level', filterStudyLevel);
      }
      if (filterGol) {
        // Partial match for Gol text
        query = query.ilike('gol', `%${filterGol}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.fullName.trim()) errors.fullName = 'પૂરું નામ જરૂરી છે';
    if (!formData.age) errors.age = 'ઉંમર નાખો';
    if (!formData.studyLevel) errors.studyLevel = 'અભ્યાસ લેવલ પસંદ કરો';
    if (!formData.fieldOfStudy) errors.fieldOfStudy = 'વિષય/ક્ષેત્ર લખો';
    if (!formData.currentInstitution) errors.currentInstitution = 'સંસ્થાનું નામ લખો';
    if (!formData.gol.trim()) errors.gol = 'ગોળ લખવો જરૂરી છે'; // Validation
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("પ્લીઝ લોગીન કરો");
        return;
      }

      const { error } = await supabase
        .from('students')
        .insert([{
            user_id: user.id,
            full_name: formData.fullName,
            age: parseInt(formData.age),
            study_level: formData.studyLevel,
            field_of_study: formData.fieldOfStudy,
            current_institution: formData.currentInstitution,
            future_goal: formData.futureGoal,
            is_first_graduate: formData.isFirstGraduate,
            village: formData.village,
            taluko: formData.taluko,
            district: formData.district,
            gol: formData.gol // Saving as Text
        }]);

      if (error) throw error;

      setShowSuccess(true);
      setFormData({
        fullName: '', age: '', studyLevel: '', fieldOfStudy: '', currentInstitution: '',
        futureGoal: '', isFirstGraduate: false, village: '', taluko: '', district: '', gol: ''
      });

      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('list');
        fetchStudents();
      }, 2000);

    } catch (error: any) {
        console.error(error);
        setFormErrors({ submit: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('/education')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-gujarati font-bold text-xl">વિદ્યાર્થી પ્રોફાઈલ</h1>
              <p className="text-mint text-sm font-gujarati">Student Profiles</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pb-4 space-x-4">
          <button onClick={() => setActiveTab('list')} className={`flex-1 py-3 rounded-xl font-gujarati font-medium transition-all ${activeTab === 'list' ? 'bg-white text-deep-blue shadow-lg' : 'bg-white/10 text-white'}`}>
            <Search className="w-4 h-4 inline-block mr-2" /> પ્રોફાઈલ જુઓ
          </button>
          <button onClick={() => setActiveTab('register')} className={`flex-1 py-3 rounded-xl font-gujarati font-medium transition-all ${activeTab === 'register' ? 'bg-white text-deep-blue shadow-lg' : 'bg-white/10 text-white'}`}>
            <Plus className="w-4 h-4 inline-block mr-2" /> નવી નોંધણી
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="px-6 py-4">
          {/* Search Bar */}
          <div className="flex space-x-3 mb-4">
            <div className="flex-1 relative">
              <input type="text" placeholder="નામ, ગામ અથવા ક્ષેત્ર શોધો..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchStudents()} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-mint/20 font-gujarati text-sm" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl border ${showFilters ? 'bg-mint text-white border-mint' : 'bg-white border-gray-200'}`}>
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white p-4 rounded-xl shadow-sm mb-4 overflow-hidden">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-gujarati mb-1 block">અભ્યાસ</label>
                    <select value={filterStudyLevel} onChange={(e) => setFilterStudyLevel(e.target.value)} className="w-full p-2 border rounded-lg text-sm font-gujarati">
                      <option value="">બધા લેવલ</option>
                      {studyLevelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-gujarati mb-1 block">ગોળ</label>
                    {/* ✅ Changed Filter to Input Box */}
                    <input 
                      type="text" 
                      placeholder="ગોળ લખો..."
                      value={filterGol} 
                      onChange={(e) => setFilterGol(e.target.value)} 
                      className="w-full p-2 border rounded-lg text-sm font-gujarati"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
             <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" /></div>
          ) : students.length === 0 ? (
             <div className="text-center py-12 text-gray-400"><p>કોઈ વિદ્યાર્થી મળ્યા નથી.</p></div>
          ) : (
             students.map((student) => (
                <motion.div key={student.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-5 mb-4">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mint to-teal-500 flex items-center justify-center text-white"><User className="w-6 h-6"/></div>
                            <div>
                                <h3 className="font-gujarati font-semibold text-gray-800">{student.full_name}</h3>
                                <p className="text-gray-500 text-xs font-gujarati">{student.age} વર્ષ • {student.gol}</p>
                            </div>
                        </div>
                        {student.is_first_graduate && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-bold">First Graduate 🎓</span>}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600 font-gujarati pl-14">
                        <p className="flex items-center"><GraduationCap className="w-3 h-3 mr-2 text-mint"/> {student.study_level} - {student.field_of_study}</p>
                        <p className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-mint"/> {student.village}, {student.district}</p>
                        {student.future_goal && <p className="flex items-center"><Target className="w-3 h-3 mr-2 text-orange-500"/> {student.future_goal}</p>}
                    </div>
                </motion.div>
             ))
          )}
        </div>
      ) : (
        <div className="px-6 py-4 space-y-4">
            {/* --- Registration Form --- */}
            <div>
               <label className="text-sm font-gujarati text-gray-700 block mb-1">પૂરું નામ *</label>
               <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati" placeholder="વિદ્યાર્થીનું નામ" />
               {formErrors.fullName && <p className="text-red-500 text-xs">{formErrors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                   <label className="text-sm font-gujarati text-gray-700 block mb-1">ઉંમર *</label>
                   <input type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati" />
                </div>
                <div>
                   <label className="text-sm font-gujarati text-gray-700 block mb-1">અભ્યાસ લેવલ *</label>
                   <select value={formData.studyLevel} onChange={(e) => setFormData({...formData, studyLevel: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati bg-white">
                      <option value="">પસંદ કરો</option>
                      {studyLevelOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                   </select>
                </div>
            </div>

            <div>
               <label className="text-sm font-gujarati text-gray-700 block mb-1">અભ્યાસ ક્ષેત્ર *</label>
               <input type="text" value={formData.fieldOfStudy} onChange={(e) => setFormData({...formData, fieldOfStudy: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati" placeholder="દા.ત. Science, Commerce" />
            </div>

            <div>
               <label className="text-sm font-gujarati text-gray-700 block mb-1">હાલની સંસ્થા *</label>
               <input type="text" value={formData.currentInstitution} onChange={(e) => setFormData({...formData, currentInstitution: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati" placeholder="સ્કૂલ/કોલેજનું નામ" />
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div>
                  <label className="text-sm font-gujarati text-gray-700 block mb-1">ગામ</label>
                  <input type="text" value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati" />
               </div>
               <div>
                  <label className="text-sm font-gujarati text-gray-700 block mb-1">ગોળ *</label>
                  {/* ✅ Changed to Input Box */}
                  <input 
                    type="text" 
                    value={formData.gol} 
                    onChange={(e) => setFormData({...formData, gol: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati" 
                    placeholder="ગોળ લખો"
                  />
                  {formErrors.gol && <p className="text-red-500 text-xs mt-1">{formErrors.gol}</p>}
               </div>
            </div>

            <div>
               <label className="text-sm font-gujarati text-gray-700 block mb-1">ભવિષ્યનું લક્ષ્ય</label>
               <textarea value={formData.futureGoal} onChange={(e) => setFormData({...formData, futureGoal: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-gujarati" rows={2} placeholder="તમારું લક્ષ્ય શું છે?" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
               <span className="text-sm font-gujarati">પરિવારનો પ્રથમ Graduate?</span>
               <input type="checkbox" checked={formData.isFirstGraduate} onChange={(e) => setFormData({...formData, isFirstGraduate: e.target.checked})} className="w-5 h-5 text-mint" />
            </div>

            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-mint to-teal-500 text-white rounded-xl font-gujarati font-bold shadow-lg disabled:opacity-50">
               {isSubmitting ? 'સેવ થાય છે...' : 'પ્રોફાઈલ સેવ કરો'}
            </button>
        </div>
      )}

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl text-center shadow-2xl">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-xl font-gujarati">સફળતા!</h3>
                    <p className="text-gray-500 font-gujarati">વિદ્યાર્થી પ્રોફાઈલ સેવ થઈ ગઈ છે.</p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}