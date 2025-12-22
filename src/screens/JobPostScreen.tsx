import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, Building2, ExternalLink, Calendar, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobPostScreen() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // આ ડમી ડેટા છે (પછીથી આપણે ડેટાબેઝમાંથી લાવીશું)
  const jobs = [
    {
      id: 1,
      title: 'જુનિયર ક્લાર્ક (વહીવટી)',
      company: 'ગુજરાત સરકાર (GPSSB)',
      location: 'ગાંધીનગર, ગુજરાત',
      salary: '₹19,950 / મહિનો',
      type: 'Government',
      date: '22 Dec 2025',
      description: 'બિન-સચિવાલય ક્લાર્ક માટે ભરતી. કોમ્પ્યુટરનું જ્ઞાન જરૂરી.',
      link: 'https://gpsc-ojas.gujarat.gov.in/' 
    },
    {
      id: 2,
      title: 'સિનિયર એકાઉન્ટન્ટ',
      company: 'રિલાયન્સ ઇન્ડસ્ટ્રીઝ',
      location: 'અમદાવાદ',
      salary: '₹35,000 - ₹50,000',
      type: 'Private',
      date: '20 Dec 2025',
      description: 'CA અથવા M.Com કરેલા અનુભવી ઉમેદવાર જોઈએ છે.',
      link: 'https://www.naukri.com' 
    },
    {
      id: 3,
      title: 'શિક્ષક (ગણિત/વિજ્ઞાન)',
      company: 'સરસ્વતી વિદ્યા મંદિર',
      location: 'મહેસાણા',
      salary: '₹15,000 / મહિનો',
      type: 'Private',
      date: '18 Dec 2025',
      description: 'ધોરણ 9 થી 12 માટે શિક્ષક જોઈએ છે. B.Ed ફરજિયાત.',
      link: 'https://google.com' 
    }
  ];

  // સર્ચ ફિલ્ટર લોજીક
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 pt-12 rounded-b-[30px] shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white font-gujarati">નોકરીની જાહેરાત</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="નોકરી અથવા સંસ્થા શોધો..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/95 backdrop-blur text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner"
          />
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
        </div>
      </div>

      {/* Jobs List */}
      <div className="px-5 py-6 space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">કોઈ નોકરી મળી નથી.</div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 font-gujarati">{job.title}</h3>
                  <p className="text-sm text-blue-600 font-medium">{job.company}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                  job.type === 'Government' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {job.type}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {job.date}
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                 <p className="text-sm text-gray-600 line-clamp-2">
                    {job.description}
                 </p>
                 <p className="text-sm font-bold text-gray-800 mt-2">
                    પગાર: {job.salary}
                 </p>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => window.open(job.link, '_blank')}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 active:scale-95 transition-all hover:bg-blue-700"
              >
                <span>વધુ વિગત અને અરજી કરો</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}