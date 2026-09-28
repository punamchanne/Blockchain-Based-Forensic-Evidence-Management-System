const mongoose = require('mongoose');

const evidenceSchema = mongoose.Schema({
    evidenceId: {
        type: String,
        required: true,
        unique: true
    },
    caseId: {
        type: String, // Storing string ID to match Case ID
        required: true,
        ref: 'Case'
    },
    fileType: {
        type: String,
        required: true
    },
    ipfsHash: {
        type: String,
        required: true
    },
    blockchainTxHash: {
        type: String,
        required: true
    },
    evidenceHash: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fileUrl: {
        type: String,
        required: false
    },
    forensicReport: {
        faceMatchProbability: { type: Number, default: 0 },
        crimeContext: { type: String, default: '' },
        backgroundAnalysis: { type: String, default: '' },
        analysisTimestamp: { type: Date, default: Date.now }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Evidence', evidenceSchema);
