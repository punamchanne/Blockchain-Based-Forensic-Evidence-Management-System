import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const CriminalDetails = () => {
    const { id } = useParams();
    const [criminal, setCriminal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCriminal = async () => {
            try {
                const { data } = await api.get(`/criminals/${id}`);
                setCriminal(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch criminal details", err);
                setError("Could not load the profile.");
                setLoading(false);
            }
        };
        fetchCriminal();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Loading Profile...</p>
            </div>
        </div>
    );

    if (error || !criminal) return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8">
            <div className="text-center bg-gray-50 border border-gray-100 p-10 rounded-[2.5rem] max-w-md w-full shadow-sm">
                <div className="text-5xl mb-6 opacity-30">🚫</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
                <p className="text-red-500/60 mb-8 text-sm font-medium">
                    {error || "We couldn't find this person in our database."}
                </p>
                <Link to="/criminals">
                    <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all text-sm shadow-lg shadow-emerald-100">
                        Go Back
                    </button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white p-8 md:p-16 font-sans text-gray-900">
            <div className="max-w-6xl mx-auto">
                {/* Back Link */}
                <div className="flex justify-between items-center mb-12">
                    <Link to="/criminals" className="flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all">
                        ← Back to Records
                    </Link>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-4 py-1.5 border border-emerald-100 rounded-full bg-emerald-50">
                        Profile Verified
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Photo */}
                    <div className="lg:col-span-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-4 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100 overflow-hidden group"
                        >
                            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 relative border border-gray-100">
                                <img
                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${criminal.photos[0]}`}
                                    alt={criminal.name}
                                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                                <div className="absolute bottom-8 left-8 text-white z-10 transition-transform group-hover:translate-y-[-5px] duration-500">
                                    <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">ID Number</div>
                                    <div className="text-3xl font-extrabold tracking-tight uppercase leading-none drop-shadow-md">{criminal.criminalId}</div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                            </div>
                        </motion.div>

                        <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Personal Info</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Full Name</label>
                                    <div className="text-xl font-bold text-gray-900 capitalize">{criminal.name}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Age</label>
                                        <div className="text-lg font-bold text-gray-900">{criminal.age} Years</div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-emerald-600 uppercase mb-1 block">Gender</label>
                                        <div className="text-lg font-bold text-gray-900 capitalize">{criminal.features?.gender || 'N/A'}</div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-emerald-600 uppercase mb-2 block">Last Known Location</label>
                                    <div className="text-xs font-bold text-gray-500 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 italic">"{criminal.address}"</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details & History */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100"
                        >
                            <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-10 flex items-center gap-3">
                                👤 Physical Details
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold text-gray-300 uppercase">Face Shape</div>
                                    <div className="text-base font-bold text-gray-900 capitalize">{criminal.features?.faceShape || 'N/A'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold text-gray-300 uppercase">Skin Tone</div>
                                    <div className="text-base font-bold text-gray-900 capitalize">{criminal.features?.skinTone || 'N/A'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold text-gray-300 uppercase">Hair Type</div>
                                    <div className="text-base font-bold text-gray-900 capitalize">{criminal.features?.hairType || 'N/A'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold text-gray-300 uppercase">Facial Hair</div>
                                    <div className="text-base font-bold text-gray-900 capitalize">{criminal.features?.facialHair || 'None'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold text-gray-300 uppercase">Eyes</div>
                                    <div className="text-base font-bold text-gray-900 capitalize">{criminal.features?.eyeType || 'N/A'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold text-gray-300 uppercase">Nose</div>
                                    <div className="text-base font-bold text-gray-900 capitalize">{criminal.features?.noseType || 'N/A'}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-bold text-gray-300 uppercase">Chin Shape</div>
                                    <div className="text-base font-bold text-gray-900 capitalize">{criminal.features?.chinShape || 'N/A'}</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* History */}
                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10 border-b border-gray-50 pb-6">History of Incidents</h3>

                            {criminal.crimes && criminal.crimes.length > 0 ? (
                                <div className="space-y-8">
                                    {criminal.crimes.map((crime, idx) => (
                                        <div key={idx} className="flex gap-6 relative group">
                                            <div className="flex flex-col items-center mt-1">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border-2 border-white ring-4 ring-emerald-50"></div>
                                                {idx !== criminal.crimes.length - 1 && <div className="w-[1.5px] flex-grow bg-gray-100 my-2"></div>}
                                            </div>
                                            <div className="pb-8 w-full">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                                                    <div className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors capitalize">
                                                        {crime.incidentType}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                                                        {new Date(crime.date).toLocaleDateString()} • {crime.location}
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-gray-400 bg-gray-50 p-5 rounded-2xl border border-gray-50 leading-relaxed italic">
                                                    "{crime.description}"
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-300 text-xs font-bold uppercase tracking-widest">
                                    No incidents recorded.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CriminalDetails;
