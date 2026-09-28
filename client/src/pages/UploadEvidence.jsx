import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const UploadEvidence = () => {
    const { caseId } = useParams();
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('Document');
    const [status, setStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setIsUploading(true);
        setIsSuccess(false);
        setStatus('Preparing...');

        try {
            setStatus('Uploading file...');
            const formData = new FormData();
            formData.append('file', file);
            formData.append('caseId', caseId || 'None');
            formData.append('fileType', fileType);

            setStatus('Saving to Blockchain...');
            await api.post('/evidence/upload', formData);

            setIsSuccess(true);
            setStatus('File Uploaded Successfully!');
            setTimeout(() => navigate('/admin'), 2000);

        } catch (error) {
            console.error(error);
            setStatus(`Error: ${error.response?.data?.message || 'Upload failed'}`);
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-gray-900 overflow-x-hidden">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-100 z-20 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col fixed h-full shadow-sm`}>
                <div className="p-8 flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${!sidebarOpen ? 'hidden' : 'flex'}`}>
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm">☘️</div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">SKITCH.</span>
                    </div>
                </div>

                <nav className="flex-1 mt-8 px-4 space-y-2">
                    <Link to="/admin" className="w-full flex items-center gap-4 px-4 py-3.5 text-gray-500 hover:bg-gray-50 rounded-xl font-bold text-sm transition-all">
                        📄 <span>Go Back</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 p-8 md:p-16 pt-24 md:pt-12 bg-white ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Case Records</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                            Add <span className="text-emerald-600">Proof Files</span>
                        </h1>
                        <p className="text-gray-500 mt-4 text-sm font-medium">Upload documents or photos for this case.</p>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[3rem] shadow-xl shadow-gray-100 relative overflow-hidden">
                        {isUploading && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-12">
                                {isSuccess ? (
                                    <div className="animate-in fade-in duration-500">
                                        <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100 mx-auto">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                                        <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest">Returning to Dashboard...</p>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-xs">
                                        <div className="w-12 h-12 border-4 border-gray-100 border-t-emerald-600 rounded-full animate-spin mb-6 mx-auto"></div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">Uploading...</h3>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                            <p className="text-emerald-600 font-bold text-[10px] animate-pulse tracking-widest uppercase">{status}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleUpload} className="p-10 space-y-10 relative z-10">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block ml-1">Select Your File</label>
                                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-100 border-dashed rounded-[2.5rem] cursor-pointer bg-gray-50 hover:bg-white hover:border-emerald-300 transition-all group relative overflow-hidden">
                                    <div className="flex flex-col items-center justify-center p-10 text-center">
                                        {file ? (
                                            <>
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm border border-gray-100">
                                                    📄
                                                </div>
                                                <p className="text-base text-gray-900 font-bold mb-1">{file.name}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 text-gray-300 shadow-sm border border-gray-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                                    📁
                                                </div>
                                                <p className="mb-2 text-sm text-gray-900 font-bold">Choose a file from your computer</p>
                                                <p className="text-xs text-gray-400 font-medium">Click to browse or drag and drop here</p>
                                            </>
                                        )}
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block ml-1">Type of File</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold text-gray-900 text-sm cursor-pointer"
                                        onChange={e => setFileType(e.target.value)}
                                        value={fileType}
                                    >
                                        <option value="Document">Document</option>
                                        <option value="Image">Photo/Image</option>
                                        <option value="Video">Video</option>
                                        <option value="Audio">Audio Clip</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 block ml-1">Connected Case ID</label>
                                    <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 font-bold text-emerald-700 text-sm flex items-center justify-between">
                                        <span>#{caseId || 'None'}</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    disabled={isUploading || !file}
                                    className={`w-full font-bold py-5 rounded-3xl transition-all flex justify-center items-center gap-3 uppercase tracking-widest text-xs shadow-lg active:scale-[0.99]
                                        ${file
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    Upload Proof File Now →
                                </button>
                                <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-10"> Secure Blockchain Encryption Active </p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UploadEvidence;
