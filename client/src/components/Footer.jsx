import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white border-t border-emerald-950 py-12 relative overflow-hidden">
            {/* Subtle Grain Texture for Depth */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-950/20">
                            ☘️
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none mb-1">
                                SKITCH<span className="text-emerald-500">.</span>
                            </span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Forensic Protocol</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
                        {[
                            { name: 'Dashboard', path: '/login' },
                            { name: 'Verify', path: '/verify' },
                            { name: 'Features', path: '/features' },
                            { name: 'Operations', path: '/how-it-works' }
                        ].map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-500 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5 shadow-inner">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mt-[1px]">Node_Active::SHA_V2</span>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">
                        &copy; {new Date().getFullYear()} SKITCH TECHNOLOGIES • SECURED BY BLOCKCHAIN
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mr-2">Agency Support:</span>
                        <a href="mailto:support@skitch.hq" className="text-[10px] font-bold text-emerald-500 hover:underline tracking-widest">SECURE_MAIL</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
