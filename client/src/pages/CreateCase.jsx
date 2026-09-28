import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const CreateCase = () => {
    const { logout } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        caseId: '', incidentType: '', location: '', description: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/cases', formData);
            navigate('/admin');
        } catch (error) {
            alert('Error: Could not save record. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Location search is not supported by your browser.");
            return;
        }

        setFetchingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationString = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                setFormData(prev => ({ ...prev, location: locationString }));
                setFetchingLocation(false);
            },
            (error) => {
                console.error("Error fetching location:", error);
                alert("Could not get your location. Please type it manually.");
                setFetchingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

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
                        <span>📊</span> <span className={!sidebarOpen ? 'hidden' : ''}>Work Stream</span>
                    </Link>
                </nav>
                <div className="p-8 mt-auto border-t border-white/5">
                    <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 text-gray-500 hover:text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">🚪 <span className={!sidebarOpen ? 'hidden' : ''}>Exit Node</span></button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 bg-white relative z-10 ${sidebarOpen ? 'md:ml-64' : 'md:ml-24'}`}>
                <div className="max-w-4xl mx-auto p-8 md:p-14 lg:p-20">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Node Input Area</span>
                        </div>
                        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                            Add New <span className="text-emerald-600">Entry.</span>
                        </motion.h1>
                        <p className="text-gray-400 mt-6 text-lg font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                            Create a secure digital record on the blockchain node.
                        </p>
                    </div>

                    <div className="bg-white rounded-[4rem] border border-gray-100 p-10 md:p-14 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-emerald-100 transition-all">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/20 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-4 block ml-1 tracking-[0.2em]">ID Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-sm text-gray-950 tracking-tighter"
                                        placeholder="E.G. NODE-Z01"
                                        value={formData.caseId}
                                        onChange={e => setFormData({ ...formData, caseId: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-4 block ml-1 tracking-[0.2em]">What happened?</label>
                                    <select
                                        className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer"
                                        value={formData.incidentType}
                                        onChange={e => setFormData({ ...formData, incidentType: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Cyber Crime">CYBER_NODE</option>
                                        <option value="Homicide">CRITICAL_NODE</option>
                                        <option value="Theft">SECURITY_NODE</option>
                                        <option value="Fraud">FINANCE_NODE</option>
                                        <option value="Other">MISC_NODE</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-4 block ml-1 tracking-[0.2em] flex justify-between items-center">
                                    <span>Where?</span>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        className={`text-[9px] font-black text-emerald-600 bg-white px-5 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm ${fetchingLocation ? 'animate-pulse' : ''}`}
                                    >
                                        📍 {fetchingLocation ? 'LOCATING...' : 'SYNC MY GPS'}
                                    </button>
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-sm text-gray-950 tracking-tighter"
                                    placeholder="Location name or coordinates..."
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-4 block ml-1 tracking-[0.2em]">Describe the Story</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-transparent rounded-[2.5rem] px-10 py-8 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-sm text-gray-950 tracking-tighter h-40 placeholder:text-gray-300 resize-none"
                                    placeholder="Write the details here clearly..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>

                            <div className="pt-6 flex flex-col sm:flex-row gap-6">
                                <Link to="/admin" className="flex-1">
                                    <button type="button" className="w-full bg-white border-2 border-gray-100 text-gray-400 font-black py-5 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm">Cancel</button>
                                </Link>
                                <button
                                    disabled={loading}
                                    className="flex-[2] bg-emerald-600 hover:bg-gray-950 text-white font-black py-5 rounded-[2.5rem] text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-4 group"
                                >
                                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Save This Record'}
                                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateCase;
