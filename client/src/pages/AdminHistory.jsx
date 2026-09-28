import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

const AdminHistory = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/dashboard/history');
                setLogs(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch history", error);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Group logs by date
    const groupedLogs = logs.reduce((acc, log) => {
        const date = new Date(log.time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[date]) acc[date] = [];
        acc[date].push(log);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900 relative">
             <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

             <aside className="bg-gray-950 w-64 hidden md:flex flex-col fixed h-full shadow-2xl z-20">
                <div className="p-8 border-b border-white/5">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">☘️</div>
                        <span className="font-bold text-white text-lg tracking-tight uppercase">SKITCH.</span>
                    </Link>
                </div>
                <nav className="p-6 space-y-4">
                    <Link to="/admin" className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">📊 Work List</Link>
                    <Link to="/admin/news" className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">🔔 Latest News</Link>
                    <Link to="/admin/history" className="w-full flex items-center gap-4 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">📝 My History</Link>
                </nav>
            </aside>

            <main className="flex-1 md:ml-64 p-8 md:p-16 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-10 hover:underline">← Back to List</Link>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase">My History</h1>
                    <p className="text-gray-400 text-lg font-bold uppercase tracking-widest mb-20 border-l-4 border-emerald-500 pl-8">Everything you have done, organized by date.</p>

                    {loading ? (
                        <div className="py-20 text-center uppercase tracking-widest font-black text-gray-300">Searching Records...</div>
                    ) : Object.keys(groupedLogs).length === 0 ? (
                        <div className="py-20 text-center uppercase tracking-widest font-black text-gray-300">No History To Show</div>
                    ) : (
                        Object.keys(groupedLogs).map((date, index) => (
                            <div key={date} className="mb-20">
                                <motion.h2 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    {date}
                                </motion.h2>
                                <div className="space-y-6">
                                    {groupedLogs[date].map((item, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="group p-8 bg-gray-50 border border-gray-100 rounded-[3rem] hover:bg-white hover:border-emerald-100 transition-all shadow-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-lg border border-gray-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                        {item.type === "CREATE" ? "📂" : item.type === "UPLOAD" ? "📤" : "📝"}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-gray-950 uppercase tracking-tighter mb-1">{item.action}</h3>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.desc}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                                                    <span className="text-[10px] font-black text-emerald-600 bg-white px-4 py-1.5 rounded-xl border border-gray-100 uppercase tracking-widest">{new Date(item.time).toLocaleTimeString()}</span>
                                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.id}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminHistory;
