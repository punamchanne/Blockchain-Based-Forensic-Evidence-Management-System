import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminNews = () => {
    const news = [
        {
            title: "System Update v2.5",
            date: "Today",
            desc: "All nodes have been updated. The Face Sketch tool is now 40% faster.",
            icon: "⚡"
        },
        {
            title: "Security Alert",
            date: "2 days ago",
            desc: "Main Center has logged a new security setup. Ensure your password is safe.",
            icon: "🛡️"
        },
        {
            title: "New Agency Joined",
            date: "Last Week",
            desc: "Mumbai Police HQ has joined the SKITCH network.",
            icon: "👮"
        }
    ];

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
                    <Link to="/admin/news" className="w-full flex items-center gap-4 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">🔔 Latest News</Link>
                    <Link to="/admin/history" className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">📝 My History</Link>
                </nav>
            </aside>

            <main className="flex-1 md:ml-64 p-8 md:p-16 relative z-10">
                <div className="max-w-4xl">
                    <Link to="/admin" className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-10 hover:underline">← Back to List</Link>
                    <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 uppercase">Latest News</h1>
                    <p className="text-gray-400 text-lg font-bold uppercase tracking-widest mb-20 border-l-4 border-emerald-500 pl-8">Live updates from the agency network.</p>

                    <div className="space-y-8">
                        {news.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative group">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-gray-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">{item.icon}</div>
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tighter">{item.title}</h3>
                                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest">{item.date}</span>
                                        </div>
                                        <p className="text-gray-400 font-bold text-base uppercase tracking-tighter">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminNews;
