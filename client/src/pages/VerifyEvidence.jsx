import { useState } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyEvidence = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    const ABI = [
        "function verifyEvidence(string _evidenceHash) public view returns (bool, string, string, string, address, uint256)"
    ];

    const CONTRACT_ADDRESS = "0x7eb81C90a40e1aF1AFb62b5cd7A2AD71AcD1e3d6";

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsVerifying(true);
        setStatus('Connecting...');
        setResult(null);

        try {
            const buffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const evidenceHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            setStatus('Checking...');
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

            const data = await contract.verifyEvidence(evidenceHash);
            const [exists, ipfs, caseId, fileType, uploader, timestamp] = data;

            if (exists) {
                setResult({
                    valid: true,
                    evidenceHash,
                    ipfs,
                    caseId,
                    fileType,
                    uploader,
                    timestamp: new Date(Number(timestamp) * 1000).toLocaleString()
                });
            } else {
                setResult({ valid: false, error: 'Cannot find this file.' });
            }
        } catch (error) {
            console.error(error);
            setResult({ valid: false, error: 'Connection Error.' });
        }

        setStatus('');
        setIsVerifying(false);
    };

    return (
        <div className="min-h-screen bg-white pt-48 pb-32 px-8 relative overflow-hidden font-sans">
             <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.01]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            <div className="container mx-auto max-w-4xl relative z-10 transition-all">
                <div className="text-center mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-block mb-6 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest shadow-sm">FILE CHECKER</div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6 leading-none uppercase">Scanner.</h1>
                        <p className="text-lg text-gray-400 font-bold max-w-xl mx-auto leading-relaxed border-l-4 border-emerald-500 pl-6 text-left">Upload your file to check if it is safe in our records.</p>
                    </motion.div>
                </div>

                <div className="grid gap-12 items-start">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-full">
                        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 p-10 shadow-xl relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-emerald-300"></div>
                           
                            <form onSubmit={handleVerify} className="space-y-10">
                                <label className={`flex flex-col items-center justify-center w-full h-[300px] border-4 border-dashed rounded-[2rem] cursor-pointer transition-all relative overflow-hidden group/box
                                    ${file ? 'bg-emerald-50/50 border-emerald-500' : 'bg-gray-50/50 border-gray-100 hover:border-emerald-300'}`}>
                                    
                                    <div className="flex flex-col items-center justify-center text-center px-12 relative z-10">
                                        {file ? (
                                            <div className="space-y-6">
                                                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-3xl border border-emerald-50 animate-pulse">📄</div>
                                                <div>
                                                    <p className="text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">{file.name}</p>
                                                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest leading-none">READY</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center mx-auto text-3xl opacity-30">📁</div>
                                                <div>
                                                    <p className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Start Scan</p>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest underline decoration-emerald-200 decoration-2 underline-offset-4">Click to select</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} required />
                                </label>

                                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={!file || isVerifying} className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] transition-all shadow-lg flex items-center justify-center gap-4 text-[10px]
                                    ${file && !isVerifying ? 'bg-gray-950 text-white hover:bg-emerald-600' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                                    {isVerifying ? status : <>CHECK_FILE_NOW →</>}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {result && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`bg-white/95 p-12 rounded-[2.5rem] border-4 shadow-xl relative overflow-hidden transition-all duration-1000 ${result.valid ? 'border-emerald-500 shadow-emerald-50' : 'border-red-500 shadow-red-50'}`}>
                                <div className="flex flex-col lg:flex-row items-center gap-10 mb-10 relative z-10 text-center lg:text-left">
                                    <div className={`w-24 h-24 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-lg border-2 ${result.valid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{result.valid ? '✅' : '⚠️'}</div>
                                    <div className="flex-1">
                                        <h3 className={`text-4xl font-black mb-2 tracking-tighter uppercase leading-none ${result.valid ? 'text-gray-950' : 'text-red-600'}`}>{result.valid ? 'FILE_IS_SAFE.' : 'ERROR.'}</h3>
                                        <p className="text-lg text-gray-400 font-bold uppercase tracking-tighter">{result.valid ? 'Matches our records.' : result.error}</p>
                                    </div>
                                </div>
                                {result.valid && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 gap-6 relative z-10 pt-10 border-t border-gray-50">
                                        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100"><p className="text-[9px] font-black text-emerald-600 uppercase mb-2">Record ID</p><p className="text-2xl font-black text-gray-950">#{result.caseId}</p></div>
                                        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100"><p className="text-[9px] font-black text-emerald-600 uppercase mb-2">Type</p><p className="text-2xl font-black text-gray-950">{result.fileType || 'Unnamed'}</p></div>
                                        <div className="p-8 bg-emerald-600 rounded-[2rem] text-white"><p className="text-[9px] font-black text-emerald-100 uppercase mb-2">Time</p><p className="text-lg font-black leading-none">{result.timestamp}</p></div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default VerifyEvidence;
