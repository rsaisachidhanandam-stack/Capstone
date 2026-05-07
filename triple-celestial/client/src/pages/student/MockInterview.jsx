import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import { 
  HiOutlineMicrophone, HiOutlineVideoCamera, HiOutlineChat, 
  HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineCheckCircle 
} from 'react-icons/hi';

const MockInterview = () => {
  const [sessionStarted, setSessionStarted] = useState(false);

  return (
    <Layout title="AI Mock Interview">
      <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
        
        {!sessionStarted ? (
          <div className="bg-white rounded-[44px] p-12 shadow-sm border border-gray-100 text-center space-y-8">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
              <HiOutlineSparkles size={48} />
            </div>
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Prepare for Success with AI</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Practice your technical and behavioral skills in a simulated environment. 
                Our AI interviewer will evaluate your confidence, technical accuracy, and body language.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col items-center">
                <HiOutlineVideoCamera size={32} className="text-primary mb-4" />
                <h4 className="font-black text-sm uppercase tracking-widest text-gray-900 mb-2">Video Analysis</h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">Real-time eye tracking and confidence scoring.</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col items-center">
                <HiOutlineMicrophone size={32} className="text-indigo-500 mb-4" />
                <h4 className="font-black text-sm uppercase tracking-widest text-gray-900 mb-2">Voice Tone</h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">Analyzing your speech rate and clarity.</p>
              </div>
              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col items-center">
                <HiOutlineChat size={32} className="text-emerald-500 mb-4" />
                <h4 className="font-black text-sm uppercase tracking-widest text-gray-900 mb-2">Technical Vetting</h4>
                <p className="text-xs text-gray-400 font-bold leading-relaxed">Dynamic questions based on your resume.</p>
              </div>
            </div>

            <button 
              onClick={() => setSessionStarted(true)}
              className="px-12 py-5 bg-gray-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-primary transition-all hover:scale-105 active:scale-95"
            >
              Initialize AI Interviewer
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-[44px] h-[700px] shadow-2xl overflow-hidden relative border border-slate-800 flex flex-col">
             {/* Virtual Interviewer Side */}
             <div className="flex-1 flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"></div>
                <div className="relative z-10 space-y-6">
                   <div className="w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center p-2">
                      <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                         <HiOutlineSparkles size={80} className="text-primary animate-pulse" />
                         <div className="absolute inset-0 bg-primary/5 animate-ping"></div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white italic">"Welcome, I am your Technical Interviewer today."</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">AI Voice Processing...</p>
                   </div>
                </div>
             </div>

             {/* User Camera Simulation */}
             <div className="absolute bottom-8 right-8 w-64 h-48 bg-slate-800 rounded-[32px] border-4 border-slate-700 shadow-2xl overflow-hidden group">
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 group-hover:text-primary transition-colors">
                   <HiOutlineVideoCamera size={48} />
                   <span className="text-[9px] font-black uppercase tracking-widest mt-2">Connecting Camera...</span>
                </div>
                <div className="absolute top-4 left-4 flex space-x-2">
                   <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                   <span className="text-[8px] font-black text-white uppercase">Rec</span>
                </div>
             </div>

             {/* Controls */}
             <div className="p-8 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center space-x-6">
                   <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center">
                      <HiOutlineShieldCheck className="text-emerald-500 mr-2" size={18} />
                      <span className="text-[10px] font-black text-emerald-500 uppercase">Mic Ready</span>
                   </div>
                   <p className="text-slate-400 text-sm font-bold">Question: <span className="text-white">Explain the concept of Virtual DOM in React.</span></p>
                </div>
                <button 
                  onClick={() => setSessionStarted(false)}
                  className="px-8 py-3 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all"
                >
                  End Session
                </button>
             </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-[40px] p-8 border border-gray-100 flex items-start space-x-6">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0">
                 <HiOutlineCheckCircle size={28} />
              </div>
              <div>
                 <h4 className="font-black text-gray-900 uppercase tracking-tight mb-1 text-sm">Personalized Feedback</h4>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed">Receive a detailed report card after every session with improvement areas.</p>
              </div>
           </div>
           <div className="bg-white rounded-[40px] p-8 border border-gray-100 flex items-start space-x-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
                 <HiOutlineSparkles size={28} />
              </div>
              <div>
                 <h4 className="font-black text-gray-900 uppercase tracking-tight mb-1 text-sm">Role-Specific Training</h4>
                 <p className="text-xs text-gray-500 font-medium leading-relaxed">Interviews adapt to SDE, Data Science, Analyst or Management roles.</p>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
};

export default MockInterview;
