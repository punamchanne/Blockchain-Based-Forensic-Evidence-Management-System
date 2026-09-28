import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const AddCriminal = () => {
    const [formData, setFormData] = useState({
        criminalId: 'CRIM-' + Date.now().toString().slice(-6),
        name: '',
        address: '',
        age: '',
        gender: 'male',
        faceShape: 'oval',
        eyeType: 'normal',
        noseType: 'straight',
        hairType: 'short',
        skinTone: 'medium',
        facialHair: 'none',
        chinShape: 'round'
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [crimes, setCrimes] = useState([{ incidentType: '', date: '', location: '', description: '' }]);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (location.state) {
            const { sketchUrl, features } = location.state;
            if (features) {
                setFormData(prev => ({
                    ...prev,
                    ...features
                }));
            }
            if (sketchUrl) {
                setPhotoPreview(sketchUrl);
            }
        }
    }, [location]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleCrimeChange = (index, field, value) => {
        const updatedCrimes = [...crimes];
        updatedCrimes[index][field] = value;
        setCrimes(updatedCrimes);
    };

    const addCrimeField = () => {
        setCrimes([...crimes, { incidentType: '', date: '', location: '', description: '' }]);
    };

    const removeCrimeField = (index) => {
        if (crimes.length > 1) {
            setCrimes(crimes.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMsg('');

        try {
            let photoUrl = '';

            if (photo) {
                const photoFormData = new FormData();
                photoFormData.append('file', photo);
                photoFormData.append('caseId', 'CRIMINAL_DATABASE');
                photoFormData.append('fileType', 'Image');
                const uploadRes = await api.post('/evidence/upload', photoFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                photoUrl = uploadRes.data.evidence.fileUrl;
            } else if (location.state?.sketchUrl) {
                const response = await fetch(location.state.sketchUrl);
                const blob = await response.blob();
                const file = new File([blob], "sketch_evidence.jpg", { type: "image/jpeg" });

                const photoFormData = new FormData();
                photoFormData.append('file', file);
                photoFormData.append('caseId', 'CRIMINAL_DATABASE');
                photoFormData.append('fileType', 'Image');
                const uploadRes = await api.post('/evidence/upload', photoFormData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                photoUrl = uploadRes.data.evidence.fileUrl;
            } else {
                setError('Please upload a photo or use a generated sketch.');
                setLoading(false);
                return;
            }

            const payload = {
                criminalId: formData.criminalId,
                name: formData.name,
                address: formData.address,
                age: formData.age,
                photoUrl,
                crimes: JSON.stringify(crimes),
                features: JSON.stringify({
                    gender: formData.gender,
                    faceShape: formData.faceShape,
                    eyeType: formData.eyeType,
                    noseType: formData.noseType,
                    hairType: formData.hairType,
                    skinTone: formData.skinTone,
                    facialHair: formData.facialHair,
                    chinShape: formData.chinShape
                })
            };

            const { data } = await api.post('/criminals', payload);

            if (data.success) {
                setMsg('Record saved successfully!');
                setTimeout(() => navigate('/criminals'), 2000);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save record. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white p-8 md:p-16 font-sans text-gray-900">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <Link to="/criminals" className="text-emerald-600 font-bold text-xs uppercase tracking-widest hover:text-emerald-700 transition-all mb-8 inline-flex items-center gap-2">
                        ← Back to List
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">Add <span className="text-emerald-600">New Profile</span></h1>
                    <p className="text-gray-500 mt-4 text-sm font-medium leading-relaxed">Fill in the details below to add a new person to the records.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 space-y-8">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal Information</h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Full Name</label>
                                    <input
                                        type="text" required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Age</label>
                                    <input
                                        type="number" required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        placeholder="Age"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Gender</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Face Shape</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.faceShape}
                                        onChange={(e) => setFormData({ ...formData, faceShape: e.target.value })}
                                    >
                                        <option value="oval">Oval</option>
                                        <option value="round">Round</option>
                                        <option value="square">Square</option>
                                        <option value="long">Long</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Hair Style</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.hairType}
                                        onChange={(e) => setFormData({ ...formData, hairType: e.target.value })}
                                    >
                                        <option value="short">Short</option>
                                        <option value="long">Long</option>
                                        <option value="bald">Bald</option>
                                        <option value="curly">Curly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Eyes</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.eyeType}
                                        onChange={(e) => setFormData({ ...formData, eyeType: e.target.value })}
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="small">Small</option>
                                        <option value="big">Big</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nose Type</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.noseType}
                                        onChange={(e) => setFormData({ ...formData, noseType: e.target.value })}
                                    >
                                        <option value="straight">Straight</option>
                                        <option value="flat">Flat</option>
                                        <option value="pointed">Pointed</option>
                                        <option value="curved">Curved</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Skin Tone</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.skinTone}
                                        onChange={(e) => setFormData({ ...formData, skinTone: e.target.value })}
                                    >
                                        <option value="fair">Fair</option>
                                        <option value="medium">Medium</option>
                                        <option value="dark">Dark</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Beard/Moustache</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.facialHair}
                                        onChange={(e) => setFormData({ ...formData, facialHair: e.target.value })}
                                    >
                                        <option value="none">None</option>
                                        <option value="beard">Beard</option>
                                        <option value="mustache">Moustache</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Chin Shape</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                        value={formData.chinShape}
                                        onChange={(e) => setFormData({ ...formData, chinShape: e.target.value })}
                                    >
                                        <option value="round">Round</option>
                                        <option value="pointed">Pointed</option>
                                        <option value="square">Square</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Address</label>
                                <textarea
                                    required rows="3"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Last known address"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-1 bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-xl shadow-gray-100 flex flex-col items-center">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 w-full">Photo Upload</h3>

                            <div className="w-full aspect-[4/5] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-300 transition-all">
                                {photoPreview ? (
                                    <div className="w-full h-full relative">
                                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="text-5xl mb-4 opacity-20">👤</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to upload photo</div>
                                    </div>
                                )}
                                <input
                                    type="file" accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute inset-0 bg-emerald-600/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-[2px]">
                                    <span className="text-xs font-bold text-white bg-emerald-600 px-6 py-2 rounded-full shadow-lg">Change Photo</span>
                                </div>
                            </div>

                            <p className="mt-6 text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed">
                                Upload a clear front-facing photo for facial recognition.
                            </p>
                        </div>
                    </div>

                    {/* Crimes */}
                    <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-xl shadow-gray-100">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-6 mb-8">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Incident History</h3>
                            <button
                                type="button" onClick={addCrimeField}
                                className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-5 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all"
                            >
                                + Add Incident
                            </button>
                        </div>

                        <div className="space-y-6">
                            {crimes.map((crime, idx) => (
                                <div key={idx} className="p-8 bg-gray-50 rounded-[2rem] relative border border-gray-100 group">
                                    {crimes.length > 1 && (
                                        <button
                                            type="button" onClick={() => removeCrimeField(idx)}
                                            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Type of Incident</label>
                                            <input
                                                type="text" placeholder="e.g. Theft, Fraud, etc."
                                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all"
                                                value={crime.incidentType}
                                                onChange={(e) => handleCrimeChange(idx, 'incidentType', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</label>
                                            <input
                                                type="date"
                                                className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all"
                                                value={crime.date}
                                                onChange={(e) => handleCrimeChange(idx, 'date', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Details</label>
                                        <textarea
                                            rows="2" placeholder="Brief description of what happened..."
                                            className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-500 transition-all resize-none"
                                            value={crime.description}
                                            onChange={(e) => handleCrimeChange(idx, 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence>
                        {msg && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-bold text-center">
                                {msg}
                            </motion.div>
                        )}
                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold text-center">
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-3xl shadow-lg shadow-emerald-50 uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:bg-gray-100 disabled:text-gray-300"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Saving Profile...
                            </>
                        ) : (
                            <>Save Full Profile →</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCriminal;
