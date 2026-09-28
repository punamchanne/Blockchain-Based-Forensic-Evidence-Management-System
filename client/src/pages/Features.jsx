import { motion } from 'framer-motion';

const Features = () => {
    const features = [
        {
            icon: "🔒",
            title: "Safe Records",
            desc: "Records stay in a safe place. No way to change or delete them once they are stored.",
            img: "/images/blockchain_realistic.png"
        },
        {
            icon: "🛡️",
            title: "Strong Security",
            desc: "We use top-level safety to lock every file. Your data is kept very safe with us.",
            img: "/images/data_node.png"
        },
        {
            icon: "🌐",
            title: "Smart System",
            desc: "Our smart computer system helps to check people and find clues quickly.",
            img: "/images/ai_match.png"
        },
        {
            icon: "🔑",
            title: "Easy Login",
            desc: "Log in safely to ensure only you can see your important work files.",
            img: "/images/scanner_sensor.png"
        },
        {
            icon: "👁️",
            title: "Fast Search",
            desc: "Search through all your files in a second to find exactly what you need.",
            img: "/images/hero_realistic.png"
        },
        {
            icon: "📝",
            title: "History Log",
            desc: "A perfect record of who did what. See every step of your work timeline.",
            img: "/images/audit_trail.png"
        }
    ];

    return (
        <div className="pt-48 min-h-screen bg-white pb-32 relative overflow-hidden font-sans">
             <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.01]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <div className="container mx-auto px-8 relative z-10">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-24">
                    <div className="inline-block mb-8 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest shadow-sm">OUR FEATURES</div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-none uppercase text-emerald-600">Features.</h1>
                    <p className="text-lg text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed">Simple tools for your daily work. Secure, easy to use, and very fast.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05, duration: 0.6 }} className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group hover:border-emerald-100">
                            <div className="flex flex-col h-full">
                                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-8 text-white">{feature.icon}</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight group-hover:text-emerald-600 uppercase transition-colors">{feature.title}</h3>
                                <p className="text-sm text-gray-400 font-bold leading-relaxed mb-10">{feature.desc}</p>
                                <div className="mt-auto overflow-hidden rounded-2xl border border-gray-50 aspect-video grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                                    <img src={feature.img} className="w-full h-full object-cover" alt="Feature View" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
