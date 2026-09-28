import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const GenerateSketch = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        caseId: '',
        gender: 'male',
        age: '30',
        faceShape: 'oval',
        eyeType: 'normal',
        noseType: 'straight',
        hairType: 'short',
        skinTone: 'medium',
        facialHair: 'none',
        chinShape: 'round',
        includeBackground: false
    });

    const [loading, setLoading] = useState(false);
    const [searchingMatches, setSearchingMatches] = useState(false);
    const [matchResults, setMatchResults] = useState([]);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMsg('');
        setGeneratedImage(null);
        setMatchResults([]);
        setHasSearched(false);

        try {
            const { data } = await api.post('/sketch/generate', formData);
            if (data.success) {
                setGeneratedImage(data.evidence.fileUrl);
                setMsg('Sketch created successfully!');
            } else {
                setError('Failed to create sketch.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchMatches = async () => {
        if (!generatedImage) return;
        setSearchingMatches(true);
        setError('');

        try {
            const { data } = await api.post('/criminals/match', { sketchUrl: generatedImage });
            if (data.success) {
                setMatchResults(data.matches);
                if (data.matches.length === 0) {
                    setMsg('No matches found in our records.');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Search failed.');
        } finally {
            setSearchingMatches(false);
            setHasSearched(true);
        }
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
                    <Link to="/admin" className="w-full flex items-center gap-4 px-5 py-4 bg-white/5 text-emerald-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                        <span>📊</span> <span className={!sidebarOpen ? 'hidden' : ''}>Work Stream</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-500 bg-white relative z-10 ${sidebarOpen ? 'md:ml-64' : 'md:ml-24'}`}>
                <div className="max-w-7xl mx-auto p-8 md:p-14 lg:p-20">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">AI Operational Tool</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                            Forensic <span className="text-emerald-600">Sketch.</span>
                        </h1>
                        <p className="text-gray-400 mt-6 text-lg font-bold uppercase tracking-widest max-w-2xl leading-relaxed">Synthesize digital portraits from descriptive suspect profiles.</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Parameters Panel */}
                        <div className="lg:col-span-7 bg-white border border-gray-100 p-10 md:p-14 rounded-[4rem] shadow-sm relative overflow-hidden group hover:border-emerald-100 transition-all">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/20 blur-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-12 border-b border-gray-50 pb-8 flex justify-between items-center">
                                SUSPECT PROFILE INPUT
                                <span className="text-emerald-500/30">MODULE_SK-01</span>
                            </h3>

                            <form onSubmit={handleGenerate} className="space-y-8 relative z-10">
                                <div className="group/field">
                                    <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest group-focus-within/field:text-emerald-600 transition-colors">Case Reference Number</label>
                                    <input
                                        type="text"
                                        name="caseId"
                                        className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-sm text-gray-950 tracking-tighter"
                                        placeholder="E.G. CRIME-NODE-404"
                                        value={formData.caseId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="group/field">
                                        <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Identify Gender</label>
                                        <select name="gender" className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={formData.gender} onChange={handleChange}>
                                            <option value="male">MALE_NODE</option>
                                            <option value="female">FEMALE_NODE</option>
                                        </select>
                                    </div>
                                    <div className="group/field">
                                        <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Estimated Age</label>
                                        <input type="text" name="age" className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-[10px]" placeholder="25-30" value={formData.age} onChange={handleChange} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="group/field">
                                        <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Skull Structure</label>
                                        <select name="faceShape" className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={formData.faceShape} onChange={handleChange}>
                                            <option value="oval">OVAL_GEOM</option>
                                            <option value="round">ROUND_GEOM</option>
                                            <option value="square">SQUARE_GEOM</option>
                                            <option value="long">EXTENDED_GEOM</option>
                                        </select>
                                    </div>
                                    <div className="group/field">
                                        <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Hair Profile</label>
                                        <select name="hairType" className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={formData.hairType} onChange={handleChange}>
                                            <option value="short">SHORT_TRIM</option>
                                            <option value="long">LONG_STYLE</option>
                                            <option value="bald">CLEAN_SHAVEN</option>
                                            <option value="curly">TEXTURED_CURL</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="group/field">
                                        <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Optical Profile</label>
                                        <select name="eyeType" className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={formData.eyeType} onChange={handleChange}>
                                            <option value="normal">BALANCED_OPTIC</option>
                                            <option value="small">NARROW_OPTIC</option>
                                            <option value="big">ENLARGED_OPTIC</option>
                                        </select>
                                    </div>
                                    <div className="group/field">
                                        <label className="text-[9px] font-black text-gray-400 uppercase mb-3 block tracking-widest">Nasal Structure</label>
                                        <select name="noseType" className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] px-8 py-5 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer" value={formData.noseType} onChange={handleChange}>
                                            <option value="straight">LINEAR</option>
                                            <option value="flat">PRESSED</option>
                                            <option value="pointed">ACUTE</option>
                                            <option value="curved">CONTOURED</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-10 flex flex-col sm:flex-row gap-6">
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setLoading(true);
                                            setMatchResults([]);
                                            setMsg('');
                                            try {
                                                const { data } = await api.post('/criminals/match-attributes', formData);
                                                if (data.success) {
                                                    setMatchResults(data.matches);
                                                    setMsg(data.message);
                                                    setHasSearched(true);
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                setHasSearched(true);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="flex-1 bg-white border-2 border-gray-100 text-gray-400 font-black py-5 rounded-[2rem] text-[10px] uppercase tracking-[0.3em] hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm hover:shadow-xl active:scale-95"
                                    >
                                        Query Node DB
                                    </button>

                                    <button
                                        disabled={loading}
                                        className="flex-[1.5] bg-emerald-600 hover:bg-gray-950 text-white font-black py-5 rounded-[2.5rem] text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-4 group/btn"
                                    >
                                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Synthesize Sketch'}
                                        <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Rendering Hub */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                             <div className="bg-gray-50 min-h-[500px] rounded-[4rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden p-12 transition-all hover:bg-white hover:border-emerald-100">
                                <AnimatePresence mode="wait">
                                {loading && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/90 backdrop-blur-md z-20 flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-8 shadow-2xl shadow-emerald-500/20"></div>
                                        <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">Running Neural Engine...</p>
                                    </motion.div>
                                )}
                                </AnimatePresence>

                                {generatedImage ? (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col items-center">
                                        <div className="relative group/img overflow-hidden rounded-[3rem] border border-gray-200 shadow-2xl bg-white p-3 mb-10 max-w-full">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none translate-y-full group-hover/img:translate-y-0 transition-transform duration-700"></div>
                                            <img
                                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${generatedImage}`}
                                                alt="AI Generated Sketch"
                                                className="w-full h-auto object-cover rounded-[2rem]"
                                            />
                                        </div>

                                        <div className="flex flex-col w-full gap-4 px-6">
                                            <button
                                                onClick={handleSearchMatches}
                                                disabled={searchingMatches}
                                                className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:bg-gray-950 transition-all shadow-xl shadow-emerald-500/10"
                                            >
                                                {searchingMatches ? 'MATCHING_NODES...' : 'INITIATE FACIAL SCAN'}
                                            </button>
                                            <button
                                                onClick={() => { setGeneratedImage(null); setMatchResults([]); setHasSearched(false); }}
                                                className="text-[9px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-all"
                                            >
                                                WIPE_RESULT_CACHE
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12 opacity-30 select-none grayscale group-hover:grayscale-0 transition-all">
                                        <div className="text-[10rem] mb-6 leading-none translate-y-4">👤</div>
                                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-[0.4em] mb-4">Awaiting Signal</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest max-w-[200px] mx-auto opacity-50">Map suspect features to begin neural reconstruction.</p>
                                    </motion.div>
                                )}
                             </div>

                             {/* Match Feed */}
                             <AnimatePresence>
                                {matchResults.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                        <h4 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] pl-4 flex items-center gap-4">
                                            Found Match Probabilities
                                            <div className="flex-1 h-px bg-gray-50"></div>
                                        </h4>
                                        {matchResults.map((result, idx) => (
                                            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 hover:border-emerald-200 shadow-md hover:shadow-xl transition-all flex items-center gap-6 group/match">
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shrink-0 shadow-inner group-hover/match:scale-105 transition-transform duration-500 grayscale group-hover/match:grayscale-0">
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${result.criminal.photos[0]}`}
                                                        alt="Criminal Identity"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 font-bold uppercase tracking-tighter">
                                                    <h5 className="text-xl font-black text-gray-950 truncate leading-none mb-2">{result.criminal.name}</h5>
                                                    <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-100">
                                                        {result.isAttributeMatch ? '98.5% ATTRIBUTE_SYNC' : `${result.similarity}% ALGO_MATCH`}
                                                    </div>
                                                    <Link to={`/criminals/${result.criminal._id}`} className="block mt-4 text-[9px] font-black text-gray-300 hover:text-emerald-700 uppercase tracking-widest transition-all">Identity_Check →</Link>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                             </AnimatePresence>

                             {hasSearched && matchResults.length === 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-8">No matching identities stored.</p>
                                    <Link to="/add-criminal" state={{ sketchUrl: generatedImage, features: formData }}>
                                        <button className="bg-white border border-emerald-200 text-emerald-600 font-black px-10 py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/5 hover:bg-emerald-600 hover:text-white transition-all">Enroll Primary Target +</button>
                                    </Link>
                                </motion.div>
                             )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GenerateSketch;
