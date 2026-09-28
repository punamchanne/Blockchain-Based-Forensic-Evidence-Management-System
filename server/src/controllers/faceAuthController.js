const User = require('../models/User');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { cosineSimilarity } = require('../utils/similarity');

/**
 * Helper to call Python script for embeddings (same as criminalController)
 * Ideally should be a separate service/util, but keeping it simple for now.
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
            console.error(`[AI Script Error]: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            try {
                const output = JSON.parse(result);
                if (output.success) resolve(output.embedding);
                else reject(new Error(output.error || 'Failed to extract embedding'));
            } catch (err) {
                reject(new Error('Invalid response from AI script'));
            }
        });
    });
};

// @desc    Verify Super Admin Face
// @route   POST /api/face-auth/verify
// @access  Public (Used during specialized login flow)
const verifyFace = async (req, res) => {
    try {
        const { email, faceDataUri } = req.body;

        if (!email || !faceDataUri) {
            return res.status(400).json({ message: 'Email and Face Image are required.' });
        }

        const user = await User.findOne({ email, role: 'super_admin' });
        if (!user) {
            return res.status(404).json({ message: 'Super Admin profile not found.' });
        }

        // 1. Process base64 image from webcam
        const base64Data = faceDataUri.replace(/^data:image\/\w+;base64,/, "");
        const tempPath = path.join(__dirname, '../../uploads', `temp-auth-${Date.now()}.png`);
        fs.writeFileSync(tempPath, base64Data, { encoding: 'base64' });

        // 2. Extract embedding from captured face
        const capturedEmbedding = await getFaceEmbedding(tempPath);

        // Cleanup temp file
        fs.unlinkSync(tempPath);

        // 3. Compare with stored embedding
        const similarity = cosineSimilarity(capturedEmbedding, user.faceEmbedding);

        console.log(`[FaceAuth] Similarity for ${email}: ${similarity.toFixed(4)}`);

        if (similarity > 0.75) { // Strict threshold for auth
            res.json({
                success: true,
                message: 'Face Biometric Verified.',
                similarity: (similarity * 100).toFixed(2)
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Face Biometric Match Failed.',
                similarity: (similarity * 100).toFixed(2)
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Biometric verification failed', error: error.message });
    }
};

// @desc    Enroll Face Biometrics for current Super Admin
// @route   POST /api/face-auth/enroll
// @access  Private (Super Admin only)
const enrollFace = async (req, res) => {
    try {
        const { faceDataUri } = req.body;
        const userId = req.user.id;

        if (!faceDataUri) {
            return res.status(400).json({ message: 'Face Image data is required.' });
        }

        // 1. Process base64 image
        const base64Data = faceDataUri.replace(/^data:image\/\w+;base64,/, "");
        const tempPath = path.join(__dirname, '../../uploads', `enroll-${userId}-${Date.now()}.png`);

        // Ensure uploads directory exists
        if (!fs.existsSync(path.join(__dirname, '../../uploads'))) {
            fs.mkdirSync(path.join(__dirname, '../../uploads'), { recursive: true });
        }

        fs.writeFileSync(tempPath, base64Data, { encoding: 'base64' });

        // 2. Extract embedding
        const embedding = await getFaceEmbedding(tempPath);

        // Cleanup temp file
        fs.unlinkSync(tempPath);

        // 3. Update User
        await User.findByIdAndUpdate(userId, { faceEmbedding: embedding });

        res.json({
            success: true,
            message: 'Biometric profile registered successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Biometric enrollment failed', error: error.message });
    }
};

module.exports = { verifyFace, enrollFace };
