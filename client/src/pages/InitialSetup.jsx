import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';

const InitialSetup = () => {
    const [step, setStep] = useState(1); // 1: Loading, 2: Form, 3: Face, 4: Done
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const [formData, setFormData] = useState({
        name: 'Chief Officer',
        email: 'superadmin@skitch.com',
        password: 'admin123'
    });
    const [faceDataUri, setFaceDataUri] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const { data } = await api.get('/auth/setup-status');
                if (data.isSetupComplete) {
                    setIsSetupComplete(true);
                    setStep(0);
                } else {
                    setStep(2);
                }
            } catch {
                setStep(2);
            }
        };
        checkStatus();
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all the details.');
            return;
        }
        if (formData.password.length < 6) {
            setError('The password must be at least 6 characters long.');
            return;
        }
        setError('');
        setStep(3);
    };

    const handleCaptureFace = () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        setFaceDataUri(imageSrc);
    };

    const handleFinalSubmit = async () => {
        if (!faceDataUri) {
            setError('Please take a clear photo of your face.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/setup', {
                ...formData,
                faceDataUri
            });
            if (data.success) {
                setMsg(data.message);
                setStep(4);
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            setFaceDataUri(null);
        } finally {
            setLoading(false);
        }
    };

    if (isSetupComplete) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
                <div className="max-w-md w-full bg-white border border-gray-100 rounded-[2.5rem] p-10 text-center shadow-xl relative z-10">
                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-4xl mb-8 mx-auto text-emerald-600 shadow-sm border border-emerald-100">
                        ✅
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Already Setup!</h1>
                    <p className="text-gray-500 mb-8 font-medium">The main admin account has already been created. You can now login to the system.</p>
                    <button onClick={() => navigate('/login')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                        Login Now →
                    </button>
                </div>
            </div>
        );
    }

    if (step === 1) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-12 shadow-xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto text-emerald-600">
                        ⚙️
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">System Setup</h1>
                    <p className="text-gray-500 font-medium">Create your admin account to get started.</p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${step >= 2 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>1</div>
                    <div className={`w-10 h-0.5 rounded-full ${step >= 3 ? 'bg-emerald-600' : 'bg-gray-100'}`}></div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${step >= 3 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>2</div>
                    <div className={`w-10 h-0.5 rounded-full ${step >= 4 ? 'bg-emerald-600' : 'bg-gray-100'}`}></div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${step >= 4 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-gray-300 border-gray-100'}`}>✓</div>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                            className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 text-xs font-bold text-center">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {step === 2 && (
                        <motion.form key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleFormSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold ml-1">Your Full Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm text-gray-900"
                                    placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold ml-1">Email Address</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm text-gray-900"
                                    placeholder="yourname@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2 text-sm font-bold ml-1">Create Password</label>
                                <input type="password" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 focus:outline-none focus:border-emerald-500 transition-all font-medium text-sm text-gray-900"
                                    placeholder="Minimum 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                            </div>

                            <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                                Next Step →
                            </button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.div key="face" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                            <p className="text-gray-500 text-sm font-medium text-center mb-4">Please take a photo of yourself for security.</p>

                            <div className="aspect-video bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative shadow-inner">
                                {!faceDataUri ? (
                                    <>
                                        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/png" className="w-full h-full object-cover" />
                                        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500/30"></div>
                                    </>
                                ) : (
                                    <img src={faceDataUri} alt="Captured Face" className="w-full h-full object-cover" />
                                )}
                            </div>

                            <div className="flex gap-4">
                                {!faceDataUri ? (
                                    <button onClick={handleCaptureFace} className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                                        Take Photo
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => setFaceDataUri(null)} className="w-16 h-14 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-all">
                                            🔄
                                        </button>
                                        <button onClick={handleFinalSubmit} disabled={loading} className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all disabled:opacity-50">
                                            {loading ? 'Completing Setup...' : 'Finish Setup'}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button onClick={() => { setStep(2); setFaceDataUri(null); setError(''); }} className="w-full text-gray-400 hover:text-emerald-600 text-xs font-bold transition-colors py-2">
                                ← Go back to edit details
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto text-emerald-600">
                                🎉
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
                            <p className="text-emerald-600 text-sm font-bold mb-8">{msg}</p>

                            <div className="space-y-4">
                                <p className="text-gray-400 text-xs font-bold">Taking you to the login page...</p>
                                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 3 }} className="h-full bg-emerald-500" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default InitialSetup;
