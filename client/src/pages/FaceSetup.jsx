import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';

const FaceSetup = () => {
    const [enrollMsg, setEnrollMsg] = useState('');
    const [isEnrolling, setIsEnrolling] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const handleEnrollBiometrics = async () => {
        if (!webcamRef.current) return;
        setIsEnrolling(true);
        setEnrollMsg('');

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            const { data } = await api.post('/face-auth/enroll', { faceDataUri: imageSrc });
            if (data.success) {
                setEnrollMsg('Your face has been registered successfully!');
                setTimeout(() => navigate('/super-admin'), 3000);
            }
        } catch (error) {
            setEnrollMsg(error.response?.data?.error || error.response?.data?.message || 'Failed to register your face. Please try again.');
        } finally {
            setIsEnrolling(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
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
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto text-emerald-600 shadow-sm border border-emerald-100">
                        👤
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Face Setup</h1>
                    <p className="text-gray-500 font-medium">Link your face to your account for extra security.</p>
                </div>

                <div className="aspect-video bg-gray-50 rounded-[2.5rem] overflow-hidden mb-10 border border-gray-100 relative group shadow-inner">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/png"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500/30"></div>

                    {/* Live Indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full border border-gray-100 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Camera Live</span>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-gray-500 text-sm font-medium text-center leading-relaxed max-w-sm mx-auto">
                        Make sure your face is clearly visible in the camera frame. This photo will be used to verify you later.
                    </p>

                    <button
                        onClick={handleEnrollBiometrics}
                        disabled={isEnrolling}
                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-4
                                    ${isEnrolling
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'}`}
                    >
                        {isEnrolling ? 'Registering...' : 'Register My Face'}
                    </button>

                    <AnimatePresence>
                        {enrollMsg && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`p-4 rounded-xl text-xs font-bold text-center border ${enrollMsg.includes('Failed') ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}
                            >
                                {enrollMsg}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => navigate('/super-admin')}
                        className="w-full text-gray-400 hover:text-emerald-600 text-xs font-bold transition-colors py-2"
                    >
                        Go back to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default FaceSetup;
