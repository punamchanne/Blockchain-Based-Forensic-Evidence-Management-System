const Criminal = require('../models/Criminal');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { cosineSimilarity } = require('../utils/similarity');

/**
 * Helper to call Python script for embeddings
 */
const getFaceEmbedding = (imagePath) => {
    return new Promise((resolve, reject) => {
        const pyScript = path.join(__dirname, '../ai/face_embedding.py');
        const pythonProcess = spawn('python', [pyScript, imagePath]);

        let result = '';
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            try {
                const output = JSON.parse(result);
                if (output.success) {
                    resolve(output.embedding);
                } else {
                    reject(new Error(output.error || 'Failed to extract embedding'));
                }
            } catch (err) {
                reject(new Error('Invalid response from AI script'));
            }
        });
    });
};

// @desc    Add new criminal record
// @route   POST /api/criminals
// @access  Private (Admin only)
const createCriminal = async (req, res) => {
    try {
        const { criminalId, name, address, age, photoUrl, crimes, features } = req.body;

        if (!photoUrl) {
            return res.status(400).json({ message: 'Criminal photo is required for biometric indexing.' });
        }

        // Generate embedding from photo
        const fullPhotoPath = path.join(__dirname, '../../', photoUrl);
        const faceEmbedding = await getFaceEmbedding(fullPhotoPath);

        const criminal = await Criminal.create({
            criminalId,
            name,
            address,
            age,
            photos: [photoUrl],
            crimes: JSON.parse(crimes || '[]'),
            features: JSON.parse(features || '{}'),
            faceEmbedding
        });

        res.status(201).json({
            success: true,
            message: 'Criminal record created and indexed successfully.',
            criminal
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating criminal record', error: error.message });
    }
};

// @desc    Match sketch to criminal records
// @route   POST /api/criminals/match
// @access  Private (Admin only)
const matchSketch = async (req, res) => {
    try {
        const { sketchUrl } = req.body;

        if (!sketchUrl) {
            return res.status(400).json({ message: 'Sketch URL is required for matching.' });
        }

        // 1. Get embedding for the sketch
        const fullSketchPath = path.join(__dirname, '../../', sketchUrl);
        const sketchEmbedding = await getFaceEmbedding(fullSketchPath);

        // 2. Fetch all criminals
        const criminals = await Criminal.find({});

        // 3. Compare and score
        const results = criminals.map(c => {
            const similarity = cosineSimilarity(sketchEmbedding, c.faceEmbedding);
            return {
                criminal: {
                    _id: c._id,
                    criminalId: c.criminalId,
                    name: c.name,
                    photos: c.photos,
                    crimes: c.crimes,
                    age: c.age,
                    address: c.address
                },
                similarity: (similarity * 100).toFixed(2)
            };
        });

        // 4. Sort by highest similarity
        const sortedResults = results
            .filter(r => r.similarity > 70) // Threshold 0.70
            .sort((a, b) => b.similarity - a.similarity);

        res.json({
            success: true,
            matches: sortedResults,
            message: sortedResults.length > 0 ? `${sortedResults.length} potential matches found.` : "No matching records found in database."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Matching process failed', error: error.message });
    }
};

// @desc    Get all criminals
const getCriminals = async (req, res) => {
    try {
        const criminals = await Criminal.find({}).select('-faceEmbedding');
        res.json(criminals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Match sketch attributes to criminal records
// @route   POST /api/criminals/match-attributes
// @access  Private
const matchAttributes = async (req, res) => {
    try {
        const { gender, age, faceShape, hairType, eyeType, noseType, skinTone, facialHair, chinShape } = req.body;

        const criminals = await Criminal.find({}).select('-faceEmbedding');
        
        const results = criminals.map(c => {
            let matches = 0;
            let total = 0;

            const compare = (input, record) => {
                if (input) {
                    total++;
                    if (input.toLowerCase() === (record || '').toLowerCase()) matches++;
                }
            };

            compare(gender, c.features?.gender);
            compare(faceShape, c.features?.faceShape);
            compare(hairType, c.features?.hairType);
            compare(eyeType, c.features?.eyeType);
            compare(noseType, c.features?.noseType);
            compare(skinTone, c.features?.skinTone);
            compare(facialHair, c.features?.facialHair);
            compare(chinShape, c.features?.chinShape);

            // Age logic
            if (age) {
                total++;
                if (age.includes('-')) {
                    const [min, max] = age.split('-').map(Number);
                    if (c.age >= min && c.age <= max) matches++;
                } else if (Number(age) === c.age) {
                    matches++;
                }
            }

            const score = total > 0 ? (matches / total) * 100 : 0;

            return {
                criminal: c,
                similarity: score.toFixed(1),
                isAttributeMatch: true
            };
        });

        // Only show results with at least 50% match to avoid clutter
        const filteredResults = results
            .filter(r => r.similarity >= 50)
            .sort((a, b) => b.similarity - a.similarity);

        res.json({
            success: true,
            matches: filteredResults,
            message: filteredResults.length > 0 ? `${filteredResults.length} profile syncs found.` : "No strong attribute matches found."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Attribute matching failed', error: error.message });
    }
};

// @desc    Get single criminal by ID
// @route   GET /api/criminals/:id
// @access  Private
const getCriminalById = async (req, res) => {
    try {
        const criminal = await Criminal.findById(req.params.id).select('-faceEmbedding');
        if (criminal) {
            res.json(criminal);
        } else {
            res.status(404).json({ message: 'Criminal not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createCriminal,
    matchSketch,
    getCriminals,
    matchAttributes,
    getCriminalById
};
