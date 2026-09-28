import { motion } from 'framer-motion';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Add Info",
            desc: "Officers put their files and case details into the system.",
            detail: "Quick and Easy",
            img: "/images/hero_realistic.png"
        },
        {
            number: "02",
            title: "Link Data",
            desc: "The computer helps to connect your files with people and profiles.",
            detail: "Smart Check",
            img: "/images/ai_match.png"
        },
        {
            number: "03",
            title: "Safe Lock",
            desc: "We lock every file so that nobody can change it later.",
            detail: "Forever Safe",
            img: "/images/scanner_sensor.png"
        },
        {
            number: "04",
            title: "Get Results",
            desc: "Now your records are always ready to show when you need them.",
            detail: "Ready to Use",
            img: "/images/data_node.png"
        }
    ];

    return (
        <div className="pt-48 min-h-screen bg-white pb-32 relative overflow-hidden font-sans">
             <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.01]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <div className="container mx-auto px-8 relative z-10">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-24">
                    <div className="inline-block mb-8 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest shadow-sm">OUR PROCESS</div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-8 leading-none uppercase text-emerald-600">How It Works.</h1>
                    <p className="text-lg text-gray-400 font-bold max-w-2xl mx-auto leading-relaxed">Four simple steps to keep your work safe and secure.</p>
                </motion.div>

                <div className="max-w-5xl mx-auto space-y-32">
                    {steps.map((step, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: "easeOut" }} className={`flex flex-col lg:flex-row items-center gap-16 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                            <div className="lg:w-5/12 w-full relative group">
                                <div className="absolute -inset-6 bg-emerald-100/20 rounded-[2.5rem] blur-2xl"></div>
                                <div className="relative bg-white p-1.5 rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden group-hover:scale-105 transition-all duration-700">
                                    <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50">
                                        <img src={step.img} alt={step.title} className="w-full h-full object-cover transform transition-all duration-1000 group-hover:scale-110" />
                                    </div>
                                    <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-50">Step_{step.number}</div>
                                </div>
                            </div>
                            <div className="lg:w-7/12 w-full">
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">{step.title}</h3>
                                    <p className="text-lg text-gray-400 font-bold leading-relaxed border-l-4 border-emerald-500 pl-6 mb-8">{step.desc}</p>
                                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">{step.detail}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
