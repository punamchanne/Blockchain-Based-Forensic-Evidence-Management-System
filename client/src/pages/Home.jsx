import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';

const Home = () => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);

    const stats = [
        { label: "Total Records", value: "24.5k+" },
        { label: "Finished Work", value: "12,900" },
        { label: "Success Rate", value: "99.9%" },
        { label: "Teams Using Us", value: "150+" }
    ];

    const partners = [
        "https://upload.wikimedia.org/wikipedia/commons/e/e4/Interpol_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/d/da/Seal_of_the_Federal_Bureau_of_Investigation.svg",
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Europol_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/c/c8/Department_of_Justice_Seal.svg"
    ];

    const features = [
        {
            title: "Quick Look-up",
            desc: "Find anyone or any sketch in seconds with our easy search.",
            icon: "🧬",
            img: "/images/investigator_realistic.png"
        },
        {
            title: "Super Safe",
            desc: "Your records are locked tight. Nobody can ever delete or change them.",
            icon: "⛓️",
            img: "/images/blockchain_realistic.png"
        }
    ];

    return (
        <div ref={containerRef} className="bg-white min-h-screen overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900 font-sans relative">
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20 px-6 sm:px-12 lg:px-24">
                <div className="container mx-auto relative z-10">
                    <div className="grid lg:grid-cols-12 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:col-span-6 max-w-2xl text-center lg:text-left"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-700 text-[10px] font-black uppercase tracking-widest"
                            >
                                System Is Ready
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-[0.95] tracking-tight uppercase">
                                Records That <span className="text-emerald-600 block sm:inline">Never Get Lost.</span>
                            </h1>

                            <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-lg mx-auto lg:ml-0 font-bold uppercase tracking-widest text-[14px]">
                                A simple way to keep your work safe and organized forever.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                                <Link to="/login" className="group bg-gray-950 text-white px-12 py-5 rounded-[2.5rem] font-black shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-6 text-[11px] uppercase tracking-[0.3em]">
                                    Open Now
                                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                                </Link>
                                <Link to="/verify" className="bg-white text-gray-900 border-2 border-gray-100 px-12 py-5 rounded-[2.5rem] font-black hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm text-[11px] uppercase tracking-[0.3em]">
                                    Check My File
                                </Link>
                            </div>

                            <div className="mt-24 pt-12 border-t border-gray-100 lg:block hidden">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] mb-10">Official Partners</p>
                                <div className="flex items-center gap-12 opacity-20 grayscale hover:grayscale-0 transition-all duration-1000">
                                    {partners.map((logo, i) => (
                                        <img key={i} src={logo} className="h-10 w-auto" alt="Partner" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="lg:col-span-6 relative"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-10 bg-emerald-500/5 rounded-full blur-[100px] group-hover:bg-emerald-500/10 transition-all duration-1000"></div>
                                <div className="relative bg-white p-3 rounded-[4rem] border border-gray-100 shadow-2xl overflow-hidden group-hover:border-emerald-100 transition-all duration-700">
                                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 flex items-center justify-center relative">
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-950/20 to-transparent z-10 pointer-events-none"></div>
                                        <img
                                            src="/images/hero_realistic.png"
                                            alt="Safe Dashboard"
                                            className="w-full h-full object-cover transform transition-all duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                                        />
                                        <div className="absolute top-10 left-10 z-20">
                                            <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl animate-bounce">SECURE_ACTIVE</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Simple Numbers */}
            <section className="py-32 bg-white relative z-10 border-y border-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group border-r border-gray-50 last:border-none">
                                <div className="text-5xl md:text-7xl font-black text-gray-950 mb-4 tracking-tighter hover:text-emerald-600 transition-colors">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] group-hover:text-emerald-500 transition-colors uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simple Features */}
            <section className="py-40 px-6 relative z-10 bg-gray-50/20">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-32 space-y-8">
                         <div className="w-16 h-1 w-24 bg-emerald-600 mx-auto rounded-full"></div>
                        <h2 className="text-5xl md:text-8xl font-black text-gray-950 uppercase tracking-tighter leading-none">
                            Simple Tools <br/> <span className="text-emerald-600 italic">For You.</span>
                        </h2>
                        <p className="text-xl text-gray-400 font-bold uppercase tracking-widest text-[13px]">Safe records. Nobody can change them.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                                className="group relative overflow-hidden rounded-[4rem] p-16 bg-white border border-transparent shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 hover:border-emerald-100 transition-all duration-700"
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <div>
                                        <div className="w-20 h-20 bg-gray-950 rounded-[2rem] flex items-center justify-center text-4xl mb-12 shadow-2xl group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-500">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-4xl font-black text-gray-950 mb-8 uppercase tracking-tighter">{feature.title}</h3>
                                        <p className="text-lg text-gray-400 font-bold max-w-sm uppercase tracking-widest text-[14px]">
                                            {feature.desc}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-16 overflow-hidden rounded-[3rem] border border-gray-50 aspect-video bg-gray-50 shadow-inner group-hover:shadow-2xl transition-all duration-700">
                                        <img src={feature.img} className="w-full h-full object-cover transform scale-110 group-hover:scale-100 transition-all duration-1000 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial (Simple White) */}
            <section className="py-48 text-center px-6 relative z-10 bg-white border-t border-gray-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-6xl mb-16 opacity-10 uppercase font-black tracking-widest">TRUSTED.</div>
                    <blockquote className="text-5xl md:text-7xl font-black text-gray-950 leading-[1.1] tracking-tight mb-20 italic">
                        "The easiest way to keep all our work safe and on track."
                    </blockquote>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.5em] mb-20">Security Department HQ</p>
                    
                    <Link to="/login" className="inline-flex items-center gap-10 group">
                        <span className="text-2xl font-black text-gray-950 group-hover:text-emerald-600 transition-colors uppercase tracking-[0.4em]">Open My Work</span>
                        <div className="w-20 h-20 bg-gray-950 rounded-full flex items-center justify-center text-white text-3xl group-hover:bg-emerald-600 group-hover:scale-110 transition-all shadow-2xl shadow-emerald-500/10">→</div>
                    </Link>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-16 text-center border-t border-gray-50 bg-white flex flex-col items-center gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">2026_SKITCH_NODE_LIVE</span>
                </div>
                <div className="flex gap-12">
                   <Link to="/" className="text-[9px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest">Home</Link>
                   <Link to="/login" className="text-[9px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest">Login</Link>
                   <Link to="/verify" className="text-[9px] font-black text-gray-400 hover:text-emerald-600 uppercase tracking-widest">Verify</Link>
                </div>
            </footer>
        </div>
    );
};

export default Home;
