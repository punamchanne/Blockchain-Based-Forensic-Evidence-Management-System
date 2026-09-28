import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const SuperAdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalCases: 0, activeCases: 0, totalOfficers: 0, totalEvidence: 0 });
    const [cases, setCases] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Registration Form State
    const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [casesRes, adminsRes, statsRes] = await Promise.all([
                    api.get('/cases'),
                    api.get('/auth/admins'),
                    api.get('/dashboard/stats')
                ]);
                setCases(casesRes.data);
                setAdmins(adminsRes.data);
                setStats(statsRes.data.stats);
                setActivityLog(statsRes.data.activity);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register-admin', adminForm);
            setMsg('New officer successfully registered on node.');
            setAdminForm({ name: '', email: '', password: '' });
            // Refresh admin list
            const { data } = await api.get('/auth/admins');
            setAdmins(data);
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            setMsg(error.response?.data?.message || 'Registration failed.');
        }
    };

    const sidebarItems = [
        { id: 'overview', icon: '🌍', label: 'Main Control' },
        { id: 'cases', icon: '📂', label: 'All Records' },
        { id: 'officers', icon: '👮', label: 'Team List' },
        { id: 'analytics', icon: '📈', label: 'Data Charts' },
        { id: 'news', icon: '🔔', label: 'Latest News' },
        { id: 'settings', icon: '⚙️', label: 'Settings' },
    ];

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-950 text-white font-sans">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-8 shadow-2xl shadow-emerald-500/20"></div>
            <p className="font-black uppercase tracking-[0.4em] text-xs opacity-50">Syncing Master Node...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900 relative">
             {/* Master Sidebar */}
             <aside className="bg-gray-950 w-72 hidden lg:flex flex-col fixed h-full shadow-2xl z-20 overflow-y-auto">
                <div className="p-10 border-b border-white/5 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20">☘️</div>
                        <span className="font-black text-white text-2xl tracking-tighter uppercase leading-none">SKITCH.</span>
                    </div>
                </div>

                <nav className="px-6 space-y-3 pb-20">
                    {sidebarItems.map(item => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all group ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                            <span className="text-xl opacity-70 group-hover:scale-110 transition-transform">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                    
                    <div className="pt-10">
                        <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center gap-5 px-6 py-4 text-gray-600 hover:text-red-400 font-bold text-[11px] uppercase tracking-widest transition-all">
                            <span className="text-sm">🏮</span> Log Out Now
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Dashboard Content */}
            <main className="flex-1 lg:ml-72 bg-white min-h-screen relative z-10">
                {/* Fixed Top Bar */}
                <div className="p-10 lg:p-14 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
                     <div className="flex items-center gap-6">
                        <div className="bg-gray-50 px-6 py-2.5 rounded-full border border-gray-100 flex items-center gap-3">
                            <span className="text-[10px] font-black text-emerald-600">{currentTime.toLocaleTimeString()}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Main Center is online</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest pt-1">Node Security Level: <span className="text-emerald-600 font-black">99.2%</span></span>
                     </div>
                </div>

                <div className="p-10 lg:p-14 pt-0">
                    <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 animate-in fade-in slide-in-from-bottom-5">
                            <div className="grid md:grid-cols-4 gap-8">
                                {[
                                    { label: "Total Cases", val: stats.totalCases, icon: "📂", color: "white" },
                                    { label: "Active Now", val: stats.activeCases, icon: "⚡", color: "emerald" },
                                    { label: "Total Team", val: stats.totalOfficers, icon: "👮", color: "white" },
                                    { label: "Safe Files", val: stats.totalEvidence, icon: "📁", color: "white" }
                                ].map((s, i) => (
                                    <div key={i} className={`p-10 rounded-[3.5rem] border transition-all ${s.color === 'emerald' ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-50' : 'bg-white border-gray-100 hover:shadow-2xl hover:shadow-emerald-50'}`}>
                                        <div className={`text-[9px] font-black uppercase tracking-[0.3em] mb-6 ${s.color === 'emerald' ? 'text-emerald-100' : 'text-gray-400'}`}>{s.label}</div>
                                        <div className="text-5xl font-black leading-none">{s.val}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid lg:grid-cols-12 gap-10">
                                <div className="lg:col-span-12 bg-white rounded-[4rem] border border-gray-100 p-12 shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-all">
                                    <div className="flex justify-between items-center mb-10 text-left px-2 border-b border-gray-50 pb-8">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Main Operations Hub</h2>
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">GLOBAL_SYNC_LIVE</span>
                                    </div>
                                    <div className="space-y-6">
                                        {activityLog.length === 0 ? (
                                            <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 uppercase tracking-widest font-black text-gray-300 text-xs">
                                                <div className="text-4xl mb-4 opacity-30">🔌</div>
                                                System is live. Waiting for officer logs.
                                            </div>
                                        ) : (
                                            activityLog.map((log, i) => (
                                                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-white transition-all group/item shadow-sm">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-lg group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all">💼</div>
                                                        <div>
                                                            <p className="text-lg font-black text-gray-950 uppercase tracking-tighter leading-none">{log.action || log.msg}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{log.performedBy?.name ? `Task by ${log.performedBy.name}` : `System Task`}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-[11px] font-black text-emerald-600 bg-white px-6 py-2 rounded-xl mt-4 sm:mt-0 uppercase tracking-widest border border-gray-100">{new Date(log.time || log.timestamp).toLocaleString()}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'cases' && (
                        <motion.div key="cases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                             <div className="flex justify-between items-center mb-10">
                                <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">All Records</h1>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">{cases.length} Total</span>
                             </div>

                             <div className="grid gap-6 pb-20">
                                {cases.length === 0 ? (
                                    <div className="text-center py-24 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100 uppercase tracking-widest font-black text-gray-300">No records found on nodes.</div>
                                ) : (
                                    cases.map((c, i) => (
                                        <motion.div key={c._id} className="group bg-white border border-gray-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-xl transition-all">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black bg-emerald-600 text-white px-4 py-1.5 rounded-xl uppercase">#{c.caseId}</span>
                                                        <span className="text-[9px] font-black text-gray-300 uppercase">OFFICER: {c.createdBy?.name || 'SYNCED'}</span>
                                                    </div>
                                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none group-hover:text-emerald-600 transition-colors">{c.incidentType}</h3>
                                                    <p className="text-sm font-bold text-gray-400 uppercase leading-relaxed max-w-2xl">{c.description}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-4 min-w-[150px]">
                                                    <div className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 ${c.status === 'open' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>{c.status === 'open' ? 'PENDING' : 'CLOSED'}</div>
                                                    <Link to={`/case/${c._id}`} className="bg-gray-950 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all text-center w-full">Detailed Analysis</Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                             </div>
                        </motion.div>
                    )}

                    {activeTab === 'officers' && (
                        <motion.div key="officers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-5xl">
                            <div className="p-10 bg-emerald-600 rounded-[3rem] text-white shadow-2xl flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-2">Current Active Team</p>
                                    <h3 className="text-4xl font-black uppercase">{admins.length} Officers Registered</h3>
                                </div>
                                <div className="text-5xl">👮</div>
                            </div>

                            <div className="bg-white border border-gray-100 p-12 rounded-[4rem] shadow-xl">
                                <h2 className="text-3xl font-black uppercase mb-10 tracking-tighter">Register New Officer</h2>
                                {msg && <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">{msg}</div>}
                                <form onSubmit={handleCreateAdmin} className="grid md:grid-cols-3 gap-6">
                                    <input type="text" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-950 uppercase text-xs" placeholder="OFFICER NAME" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} required />
                                    <input type="email" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-950 text-xs" placeholder="email@agency.com" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} required />
                                    <input type="password" className="w-full bg-gray-50 border border-transparent rounded-2xl px-6 py-4 outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold text-gray-950 text-xs" placeholder="••••••••" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} required />
                                    <div className="md:col-span-3 pt-4">
                                        <button className="w-full bg-gray-950 text-white font-black py-5 rounded-2xl uppercase tracking-[0.4em] text-xs hover:bg-emerald-600 transition-all">Add To Central Database +</button>
                                    </div>
                                </form>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 pb-20">
                                {admins.map((officer, i) => (
                                    <div key={i} className="p-8 bg-gray-50 border border-gray-100 rounded-[3rem] flex items-center justify-between group hover:bg-white hover:border-emerald-100 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-gray-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">👤</div>
                                            <div>
                                                <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{officer.name}</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{officer.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-emerald-600 bg-white px-4 py-2 rounded-xl border border-gray-100 uppercase tracking-widest">ACTIVE</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'analytics' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-20 bg-gray-50 rounded-[4rem] text-center border-2 border-dashed border-gray-200">
                             <div className="text-6xl mb-10">📈</div>
                             <h1 className="text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Data Trends</h1>
                             <p className="text-gray-400 text-lg font-bold uppercase tracking-widest max-w-lg mx-auto leading-relaxed">Centralized metrics and forecasting coming soon to your node.</p>
                        </motion.div>
                    )}

                    {['news', 'settings'].map(tab => (
                        activeTab === tab && (
                            <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-20 bg-gray-50 rounded-[4rem] text-center border-2 border-dashed border-gray-200 uppercase tracking-widest font-black text-gray-300">
                                {tab} SECTION COMING SOON
                            </motion.div>
                        )
                    ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default SuperAdminDashboard;
