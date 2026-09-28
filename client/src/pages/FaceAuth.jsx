import { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const FaceAuth = () => {
    const webcamRef = useRef(null);
    const [status, setStatus] = useState('pending'); // pending, scanning, verified, denied
    const [error, setError] = useState('');
    const [scanProgress, setScanProgress] = useState(0);
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        if (!user || user.role !== 'super_admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleCapture = async () => {
        if (status === 'scanning' || status === 'verified') return;

        setStatus('scanning');
        setScanProgress(0);

        try {
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 5;
                });
            }, 100);

            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                setError("Camera not ready. Please check permissions.");
                setStatus('pending');
                return;
            }

            const { data } = await api.post('/face-auth/verify', {
                email: user.email,
                faceDataUri: imageSrc
            });

            if (data.success) {
                setStatus('verified');
                setTimeout(() => {
                    navigate('/super-admin');
                }, 2000);
            }
        } catch (err) {
            setStatus('denied');
            setError(err.response?.data?.message || "Face could not be verified.");
            setTimeout(() => {
                setStatus('pending');
                setScanProgress(0);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-8 relative overflow-hidden font-sans">
            {/* Soft Background Accents */}
            <div className={`absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 ${status === 'denied' ? 'bg-red-50' : status === 'verified' ? 'bg-emerald-50' : 'bg-emerald-50'} opacity-60`}></div>
            <div className={`absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full blur-[120px] transition-colors duration-1000 ${status === 'denied' ? 'bg-red-50' : status === 'verified' ? 'bg-emerald-50' : 'bg-emerald-50'} opacity-60`}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-white border border-gray-100 rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-emerald-50/50 relative overflow-hidden z-10"
            >
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${scanProgress}%` }}
                        className={`h-full transition-colors duration-500 ${status === 'denied' ? 'bg-red-500' : 'bg-emerald-600'}`}
                    />
                </div>

                <div className="text-center mb-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border transition-all duration-500 ${status === 'verified' ? 'bg-emerald-50 border-emerald-100' : status === 'denied' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <span className={`w-2 h-2 rounded-full animate-pulse ${status === 'verified' ? 'bg-emerald-500' : status === 'denied' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'verified' ? 'text-emerald-700' : status === 'denied' ? 'text-red-700' : 'text-emerald-700'}`}>
                            {status === 'pending' ? 'Ready to Scan' : status === 'scanning' ? 'Verifying Face' : status === 'verified' ? 'Welcome Back' : 'Access Denied'}
                        </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Face Verification</h2>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Secure Admin Login</p>
                </div>

                {/* Webcam Box */}
                <div className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-500 aspect-video mb-10 shadow-inner ${status === 'denied' ? 'border-red-100 bg-red-50/10' : status === 'verified' ? 'border-emerald-100 bg-emerald-50/10' : 'border-gray-100 bg-gray-50/50'}`}>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        className={`w-full h-full object-cover grayscale opacity-80 transition-all duration-700 ${status === 'scanning' ? 'brightness-110 opacity-100' : ''}`}
                        videoConstraints={{ facingMode: "user" }}
                    />

                    {/* Scanning Line */}
                    <AnimatePresence>
                        {status === 'scanning' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none"
                            >
                                <motion.div
                                    animate={{ y: ["-10%", "110%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="h-[2px] w-full bg-emerald-500 shadow-[0_0_15px_#10b981] relative z-10 opacity-70"
                                />
                                <div className="absolute inset-0 bg-emerald-600/5"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Overlays */}
                    {status === 'verified' && (
                        <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-emerald-500 animate-in fade-in zoom-in duration-300">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl text-white mb-2">✅</motion.div>
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase bg-emerald-600 px-4 py-1.5 rounded-full shadow-lg">Verified</span>
                        </div>
                    )}
                    {status === 'denied' && (
                        <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-red-500 animate-in fade-in zoom-in duration-300">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl text-white mb-2">❌</motion.div>
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase bg-red-600 px-4 py-1.5 rounded-full shadow-lg">Unrecognized</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleCapture}
                        disabled={status === 'scanning' || status === 'verified'}
                        className={`w-full h-16 rounded-2xl transition-all uppercase tracking-widest text-xs font-bold shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]
                                    ${status === 'verified'
                                ? 'bg-emerald-500 text-white shadow-emerald-100 cursor-default'
                                : status === 'scanning'
                                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'}`}
                    >
                        {status === 'scanning' ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Verifying...
                            </>
                        ) : status === 'verified' ? (
                            'Opening Dashboard...'
                        ) : (
                            'Start Verification →'
                        )}
                    </button>

                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="w-full text-gray-400 hover:text-emerald-700 transition-all text-[10px] font-bold uppercase tracking-widest py-2"
                    >
                        Cancel & Logout
                    </button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl"
                    >
                        <p className="text-red-700 text-[10px] font-bold uppercase text-center tracking-widest leading-relaxed">
                            Error: {error}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default FaceAuth;
