import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const { login, registerAdmin, user } = useContext(AuthContext);
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (error) setError('');
        if (success) setSuccess('');
    }, [email, password, regName, regEmail, regPass, isRegistering]);

    useEffect(() => {
        if (user) {
            if (user.role === 'super_admin') navigate('/face-auth');
            else if (user.role === 'admin') navigate('/admin');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError(err.response?.data?.message || 'Wrong Email or Password.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerAdmin(regName, regEmail, regPass);
            setSuccess('Success! You can now login.');
            setTimeout(() => setIsRegistering(false), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create account.');
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans relative overflow-hidden pt-20">
            {/* Background Grain */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Left Side: Smaller Cinematic Panel */}
            <div className="hidden lg:flex w-5/12 bg-gray-950 relative overflow-hidden items-center justify-center p-16 m-6 rounded-[3rem] shadow-2xl">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img src="/images/hero_realistic.png" className="w-full h-full object-cover scale-110" alt="Background" />
                    <div className="absolute inset-x-0 h-0.5 bg-emerald-500/30 top-0 animate-[scan_6s_linear_infinite] z-20 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-950 via-gray-950/80 to-emerald-900/20"></div>
                </div>

                <div className="relative z-30 max-w-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-8 border border-emerald-400/50">☘️</motion.div>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white leading-none tracking-tighter mb-6 uppercase">
                        {isRegistering ? 'New Account' : 'Secure Login.'}
                    </motion.h1 >
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-400 text-base font-bold leading-relaxed mb-10 border-l-4 border-emerald-500 pl-6">
                        {isRegistering 
                            ? 'Create your free account today. It is fast and very safe.'
                            : 'Log in to see your safe records and files.'}
                    </motion.p>
                    <div className="flex items-center gap-8">
                         <div>
                            <div className="text-xl font-black text-white uppercase flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Top Safety
                            </div>
                         </div>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes scan {
                        0% { top: 0; }
                        100% { top: 100%; }
                    }
                `}} />
            </div>

            {/* Right Side: Compact Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-8 relative">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[100px] opacity-40"></div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg relative z-10 p-10 bg-white shadow-xl rounded-[2.5rem] border border-gray-100">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-gray-950 mb-2 tracking-tighter uppercase leading-none">
                            {isRegistering ? 'Sign Up' : 'Log In'}
                            <span className="text-emerald-500">.</span>
                        </h2>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Access Your Workspace</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {(error || success) && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                                className={`p-4 rounded-2xl mb-8 text-[10px] font-black uppercase tracking-widest text-center border-2 
                                    ${error ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                {error || success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isRegistering ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-6 transition-colors">Your Email</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-50 transition-all font-bold text-gray-950 shadow-sm" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-6 transition-colors">Your Password</label>
                                <input type="password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-50 transition-all font-bold text-gray-950 shadow-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="w-full bg-gray-950 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all shadow-lg text-xs">
                                Log In Now →
                            </motion.button>
                            
                            <div className="text-center pt-6 border-t border-gray-50 flex justify-between items-center px-2">
                                <Link to="/" className="text-[10px] font-black text-gray-300 hover:text-emerald-600 uppercase tracking-widest transition-all">← Back Home</Link>
                                <button type="button" onClick={() => setIsRegistering(true)} className="text-[10px] font-black text-emerald-600 hover:text-gray-950 uppercase tracking-widest transition-all underline decoration-emerald-200 decoration-2 underline-offset-4">Create New Account</button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-6">Full Name</label>
                                <input type="text" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-50 transition-all font-bold text-gray-950 shadow-sm" placeholder="Name" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-6">Email Address</label>
                                <input type="email" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-50 transition-all font-bold text-gray-950 shadow-sm" placeholder="email@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-6">Password</label>
                                <input type="password" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-8 py-4 outline-none focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-50 transition-all font-bold text-gray-950 shadow-sm" placeholder="••••••••" value={regPass} onChange={(e) => setRegPass(e.target.value)} required />
                            </div>

                            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" className="bg-emerald-600 text-white font-black w-full py-5 rounded-2xl uppercase tracking-[0.3em] hover:bg-gray-950 transition-all shadow-lg text-xs">
                                Sign Up Now +
                            </motion.button>
                            
                            <div className="text-center pt-6 border-t border-gray-50">
                                <button type="button" onClick={() => setIsRegistering(false)} className="text-[10px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest transition-all">← Back to Log In</button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
