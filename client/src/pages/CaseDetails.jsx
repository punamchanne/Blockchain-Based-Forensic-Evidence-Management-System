import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const CaseDetails = () => {
    const { id } = useParams();
    const [caseData, setCaseData] = useState(null);
    const [evidenceList, setEvidenceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleCloseCase = async () => {
        if (!window.confirm("Are you sure you want to close this case? You won't be able to add more files later.")) return;
        try {
            await api.put(`/cases/${id}/status`, { status: 'closed' });
            const { data } = await api.get(`/cases/${id}`);
            setCaseData(data);
        } catch (error) {
            console.error("Failed to close case", error);
            alert("Failed to close case. Please try again.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: cData } = await api.get(`/cases/${id}`);
                setCaseData(cData);
                if (cData && cData.caseId) {
                    const { data: eData } = await api.get(`/evidence/${cData.caseId}`);
                    setEvidenceList(eData);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch details", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">Deciphering Records...</p>
            </div>
        </div>
    );

    if (!caseData) return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
            <div className="text-center bg-gray-50 border border-gray-100 p-16 rounded-[4rem] max-w-md w-full shadow-sm">
                <div className="text-6xl mb-8 opacity-20">📁</div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Case Not Found</h2>
                <p className="text-gray-400 mb-10 text-sm font-bold uppercase tracking-widest">This record does not exist on this node.</p>
                <Link to="/admin">
                    <button className="bg-gray-950 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-100">← Return Home</button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900 relative">
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Premium Dark Sidebar */}
            <aside className={`bg-gray-950 border-r border-white/5 z-30 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col fixed h-full shadow-2xl`}>
                <div className="p-8 border-b border-white/5">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">☘️</div>
                        <span className={`font-black text-white text-lg tracking-tight uppercase ${!sidebarOpen ? 'hidden' : ''}`}>SKITCH.</span>
                    </Link>
                </div>
                <nav className="p-6 mt-8">
                    <Link to="/admin" className="w-full flex items-center gap-4 px-4 py-4 bg-white/5 text-emerald-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                        <span>📊</span> <span className={!sidebarOpen ? 'hidden' : ''}>Work List</span>
                    </Link>
                </nav>
                <div className="p-8 mt-auto border-t border-white/5">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                        {sidebarOpen ? '← Collapse' : '→'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 bg-white relative z-10 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                {/* Hero Header */}
                <div className="relative p-8 md:p-14 lg:p-20 border-b border-gray-100">
                    <div className="absolute top-0 right-0 w-[40%] h-full bg-emerald-50/20 blur-[100px] pointer-events-none"></div>
                    
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 relative z-10">
                        <div className="space-y-8 flex-1">
                            <div className="flex flex-wrap gap-4 items-center">
                                <span className="text-[10px] font-black bg-gray-900 text-white px-5 py-2 rounded-xl uppercase tracking-[0.2em] shadow-xl shadow-gray-200">#CASE_{caseData.caseId}</span>
                                <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase border-2 ${caseData.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                                    Status: {caseData.status}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase leading-none">{caseData.incidentType}</h1>
                            <p className="text-gray-400 text-lg font-bold uppercase tracking-widest leading-relaxed max-w-3xl border-l-4 border-emerald-500 pl-8 py-4 italic">{caseData.description}</p>
                        </div>

                        <div className="flex gap-4 w-full lg:w-auto shrink-0">
                            {caseData.status === 'open' ? (
                                <>
                                    <button onClick={handleCloseCase} className="flex-1 sm:flex-none border-2 border-red-50 text-red-500 hover:bg-red-500 hover:text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all">Close Case</button>
                                    <Link to={`/upload-evidence/${caseData.caseId}`} className="flex-1 sm:flex-none">
                                        <button className="w-full bg-emerald-600 text-white hover:bg-gray-900 px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/10">+ Add Evidence</button>
                                    </Link>
                                </>
                            ) : (
                                <div className="bg-gray-100 px-12 py-5 rounded-[2rem] text-gray-400 font-black text-[11px] uppercase tracking-[0.2em] border border-gray-200">🔒 Case Fully Locked</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="p-8 md:p-14 lg:p-20 pt-16 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-50/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Total Evidence Stream</p>
                            <div className="text-6xl font-black text-gray-950 leading-none">{evidenceList.length}<span className="text-xl text-emerald-500 ml-2">Files</span></div>
                        </div>
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-emerald-50/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">System Integrity</p>
                            <div className="text-5xl font-black text-emerald-600 leading-none tracking-tighter">SECURE.</div>
                        </div>
                        <div className="bg-gray-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 lg:col-span-1">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/20 blur-[60px] rounded-full"></div>
                             <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Blockchain Node</p>
                             <div className="text-xl font-black uppercase tracking-tighter opacity-80 leading-none">Main Hub Active</div>
                        </div>
                    </div>

                    {/* Evidence Timeline */}
                    <div className="space-y-12">
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-sm font-black text-gray-950 uppercase tracking-[0.4em]">Evidence Vault</h2>
                            <div className="flex-1 h-px bg-gray-100"></div>
                        </div>

                        {evidenceList.length === 0 ? (
                            <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                                <div className="text-7xl mb-8 opacity-20">📂</div>
                                <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter mb-4">No records in vault</h3>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Connect your evidence stream to this node.</p>
                            </div>
                        ) : (
                            <div className="grid gap-10">
                                {evidenceList.map((item, idx) => (
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={item._id} className="group bg-white p-10 rounded-[4rem] border border-gray-100 hover:border-emerald-200 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-emerald-50/50 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600 opacity-0 group-hover:opacity-100 transition-all"></div>
                                        <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center relative z-10">
                                            <div className="shrink-0">
                                                <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-5xl overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-500"
                                                     onClick={() => item.fileUrl && window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.fileUrl}`, '_blank')}>
                                                    {(item.fileType === 'Image' || item.fileType === 'Forensic Sketch') && item.fileUrl ? (
                                                        <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.fileUrl}`} alt="Evidence" className="w-full h-full object-cover"/>
                                                    ) : (
                                                        <span className="opacity-30 translate-y-1">{item.fileType === 'Video' ? '🎥' : item.fileType === 'Audio' ? '🎵' : '📄'}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0 font-bold uppercase tracking-tighter">
                                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                                    <h4 className="text-3xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors uppercase">{item.evidenceId}</h4>
                                                    <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-xl border border-emerald-200 uppercase tracking-[0.2em]">Verified Hub</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
                                                        <span className="text-[8px] font-black text-gray-400 block mb-2 tracking-[0.1em]">IPFS_CONTENT_HASH</span>
                                                        <span className="text-[10px] text-gray-600 line-clamp-1 opacity-70">0x_{item.ipfsHash}</span>
                                                    </div>
                                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
                                                        <span className="text-[8px] font-black text-gray-400 block mb-2 tracking-[0.1em]">BLOCKCHAIN_TX</span>
                                                        <span className="text-[10px] text-gray-600 line-clamp-1 opacity-70">{item.blockchainTxHash}</span>
                                                    </div>
                                                </div>

                                                {item.forensicReport && (
                                                    <div className="mt-8 p-8 bg-emerald-50/50 rounded-[2.5rem] border border-emerald-100/50 flex flex-col sm:flex-row gap-8 sm:items-center">
                                                        <div className="shrink-0 border-r border-emerald-100 pr-8 hidden sm:block">
                                                            <div className="text-[9px] font-black text-emerald-600 tracking-widest mb-1">PROBABILITY</div>
                                                            <div className="text-4xl font-black text-gray-900">{item.forensicReport.faceMatchProbability}%</div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-[9px] font-black text-emerald-600 tracking-widest mb-2">AUDIT_DETAILS</div>
                                                            <div className="text-sm font-bold text-gray-600 italic tracking-normal">"{item.forensicReport.crimeContext}"</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="shrink-0 w-full lg:w-auto">
                                                <button onClick={() => item.fileUrl && window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.fileUrl}`, '_blank')} className="w-full lg:w-auto bg-gray-950 text-white hover:bg-emerald-600 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl shadow-gray-100">Open File</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CaseDetails;
