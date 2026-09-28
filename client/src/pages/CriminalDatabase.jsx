import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const CriminalDatabase = () => {
    const [criminals, setCriminals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const fetchCriminals = async () => {
            try {
                const { data } = await api.get('/criminals');
                setCriminals(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch criminal records", err);
                setLoading(false);
            }
        };
        fetchCriminals();
    }, []);

    const filteredCriminals = criminals.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.criminalId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">Opening Vault...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900 relative selection:bg-emerald-50 selection:text-emerald-950">
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Premium Dark Sidebar */}
            <aside className={`bg-gray-950 border-r border-white/5 z-30 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-24'} hidden md:flex flex-col fixed h-full shadow-2xl`}>
                <div className="p-8 border-b border-white/5">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">☘️</div>
                        <span className={`font-black text-white text-lg tracking-tight uppercase ${!sidebarOpen ? 'hidden' : ''}`}>SKITCH.</span>
                    </Link>
                </div>
                <nav className="p-6 mt-8 space-y-3">
                    <Link to="/admin" className="w-full flex items-center gap-4 px-5 py-4 text-emerald-500 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                        <span>📊</span> <span className={!sidebarOpen ? 'hidden' : ''}>Work List</span>
                    </Link>
                </nav>
                <div className="p-8 mt-auto border-t border-white/5">
                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 text-gray-500 hover:text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">🚪 <span className={!sidebarOpen ? 'hidden' : ''}>Exit Node</span></button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 bg-white relative z-10 ${sidebarOpen ? 'md:ml-64' : 'md:ml-24'}`}>
                <div className="max-w-7xl mx-auto p-8 md:p-14 lg:p-20">
                    {/* Simplified Header */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-white bg-emerald-600 px-5 py-2 rounded-xl uppercase tracking-widest shadow-xl shadow-emerald-900/10">All People</span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-5 py-2 rounded-xl border border-emerald-100 italic">
                                    {criminals.length} Found
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                                Person <span className="text-emerald-600">Records.</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                                A simple list to find people and see their history.
                            </p>
                        </div>

                        <div className="flex gap-4 w-full lg:w-auto shrink-0">
                            {user.role === 'admin' && (
                                <Link to="/add-criminal" className="flex-1 lg:flex-none">
                                    <button className="w-full bg-emerald-600 hover:bg-gray-950 text-white px-10 py-5 rounded-[2rem] shadow-xl shadow-emerald-500/10 font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group">
                                        + Add New Person
                                    </button>
                                </Link>
                            )}
                            <Link to={user.role === 'super_admin' ? '/super-admin' : '/admin'} className="flex-1 lg:flex-none">
                                <button className="w-full bg-gray-50 text-gray-400 border border-transparent hover:bg-white hover:border-gray-100 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all">
                                    ← Go Back
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Easy Search Bar */}
                    <div className="mb-20 relative group">
                        <input
                            type="text"
                            placeholder="Type a name or ID number to find someone..."
                            className="w-full bg-gray-50 border border-transparent rounded-[2.5rem] py-8 px-14 text-base font-black text-gray-950 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-[0_20px_40px_-20px_rgba(0,0,0,0.02)] tracking-tighter"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-20">🔍</div>
                    </div>

                    {/* Records Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                        {filteredCriminals.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                                <div className="text-7xl mb-8 opacity-20 select-none grayscale">👤</div>
                                <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter mb-4">No one found</h3>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Try typing a different name.</p>
                            </motion.div>
                        ) : (
                            filteredCriminals.map((criminal, idx) => (
                                <motion.div
                                    key={criminal._id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="bg-white border border-gray-50 rounded-[3.5rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.1)] hover:border-emerald-100 transition-all duration-500 group overflow-hidden relative cursor-default"
                                >
                                    <div className="p-10 relative z-10">
                                        <div className="flex items-start gap-6 mb-10">
                                            <div className="w-24 h-24 rounded-[1.8rem] bg-gray-50 overflow-hidden border border-transparent shadow-inner group-hover:border-emerald-500 transition-all duration-500 shrink-0">
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${criminal.photos[0]}`}
                                                    alt={criminal.name}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 hover:scale-110"
                                                />
                                            </div>
                                            <div className="min-w-0 pt-2 font-black uppercase tracking-tighter">
                                                <div className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-100 mb-3 tracking-widest">
                                                    ID: {criminal.criminalId}
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-950 group-hover:text-emerald-600 transition-colors truncate leading-none mb-3">{criminal.name}</h3>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover:bg-emerald-500 transition-colors"></span>
                                                    AGE: {criminal.age} • {criminal.address.split(',')[0]}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-10">
                                            <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4 border-b border-gray-50 pb-3">Work History</div>
                                            <div className="flex flex-wrap gap-2">
                                                {criminal.crimes.slice(0, 2).map((crime, i) => (
                                                    <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[9px] font-black text-gray-600 uppercase tracking-widest group-hover:bg-white group-hover:border-emerald-100 transition-all transition-all">
                                                        {crime.incidentType.split(' ')[0]}
                                                    </span>
                                                ))}
                                                {criminal.crimes.length > 2 && (
                                                    <span className="px-4 py-2 bg-emerald-100/30 text-emerald-600 rounded-xl text-[9px] font-black border border-emerald-100 uppercase tracking-widest">
                                                        +{criminal.crimes.length - 2} Extra
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Link to={`/criminals/${criminal._id}`}>
                                            <button className="w-full py-5 bg-gray-950 text-white hover:bg-emerald-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-gray-200 hover:shadow-emerald-900/10 active:scale-95">
                                                See More Info →
                                            </button>
                                        </Link>
                                    </div>
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                                </motion.div>
                            ))
                        )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CriminalDatabase;
