import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import { toast } from 'react-hot-toast';
import { 
  HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineX, HiOutlineCheckCircle, 
  HiOutlineExclamationCircle, HiOutlineSparkles, HiOutlineLightBulb, HiOutlineArrowSmUp
} from 'react-icons/hi';
import { useDropzone } from 'react-dropzone';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, DOC, DOCX files allowed!';
    }
    if (file.size > maxSize) {
      return 'File too large! Maximum 5MB allowed.';
    }
    return null;
  };

  const handleFileSelect = (selectedFile) => {
    const err = validateFile(selectedFile);
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const token = localStorage.getItem('intelliplace_token');
      
      const response = await fetch(
        'http://localhost:5000/api/resume/upload',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        setAnalysis(data.data);
        toast.success('Resume analyzed successfully!');
      } else {
        setError(data.message || 'Upload failed');
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      toast.error('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout title="AI Resume Analyzer">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {!analysis && !uploading && (
          <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100 text-center space-y-8">
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex justify-center space-x-2">
                <span className="px-3 py-1 bg-white border border-gray-200 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">📦 Max 5MB</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">📄 PDF</span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">📝 DOC</span>
                <span className="px-3 py-1 bg-amber-50 text-amber-500 rounded-full text-[10px] font-black uppercase tracking-widest">📋 DOCX</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight">Optimize Your Pipeline</h2>
              <p className="text-gray-500 font-medium px-4">Upload your resume to receive instant feedback, scoring, and AI-driven placement insights.</p>
            </div>

            <div 
              {...getRootProps()}
              className={`relative h-72 border-4 border-dashed rounded-[40px] transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/50 bg-gray-50/50'
              }`}
            >
              <input {...getInputProps()} />
              {!file ? (
                <>
                  <div className="w-20 h-20 bg-white rounded-[28px] shadow-2xl flex items-center justify-center text-primary mb-4 rotate-3 group-hover:rotate-0 transition-transform">
                    <HiOutlineCloudUpload size={40} />
                  </div>
                  <p className="text-gray-900 font-black text-lg">Drop resume here</p>
                  <p className="text-gray-400 text-sm font-bold mt-1 underline underline-offset-4 pointer-events-none">or click to browse</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-emerald-500 rounded-[28px] shadow-2xl flex items-center justify-center text-white mb-4">
                    <HiOutlineDocumentText size={40} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-gray-900 font-black text-lg max-w-xs truncate mx-auto">{file.name}</p>
                    <p className="text-zinc-400 font-black text-[10px] uppercase tracking-widest mt-1">
                      {formatSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="absolute top-6 right-6 p-3 bg-white text-rose-500 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all z-20 group"
                  >
                    <HiOutlineX size={20} className="group-hover:rotate-90 transition-transform" />
                  </button>
                </>
              )}
            </div>

            {error && <p className="text-rose-500 font-bold text-sm">{error}</p>}

            <div className="max-w-md mx-auto">
              <button 
                onClick={handleUpload}
                disabled={!file}
                className="w-full py-5 bg-zinc-950 text-white rounded-[28px] font-black shadow-2xl shadow-black/20 hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center justify-center space-x-3 group active:scale-95"
              >
                <HiOutlineSparkles size={24} className="group-hover:rotate-12 transition-transform" />
                <span className="uppercase tracking-[0.2em] text-[10px]">Analyze My Resume</span>
              </button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="bg-white rounded-[40px] p-24 shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-8 animate-pulse">
            <div className="w-24 h-24 border-8 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="text-center">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-2">Analyzing your resume...</h2>
              <p className="text-gray-400 font-medium">Sit tight! Our AI is extraction insights from your profile.</p>
            </div>
          </div>
        )}

        {analysis && !uploading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Summary */}
            <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="space-y-4 text-center md:text-left">
                  <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">AI Analysis Result</span>
                  <h2 className="text-4xl font-black leading-tight">Your Portfolio readiness is <span className="text-blue-500">{analysis.totalScore >= 70 ? 'High' : 'Improving'}</span></h2>
                  <p className="text-white/60 font-medium">Target these missing sectors & improve your placement probability by {100 - analysis.totalScore}%.</p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 flex flex-col items-center justify-center space-y-1">
                    <span className="text-5xl font-black tracking-tighter">{analysis.totalScore}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">ATS Score</span>
                  </div>
                  <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 flex flex-col items-center justify-center space-y-1">
                    <span className="text-3xl font-black tracking-tighter">{analysis.sectionScore}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sections</span>
                  </div>
                  <div className="w-32 h-32 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 flex flex-col items-center justify-center space-y-1">
                    <span className="text-3xl font-black tracking-tighter">{analysis.skillMatchScore}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Skill Match</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { setAnalysis(null); setFile(null); }}
                className="mt-12 bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Upload New Version
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Sections Checklist */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Sections Checklist</h3>
                  <div className="space-y-3">
                    {Object.entries(analysis.sections || {}).map(([key, found]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <span className="text-sm font-bold text-gray-700 capitalize">{key.replace('has', '')}</span>
                        {found ? (
                          <HiOutlineCheckCircle className="text-emerald-500" size={24} />
                        ) : (
                          <HiOutlineX className="text-rose-500" size={24} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Suggestions</h3>
                  <div className="space-y-4">
                    {(analysis.suggestions || []).map((sug, idx) => (
                      <div key={idx} className="flex items-start space-x-4 p-5 bg-amber-50 rounded-2xl border border-amber-100 relative group">
                        <div className="mt-1 p-1 bg-white rounded-lg text-amber-500 flex-shrink-0">
                          <HiOutlineLightBulb size={18} />
                        </div>
                        <p className="text-sm font-bold text-amber-900 leading-relaxed pr-8">{sug}</p>
                        <span className="absolute top-4 right-4 text-[8px] font-black uppercase text-amber-400 tracking-widest bg-white px-2 py-0.5 rounded-full border border-amber-100">Priority</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Skills Analyzer */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black uppercase tracking-[0.2em]">Competency Cloud</h3>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Matched</span>
                      <span className="px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest">Missing</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Matched Skills */}
                    <div>
                      <h4 className="flex items-center text-xs font-black uppercase text-zinc-400 tracking-widest mb-4">
                        <HiOutlineCheckCircle className="mr-2 text-emerald-500" /> Detected Strength Skills
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {(analysis.matchedSkills || []).map((skill, idx) => (
                          <span key={idx} className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl group flex items-center shadow-lg shadow-emerald-500/5 hover:scale-105 transition-all text-sm font-black tracking-tight border border-emerald-100">
                            {skill}
                          </span>
                        ))}
                        {(!analysis.matchedSkills || analysis.matchedSkills.length === 0) && (
                          <p className="text-zinc-400 font-medium italic text-sm">No specific skills detected in matches section.</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h4 className="flex items-center text-xs font-black uppercase text-zinc-400 tracking-widest mb-4">
                        <HiOutlineExclamationCircle className="mr-2 text-rose-500" /> Critical Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {(analysis.missingSkills || []).map((skill, idx) => (
                          <span key={idx} className="px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl group flex items-center shadow-lg shadow-rose-500/5 hover:scale-105 transition-all text-sm font-black tracking-tight border border-rose-100">
                            {skill}
                          </span>
                        ))}
                        {(!analysis.missingSkills || analysis.missingSkills.length === 0) && (
                          <p className="text-zinc-400 font-medium italic text-sm">Target skills are fully aligned with your profile!</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Plan */}
                <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-500/30 flex items-center justify-between group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-black">Strategic Growth Path</h3>
                    <p className="text-white/70 font-medium max-w-sm">Fix these missing skills to enter the 90th percentile of applicants.</p>
                  </div>
                  <div className="relative z-10 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all cursor-pointer shadow-2xl">
                    <HiOutlineArrowSmUp size={40} className="group-hover:-translate-y-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ResumeAnalyzer;

