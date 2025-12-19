import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Plus,
  User,
  GraduationCap,
  MapPin,
  Target,
  Filter,
  ChevronDown,
  X,
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import type { Student, StudentFormData, StudyLevel, StudentSearchFilters } from '../types/education';
import { getStudents, createStudent } from '../services/educationApi';

// Study Level Options
const studyLevelOptions: { value: StudyLevel; label: string }[] = [
  { value: 'School', label: 'School' },
  { value: 'College', label: 'College' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'ITI', label: 'ITI' },
  { value: 'Other', label: 'Other' },
];

const golOptions = [
  'કાશ્યપ', 'ભારદ્વાજ', 'વસિષ્ઠ', 'અત્રિ', 'ગૌતમ',
  'જમદગ્નિ', 'વિશ્વામિત્ર', 'અગસ્ત્ય', 'અન્ય',
];

const initialFormData: StudentFormData = {
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
  gol: '',
};

export default function StudentProfileScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'list' | 'register'>('list');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<StudentSearchFilters>({});
  
  // Form state
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    const response = await getStudents({ ...filters, query: searchQuery });
    if (response.success && response.data) {
      setStudents(response.data);
    }
    setLoading(false);
  };

  const handleSearch = () => {
    fetchStudents();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'પૂરું નામ જરૂરી છે';
    if (!formData.age || parseInt(formData.age) < 5 || parseInt(formData.age) > 100) {
      errors.age = 'યોગ્ય ઉંમર દાખલ કરો';
    }
    if (!formData.studyLevel) errors.studyLevel = 'અભ્યાસ લેવલ પસંદ કરો';
    if (!formData.fieldOfStudy.trim()) errors.fieldOfStudy = 'અભ્યાસ ક્ષેત્ર જરૂરી છે';
    if (!formData.currentInstitution.trim()) errors.currentInstitution = 'સંસ્થાનું નામ જરૂરી છે';
    if (!formData.gol) errors.gol = 'ગોળ પસંદ કરો';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const response = await createStudent(formData);
    
    if (response.success) {
      setShowSuccess(true);
      setFormData(initialFormData);
      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('list');
        fetchStudents();
      }, 2000);
    } else {
      setFormErrors({ submit: response.error || 'કંઈક ખોટું થયું' });
    }
    setIsSubmitting(false);
  };

  const renderStudentCard = (student: Student) => (
    <motion.div
      key={student.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-5 mb-4"
      onClick={() => navigate(`/education/students/${student.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mint to-teal-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-gujarati font-semibold text-gray-800">
              {student.fullName}
            </h3>
            <p className="text-gray-500 text-xs font-gujarati">
              {student.age} વર્ષ
            </p>
          </div>
        </div>
        {student.isFirstGraduate && (
          <span className="px-2 py-1 bg-royal-gold/10 text-royal-gold text-xs rounded-full font-gujarati">
            પ્રથમ Graduate
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <GraduationCap className="w-4 h-4 text-mint" />
          <span className="text-gray-600 font-gujarati">
            {student.studyLevel} - {student.fieldOfStudy}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <MapPin className="w-4 h-4 text-mint" />
          <span className="text-gray-600 font-gujarati">
            {student.village}, {student.district}
          </span>
        </div>
        {student.futureGoal && (
          <div className="flex items-center space-x-2 text-sm">
            <Target className="w-4 h-4 text-royal-gold" />
            <span className="text-gray-600 font-gujarati truncate">
              {student.futureGoal}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderListTab = () => (
    <div className="px-6 py-4">
      {/* Search Bar */}
      <div className="flex space-x-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="નામ, ગામ અથવા ક્ષેત્ર શોધો..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-xl border ${showFilters ? 'bg-mint text-white border-mint' : 'bg-white border-gray-200'}`}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="premium-card p-4 mb-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-gujarati text-gray-600 mb-1 block">
                  અભ્યાસ લેવલ
                </label>
                <select
                  value={filters.studyLevel || ''}
                  onChange={(e) => setFilters({ ...filters, studyLevel: e.target.value as StudyLevel || undefined })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-gujarati"
                >
                  <option value="">બધા</option>
                  {studyLevelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-gujarati text-gray-600 mb-1 block">
                  ગોળ
                </label>
                <select
                  value={filters.gol || ''}
                  onChange={(e) => setFilters({ ...filters, gol: e.target.value || undefined })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-gujarati"
                >
                  <option value="">બધા</option>
                  {golOptions.map((gol) => (
                    <option key={gol} value={gol}>{gol}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                setFilters({});
                setSearchQuery('');
              }}
              className="mt-3 text-sm text-mint font-gujarati"
            >
              ફિલ્ટર્સ clear કરો
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Students List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-mint border-t-transparent rounded-full animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-gujarati">કોઈ વિદ્યાર્થી મળ્યા નથી</p>
          <p className="text-gray-400 text-sm font-gujarati mt-1">
            પ્રથમ વિદ્યાર્થી પ્રોફાઈલ ઉમેરો
          </p>
        </motion.div>
      ) : (
        <div>
          {students.map(renderStudentCard)}
        </div>
      )}

      {/* Inspirational Quote */}
      <div className="mt-6 p-4 bg-gradient-to-r from-mint/10 to-teal-50 rounded-2xl border-l-4 border-mint">
        <p className="font-gujarati text-gray-700 text-sm italic">
          "વિદ્યાર્થી પોતે પણ inspire થાય અને બીજા વિદ્યાર્થીઓને પણ પ્રેરણા મળે"
        </p>
      </div>
    </div>
  );

  const renderRegisterTab = () => (
    <div className="px-6 py-4">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          >
            <div className="bg-white rounded-3xl p-8 text-center max-w-sm">
              <div className="w-20 h-20 bg-mint/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-mint" />
              </div>
              <h3 className="font-gujarati font-bold text-xl text-gray-800 mb-2">
                સફળતાપૂર્વક નોંધાયું!
              </h3>
              <p className="text-gray-600 font-gujarati text-sm">
                વિદ્યાર્થી પ્રોફાઈલ સેવ થઈ ગઈ છે
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-sm font-gujarati text-gray-700 mb-2 block">
            પૂરું નામ *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="વિદ્યાર્થીનું પૂરું નામ"
            className={`w-full px-4 py-3 rounded-xl border ${formErrors.fullName ? 'border-red-400' : 'border-gray-200'} focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati`}
          />
          {formErrors.fullName && (
            <p className="text-red-500 text-xs mt-1 font-gujarati">{formErrors.fullName}</p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="text-sm font-gujarati text-gray-700 mb-2 block">
            ઉંમર *
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            placeholder="વર્ષ"
            min="5"
            max="100"
            className={`w-full px-4 py-3 rounded-xl border ${formErrors.age ? 'border-red-400' : 'border-gray-200'} focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati`}
          />
          {formErrors.age && (
            <p className="text-red-500 text-xs mt-1 font-gujarati">{formErrors.age}</p>
          )}
        </div>

        {/* Study Level Dropdown */}
        <div className="relative">
          <label className="text-sm font-gujarati text-gray-700 mb-2 block">
            અભ્યાસ લેવલ *
          </label>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'studyLevel' ? null : 'studyLevel')}
            className={`w-full px-4 py-3 rounded-xl border ${formErrors.studyLevel ? 'border-red-400' : 'border-gray-200'} bg-white flex items-center justify-between font-gujarati`}
          >
            <span className={formData.studyLevel ? 'text-gray-800' : 'text-gray-400'}>
              {formData.studyLevel || 'પસંદ કરો'}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openDropdown === 'studyLevel' ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {openDropdown === 'studyLevel' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {studyLevelOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFormData({ ...formData, studyLevel: opt.value });
                      setOpenDropdown(null);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-mint/10 font-gujarati text-sm"
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {formErrors.studyLevel && (
            <p className="text-red-500 text-xs mt-1 font-gujarati">{formErrors.studyLevel}</p>
          )}
        </div>

        {/* Field of Study */}
        <div>
          <label className="text-sm font-gujarati text-gray-700 mb-2 block">
            અભ્યાસ ક્ષેત્ર *
          </label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
            placeholder="દા.ત. Science, Commerce, Engineering"
            className={`w-full px-4 py-3 rounded-xl border ${formErrors.fieldOfStudy ? 'border-red-400' : 'border-gray-200'} focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati`}
          />
          {formErrors.fieldOfStudy && (
            <p className="text-red-500 text-xs mt-1 font-gujarati">{formErrors.fieldOfStudy}</p>
          )}
        </div>

        {/* Current Institution */}
        <div>
          <label className="text-sm font-gujarati text-gray-700 mb-2 block">
            હાલની સંસ્થા *
          </label>
          <input
            type="text"
            value={formData.currentInstitution}
            onChange={(e) => setFormData({ ...formData, currentInstitution: e.target.value })}
            placeholder="સ્કૂલ / કોલેજનું નામ"
            className={`w-full px-4 py-3 rounded-xl border ${formErrors.currentInstitution ? 'border-red-400' : 'border-gray-200'} focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati`}
          />
          {formErrors.currentInstitution && (
            <p className="text-red-500 text-xs mt-1 font-gujarati">{formErrors.currentInstitution}</p>
          )}
        </div>

        {/* Future Goal */}
        <div>
          <label className="text-sm font-gujarati text-gray-700 mb-2 block">
            ભવિષ્યનું લક્ષ્ય
          </label>
          <textarea
            value={formData.futureGoal}
            onChange={(e) => setFormData({ ...formData, futureGoal: e.target.value })}
            placeholder="તમારું ભવિષ્યનું લક્ષ્ય શું છે?"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati resize-none"
          />
        </div>

        {/* First Graduate Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-gujarati text-gray-800 text-sm">
              પરિવારનો પ્રથમ Graduate?
            </p>
            <p className="font-gujarati text-gray-500 text-xs">
              શું તમે પરિવારમાં પ્રથમ graduate છો?
            </p>
          </div>
          <button
            onClick={() => setFormData({ ...formData, isFirstGraduate: !formData.isFirstGraduate })}
            className={`w-12 h-7 rounded-full transition-colors ${formData.isFirstGraduate ? 'bg-mint' : 'bg-gray-300'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${formData.isFirstGraduate ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-gujarati text-gray-700 mb-2 block">
              ગામ
            </label>
            <input
              type="text"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              placeholder="ગામ"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati"
            />
          </div>
          <div>
            <label className="text-sm font-gujarati text-gray-700 mb-2 block">
              તાલુકો
            </label>
            <input
              type="text"
              value={formData.taluko}
              onChange={(e) => setFormData({ ...formData, taluko: e.target.value })}
              placeholder="તાલુકો"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-gujarati text-gray-700 mb-2 block">
              જિલ્લો
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              placeholder="જિલ્લો"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint focus:ring-2 focus:ring-mint/20 font-gujarati"
            />
          </div>
          <div className="relative">
            <label className="text-sm font-gujarati text-gray-700 mb-2 block">
              ગોળ *
            </label>
            <button
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'gol' ? null : 'gol')}
              className={`w-full px-4 py-3 rounded-xl border ${formErrors.gol ? 'border-red-400' : 'border-gray-200'} bg-white flex items-center justify-between font-gujarati text-sm`}
            >
              <span className={formData.gol ? 'text-gray-800' : 'text-gray-400'}>
                {formData.gol || 'પસંદ કરો'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openDropdown === 'gol' ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openDropdown === 'gol' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto"
                >
                  {golOptions.map((gol) => (
                    <button
                      key={gol}
                      onClick={() => {
                        setFormData({ ...formData, gol });
                        setOpenDropdown(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-mint/10 font-gujarati text-sm"
                    >
                      {gol}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            {formErrors.gol && (
              <p className="text-red-500 text-xs mt-1 font-gujarati">{formErrors.gol}</p>
            )}
          </div>
        </div>

        {/* Submit Error */}
        {formErrors.submit && (
          <div className="p-4 bg-red-50 rounded-xl">
            <p className="text-red-600 text-sm font-gujarati">{formErrors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-mint to-teal-500 text-white rounded-xl font-gujarati font-semibold shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            'પ્રોફાઈલ સેવ કરો'
          )}
        </motion.button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-deep-blue to-[#1A8FA3] safe-area-top">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/education')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white font-gujarati font-bold text-xl">
                વિદ્યાર્થી પ્રોફાઈલ
              </h1>
              <p className="text-mint text-sm font-gujarati">
                Student Profiles
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pb-4 space-x-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 rounded-xl font-gujarati font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-white text-deep-blue shadow-lg'
                : 'bg-white/10 text-white'
            }`}
          >
            <Search className="w-4 h-4 inline-block mr-2" />
            પ્રોફાઈલ જુઓ
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 rounded-xl font-gujarati font-medium transition-all ${
              activeTab === 'register'
                ? 'bg-white text-deep-blue shadow-lg'
                : 'bg-white/10 text-white'
            }`}
          >
            <Plus className="w-4 h-4 inline-block mr-2" />
            નવી નોંધણી
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'list' ? renderListTab() : renderRegisterTab()}

      <BottomNav />
    </div>
  );
}
