import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const [cases, setCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const casesRes = await api.get('/cases');
            setCases(Array.isArray(casesRes.data) ? casesRes.data : []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Node Connection Failed.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const filteredCases = cases.filter(c => {
        const matchesSearch = (c.caseId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.incidentType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const stats = {
        total: cases.length,
        open: cases.filter(c => c.status === 'open').length,
        closed: cases.filter(c => c.status === 'closed').length,
    };

    const openPercent = stats.total > 0 ? (stats.open / stats.total) * 100 : 0;

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return {
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: d.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' }),
            time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900 relative selection:bg-emerald-50 selection:text-emerald-950 overflow-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#10b981 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Premium Dark Sidebar */}
            <aside className={`bg-[#050505] border-r border-white/5 z-40 transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-72' : 'w-24'} hidden lg:flex flex-col fixed h-full shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)]`}>
                <div className="p-10 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">☘️</div>
                        {sidebarOpen && (
                            <div className="flex flex-col">
                                <span className="font-black text-white text-xl tracking-tighter uppercase leading-none">SKITCH.</span>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-1">ADMIN_NODE</span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 mt-10 px-6 space-y-3">
                    {[
                        { id: 'work', icon: '📊', label: 'Work Feed', path: '/admin' },
                        { id: 'sketch', icon: '👤', label: 'Face Sketch', path: '/generate-sketch' },
                        { id: 'vault', icon: '📁', label: 'Secure Vault', path: '/criminals' },
                        { id: 'add', icon: '⚡', label: 'New Record', path: '/create-case' },
                        { id: 'alert', icon: '🔔', label: 'Live News', path: '/admin/news' },
                    ].map(item => (
                        <Link key={item.id} to={item.path} className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black text-[11px] transition-all uppercase tracking-[0.2em] relative group ${item.path === '/admin' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                            <span className="text-xl opacity-70 group-hover:scale-110 transition-transform">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                            {item.path === '/admin' && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
                        </Link>
                    ))}
                </nav>

                <div className="p-8 border-t border-white/5 mt-auto">
                    <button onClick={logout} className="w-full flex items-center gap-5 px-6 py-4 text-gray-500 hover:text-red-500 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all">🚪 {sidebarOpen && <span>Secure Log Out</span>}</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 transition-all duration-500 bg-white relative z-10 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-24'}`}>
                {/* Header Profile Bar */}
                <div className="p-8 lg:px-14 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30">
                     <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-1">Operational Area</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{user?.name ? `Logged in as Officer ${user.name}` : 'Node Access Granted'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end mr-4 hidden sm:flex">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{currentTime.toLocaleDateString()}</span>
                            <span className="text-xs font-black text-emerald-600">{currentTime.toLocaleTimeString()}</span>
                        </div>
                        <Link to="/setup" className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-emerald-50 hover:border-emerald-100 transition-all">⚙️</Link>
                     </div>
                </div>

                <div className="flex flex-col xl:flex-row min-h-screen">
                    {/* Left Column: Data Stream */}
                    <div className="flex-1 p-8 lg:p-14 overflow-y-auto border-r border-gray-50">
                        <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-8">
                            <div className="space-y-4">
                                <h1 className="text-6xl font-black text-gray-950 tracking-tighter uppercase leading-none mb-4">Command Center</h1>
                                <div className="flex gap-4">
                                    <div className="bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Connection</span>
                                    </div>
                                    <button onClick={fetchData} className="px-6 py-2 bg-gray-950 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2">🔄 Force Refresh</button>
                                </div>
                            </div>
                            <Link to="/create-case">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-emerald-600 text-white font-black px-12 py-5 rounded-[2rem] text-xs uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]">+ Start New Case</motion.button>
                            </Link>
                        </div>

                        {/* Visual Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {[
                                { label: "Total Cases Recorded", val: stats.total, icon: "📁", color: "bg-white border-2 border-gray-50" },
                                { label: "Working on Node", val: stats.open, icon: "⚡", color: "bg-gray-950 text-white shadow-2xl" },
                                { label: "Completed Sync", val: stats.closed, icon: "✅", color: "bg-emerald-50 border border-emerald-100" }
                            ].map((s, i) => (
                                <div key={i} className={`p-10 rounded-[3rem] ${s.color} transition-all relative overflow-hidden group`}>
                                    <div className="absolute top-4 right-6 text-4xl opacity-10 group-hover:opacity-20 transition-all">{s.icon}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">{s.label}</div>
                                    <div className="text-5xl font-black leading-none">{s.val}</div>
                                </div>
                            ))}
                        </div>

                        {/* Data Filter Bar */}
                        <div className="mb-14 relative group">
                            <input type="text" placeholder="Search by case name, ID or incident details..." className="w-full bg-gray-50 border border-gray-100 rounded-[2.5rem] py-7 px-14 outline-none focus:bg-white focus:border-emerald-500 focus:shadow-[0_0_50px_rgba(16,185,129,0.05)] transition-all font-bold text-gray-950 uppercase tracking-tighter text-base placeholder:text-gray-300" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">🔍</div>
                        </div>

                        {/* The Feed */}
                        <div className="space-y-16 pb-20">
                            <h2 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] mb-12 border-b border-gray-50 pb-8 flex items-center justify-between">
                                LIVE DATA STREAM
                                <span className="text-emerald-500/40">MASTER LINK ACTIVE</span>
                            </h2>
                            
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-[4rem] text-center border-2 border-dashed border-gray-100">
                                         <div className="w-10 h-10 border-[6px] border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                                         <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Establishing secure connection...</p>
                                    </div>
                                ) : filteredCases.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 bg-gray-50 rounded-[5rem] border-2 border-dashed border-gray-100 text-center">
                                        <div className="text-6xl mb-8 opacity-20">📂</div>
                                        <p className="font-black uppercase tracking-[0.2em] text-gray-300 text-lg mb-8">Node is empty.</p>
                                        <Link to="/create-case" className="bg-emerald-600 text-white px-12 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-50 hover:bg-gray-950 transition-all">+ Add Entry Now</Link>
                                    </div>
                                ) : (
                                    filteredCases.map((c, idx) => {
                                        const { date, fullDate, time } = formatDateTime(c.createdAt);
                                        return (
                                            <motion.div layout key={c._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="group flex flex-col sm:flex-row items-stretch gap-10">
                                                {/* Advanced Time Indicator */}
                                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:w-32 text-right shrink-0 pt-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-lg font-black text-gray-950 tracking-tighter leading-none">{time.split(':')[0]}:{time.split(':')[1]}</span>
                                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">{time.split(' ')[1]}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end border-t border-gray-100 pt-3 mt-3 hidden sm:flex">
                                                        <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tighter">{date}</span>
                                                        <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest mt-1">LOGGED</span>
                                                    </div>
                                                </div>

                                                {/* Glass Case Card */}
                                                <div className="flex-1 bg-white border border-transparent p-10 rounded-[3rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.08)] hover:border-emerald-100 transition-all duration-500 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-emerald-50/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                                                        <div className="space-y-6">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-[9px] font-black bg-gray-950 text-white px-4 py-1.5 rounded-lg border border-white/10 uppercase tracking-widest">ID: {c.caseId}</span>
                                                                <div className="h-1 w-8 bg-gray-100 rounded-full"></div>
                                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">LOCATION_{c.location || 'GLOBAL_HQ'}</span>
                                                            </div>
                                                            <h3 className="text-4xl font-black text-gray-950 uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">{c.incidentType}</h3>
                                                            <p className="text-base font-bold text-gray-400 leading-relaxed max-w-xl line-clamp-2">{c.description}</p>
                                                        </div>
                                                        <Link to={`/case/${c._id}`} className="bg-gray-50 text-gray-950 border border-gray-100 hover:bg-emerald-600 hover:text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shrink-0 shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 active:scale-95">Open Record →</Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: Time Feed & Hub */}
                    <div className="w-full xl:w-[28rem] bg-gray-50/50 p-10 lg:p-14 overflow-y-auto">
                        <div className="mb-24">
                             <div className="flex justify-between items-center mb-14">
                                <h2 className="text-sm font-black text-gray-950 uppercase tracking-widest flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-3.5 h-3.5 rounded-full bg-red-600"></div>
                                        <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-30"></div>
                                    </div>
                                    Incident Stream
                                </h2>
                                <div className="text-[9px] font-black text-red-600 uppercase tracking-widest">SYNC_ACTIVE</div>
                             </div>
                             <div className="space-y-1 relative">
                                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                                {cases.length === 0 ? (
                                    <div className="text-center py-20 bg-white border border-gray-100 rounded-[3rem] uppercase tracking-widest font-black text-gray-200 text-[10px]">NO_ALERTS</div>
                                ) : (
                                    cases.slice(0, 5).map((caseItem, i) => {
                                        const { time } = formatDateTime(caseItem.createdAt);
                                        return (
                                            <div key={i} className="flex gap-8 group/alert pb-10">
                                                <div className="w-5 h-5 rounded-full bg-white border-4 border-emerald-500 shadow-lg relative z-10 shrink-0 mt-1 transition-all group-hover/alert:scale-125"></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-[11px] font-black text-gray-950 uppercase">{time}</span>
                                                        <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-widest">NEW_ENTRY</span>
                                                    </div>
                                                    <div className="p-6 bg-white border border-gray-100 rounded-[2rem] group-hover/alert:border-emerald-200 group-hover/alert:shadow-2xl group-hover/alert:shadow-emerald-50/50 transition-all">
                                                        <p className="text-[11px] font-black text-gray-700 uppercase tracking-tighter leading-snug">
                                                            Alert: <span className="text-gray-950">#{caseItem.incidentType}</span> from {caseItem.location || 'Central Node'}.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                             </div>
                        </div>

                        {/* Summary Metrics */}
                        <div>
                             <h2 className="text-sm font-black text-gray-950 uppercase tracking-widest mb-12 flex items-center gap-4">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"></span>
                                Core Metrics
                             </h2>
                             <div className="space-y-10">
                                 {/* Central Gauge */}
                                 <div className="p-12 bg-white border border-gray-100 rounded-[4rem] shadow-sm text-center relative overflow-hidden group">
                                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-50/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                     <div className="w-40 h-40 rounded-full border-[12px] border-emerald-50 mx-auto relative flex items-center justify-center">
                                         <div className="flex flex-col relative z-10">
                                            <span className="text-4xl font-black text-gray-950 leading-none">{Math.round(openPercent) || 0}%</span>
                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-2">Active Node</span>
                                         </div>
                                         <svg className="absolute inset-[-12px] rotate-[-90deg]" viewBox="0 0 100 100">
                                             <circle cx="50" cy="50" r="44" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray={`${openPercent * 2.76} 276`} strokeLinecap="round" className="drop-shadow-2xl shadow-emerald-500"></circle>
                                         </svg>
                                     </div>
                                     <div className="mt-12 flex justify-center gap-8">
                                         <div className="flex flex-col">
                                             <span className="text-xl font-black text-gray-950">{stats.total}</span>
                                             <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Recorded</span>
                                         </div>
                                         <div className="w-px h-10 bg-gray-100"></div>
                                         <div className="flex flex-col">
                                             <span className="text-xl font-black text-emerald-600">{stats.open}</span>
                                             <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                                         </div>
                                     </div>
                                 </div>

                                 {/* Minimalist Grid Chart */}
                                 <div className="p-10 bg-gray-950 rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/30 blur-[60px] rounded-full"></div>
                                     <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-12">Weekly Activity Pulse</p>
                                     <div className="flex items-end justify-between h-28 gap-4 px-2 relative z-10">
                                         {[40, 70, 30, 90, 50, 80, 60].map((h, i) => (
                                             <div key={i} className="flex-1 bg-white/5 rounded-t-xl relative group h-full">
                                                 <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="w-full bg-emerald-600 rounded-t-xl absolute bottom-0 shadow-[0_-10px_30px_rgba(16,185,129,0.3)] group-hover:bg-white transition-all"></motion.div>
                                             </div>
                                         ))}
                                     </div>
                                     <div className="flex justify-between px-2 mt-6">
                                         <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">MON</span>
                                         <span className="text-[7px] font-black text-gray-600 uppercase tracking-widest">SUN</span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
