const mongoose = require('mongoose');

const caseSchema = mongoose.Schema({
    caseId: {
        type: String,
        required: true,
        unique: true
    },
    incidentType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'pending'],
        default: 'open'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
