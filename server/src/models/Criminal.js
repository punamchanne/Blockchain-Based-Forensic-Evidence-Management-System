const mongoose = require('mongoose');

const criminalSchema = mongoose.Schema({
    criminalId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    photos: [{
        type: String // URLs or Paths to files
    }],
    sketch: {
        type: String // URL/Path to associated sketch if available
    },
    features: {
        gender: { type: String, enum: ['male', 'female'], default: 'male' },
        faceShape: { type: String, enum: ['oval', 'round', 'square', 'long'], default: 'oval' },
        eyeType: { type: String, enum: ['normal', 'small', 'big'], default: 'normal' },
        noseType: { type: String, enum: ['straight', 'flat', 'pointed', 'curved'], default: 'straight' },
        hairType: { type: String, enum: ['short', 'long', 'bald', 'curly'], default: 'short' },
        skinTone: { type: String, enum: ['fair', 'medium', 'dark'], default: 'medium' },
        facialHair: { type: String, enum: ['none', 'beard', 'mustache'], default: 'none' },
        chinShape: { type: String, enum: ['round', 'pointed', 'square'], default: 'round' }
    },
    crimes: [{
        incidentType: String,
        date: Date,
        location: String,
        description: String
    }],
    faceEmbedding: {
        type: [Number], // 128D vector
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Criminal', criminalSchema);
