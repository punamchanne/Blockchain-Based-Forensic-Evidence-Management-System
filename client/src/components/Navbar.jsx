import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed w-full z-50 top-0 left-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm"
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Brand Logo - Left Side */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl text-white shadow-lg shadow-emerald-100 group-hover:scale-110 transition-transform">
                        ☘️
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-950 tracking-tight leading-none mb-1">
                            SKITCH<span className="text-emerald-500">.</span>
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Center</span>
                    </div>
                </Link>

                {/* Right Side: Links + Actions */}
                <div className="flex items-center gap-6 lg:gap-10">
                    <div className="hidden lg:flex items-center gap-8 border-r border-gray-100 pr-10">
                        {[
                            { name: 'Home', path: '/' },
                            { name: 'Features', path: '/features' },
                            { name: 'How It Works', path: '/how-it-works' },
                            { name: 'Check File', path: '/verify' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="text-gray-500 hover:text-emerald-600 transition-all text-xs font-bold uppercase tracking-widest"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col items-end border-r border-gray-200 pr-6">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Status</span>
                                    <span className="text-xs font-bold text-gray-900 tracking-tight">{user.email}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    {user.role === 'super_admin' && (
                                        <Link to="/super-admin" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gray-100 hover:bg-emerald-600 transition-all">Super Admin</Link>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gray-100 hover:bg-emerald-600 transition-all">Dashboard</Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-300 hover:text-red-500 transition-all p-2 bg-gray-50 rounded-xl border border-transparent hover:border-gray-200"
                                        title="Logout"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link to="/login" className="text-[11px] font-bold text-gray-400 hover:text-emerald-700 transition-all uppercase tracking-widest px-4">
                                    Login
                                </Link>
                                <Link to="/login" className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 group flex items-center gap-3">
                                    Join Now
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
