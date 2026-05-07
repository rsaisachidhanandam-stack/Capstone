import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  HiAcademicCap, HiBriefcase, HiOutlineStar, HiOutlineLightBulb,
  HiOutlineAnnotation, HiOutlineX, HiChartBar, HiOutlineCheckCircle,
  HiExternalLink
} from 'react-icons/hi';

const AlumniConnect = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const res = await api.get('/alumni');
      let data = res.data?.data || [];

      if (data.length === 0) {
        // Automatically seed if no data found
        console.log('Alumni list empty, seeding...');
        try {
          await api.get('/alumni/seed');
          const retryRes = await api.get('/alumni');
          data = retryRes.data?.data || [];
        } catch (seedErr) {
          console.error('Seed error:', seedErr);
        }
      }

      setAlumni(data);
    } catch (err) {
      console.error('Fetch alumni error:', err);
      toast.error('Failed to load alumni network');
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  if (loading) {
    return (
      <Layout title="Alumni Network">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Alumni Success Stories & Insights">
      <div className="max-w-7xl mx-auto space-y-12 pb-12">
        
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
              <HiAcademicCap size={120} className="absolute -right-8 -bottom-8 text-white/10" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Impact Level</p>
              <h3 className="text-3xl font-black">2,500+ Alumni</h3>
              <p className="text-sm font-medium mt-2 text-white/80">Connecting you to global industry leaders.</p>
           </div>
           <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Avg Success Package</p>
              <h3 className="text-3xl font-black text-emerald-600">12.5 LPA</h3>
              <p className="text-sm font-medium mt-2 text-gray-500">Highest recorded: 52 LPA</p>
           </div>
           <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl flex flex-col justify-center border border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Mentor Rating</p>
              <div className="flex items-center space-x-2">
                 <h3 className="text-3xl font-black">4.9 / 5.0</h3>
                 <div className="flex text-amber-500"><HiOutlineStar /><HiOutlineStar /><HiOutlineStar /><HiOutlineStar /><HiOutlineStar /></div>
              </div>
              <p className="text-sm font-medium mt-2 text-slate-400">Based on student feedback</p>
           </div>
        </div>

        {/* Alumni Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(alumni || []).map((member) => (
            <div key={member?._id} className="bg-white rounded-[44px] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative">
               <div className="flex justify-between items-start mb-6">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl border border-blue-100 group-hover:bg-primary group-hover:text-white transition-all">
                    {(member?.studentName || 'U').split(' ').map(n => n[0]).join('')}
                 </div>
                 <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                   {member?.package ?? 'N/A'}
                 </span>
               </div>
               
               <h4 className="text-xl font-black text-gray-900 mb-1">{member?.studentName ?? 'Unknown'}</h4>
               <p className="text-sm font-bold text-gray-500 mb-2">{member?.role ?? 'Alumni'} @ <span className="text-primary">{member?.company ?? 'Industry'}</span></p>
               
               <div className="flex flex-wrap gap-2 mb-8">
                 <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">{member?.branch ?? 'Global'}</span>
                 <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">Class of {member?.yearPlaced ?? 'N/A'}</span>
               </div>

               <button 
                 onClick={() => setSelectedAlumni(member)}
                 className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-primary hover:shadow-primary/20 transition-all"
               >
                 View Interview Insights
               </button>
            </div>
          ))}
          {(alumni || []).length === 0 && (
            <div className="col-span-full py-24 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
              No alumni records found in the network.
            </div>
          )}
        </div>

        {/* Level 2: Detailed Modal */}
        {selectedAlumni && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedAlumni(null)}></div>
             <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[44px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                <button 
                   onClick={() => setSelectedAlumni(null)}
                   className="absolute top-8 right-8 p-3 bg-gray-50 text-gray-400 hover:text-rose-500 rounded-2xl transition-all z-10"
                >
                   <HiOutlineX size={24} />
                </button>
                
                <div className="overflow-y-auto p-12 space-y-12">
                   {/* Modal Header */}
                   <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                      <div className="w-24 h-24 bg-primary text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-2xl shadow-primary/20">
                         {selectedAlumni?.studentName?.charAt(0) || 'U'}
                      </div>
                      <div className="text-center md:text-left">
                         <h2 className="text-4xl font-black text-gray-900">{selectedAlumni?.studentName ?? 'Unknown Alumni'}</h2>
                         <p className="text-lg font-bold text-gray-500">{selectedAlumni?.role ?? 'Role'} @ {selectedAlumni?.company ?? 'Company'}</p>
                         <div className="flex items-center space-x-4 mt-4 justify-center md:justify-start">
                            <span className="flex items-center text-sm font-black text-emerald-600">
                               <HiOutlineCheckCircle className="mr-2" size={20} /> Verified Alumni
                            </span>
                            <div className="flex items-center space-x-1 text-amber-500">
                               {[...Array(5)].map((_, i) => <HiOutlineStar key={i} />)}
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-amber-50 rounded-[40px] p-8 border border-amber-100">
                         <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center">
                            <HiOutlineLightBulb size={18} className="mr-2" /> Top Tip
                         </h4>
                         <p className="text-sm font-bold text-amber-900 leading-relaxed italic">
                           "{selectedAlumni?.tips ?? 'Believe in yourself and keep practicing!'}"
                         </p>
                      </div>
                      <div className="bg-blue-50 rounded-[40px] p-8 border border-blue-100 col-span-2">
                         <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center">
                            <HiBriefcase size={18} className="mr-2" /> Interview Rounds ({selectedAlumni?.interviewRounds ?? 'N/A'})
                         </h4>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-blue-50">
                               <p className="text-[9px] font-black text-gray-400 uppercase">Preparation Strategy</p>
                               <p className="text-xs font-bold text-gray-700 mt-1">{selectedAlumni?.strategy ?? 'Consistent effort and revision.'}</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl shadow-sm border border-blue-50 text-center flex flex-col items-center justify-center">
                               <p className="text-[9px] font-black text-gray-400 uppercase">Offer Acceptance</p>
                               <p className="text-xs font-black text-emerald-600 mt-1">Confirmed</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center">
                         <HiOutlineAnnotation className="mr-3 text-primary" size={24} /> 
                         Crucial Interview Questions Asked
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {(selectedAlumni?.interviewQuestions || []).map((q, i) => (
                           <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl group hover:bg-white hover:border-primary transition-all">
                              <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 block">Question {i+1}</span>
                              <p className="font-bold text-gray-700 text-sm">{q}</p>
                           </div>
                         ))}
                         {(selectedAlumni?.interviewQuestions || []).length === 0 && (
                            <div className="p-6 text-gray-400 italic text-sm">No specific questions shared.</div>
                         )}
                      </div>
                   </div>

                   <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-sm font-bold text-gray-400">Want more guidance?</p>
                         <p className="text-xs text-gray-500">Connect with {(selectedAlumni?.studentName || 'this alumni').split(' ')[0]} on LinkedIn.</p>
                      </div>
                      <a href={selectedAlumni?.linkedIn || '#'} target="_blank" className="flex items-center space-x-2 px-8 py-4 bg-[#0077b5] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#0077b5]/20 hover:scale-105 transition-all">
                         <HiExternalLink size={20} />
                         <span>LinkedIn Profile</span>
                      </a>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AlumniConnect;
