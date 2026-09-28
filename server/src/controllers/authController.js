const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new Admin
// @route   POST /api/auth/register-admin
// @access  Private (Super Admin only)
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role: 'admin'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Register Super Admin (First Time / Seeding)
// @route   POST /api/auth/seed-super-admin
// @access  Public (Should be secured in production)
const seedSuperAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if any super admin exists primarily
    // For simplicity, just create
    const user = await User.create({
        name,
        email,
        password,
        role: 'super_admin'
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
        res.status(400).json({ message: 'Failed' });
    }
};

// @desc    Get all admins
// @route   GET /api/auth/admins
// @access  Private (Super Admin)
const getAdmins = async (req, res) => {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
};

// --- FIRST-TIME SETUP ENDPOINTS ---

/**
 * Helper to call Python script for face embeddings
 * Tries 'python', 'python3', and 'py' to find the interpreter
 */
const getFaceEmbedding = (imagePath) => {
    return new Promise((resolve, reject) => {
        const pyScript = path.join(__dirname, '../ai/face_embedding.py');
        const commands = ['python', 'python3', 'py'];
        let lastError = '';

        const trySpawn = (index) => {
            if (index >= commands.length) {
                return reject(new Error(`Python not found. Please ensure Python is installed and added to PATH.\n${lastError}`));
            }

            const command = commands[index];
            const pythonProcess = spawn(command, [pyScript, imagePath]);

            let result = '';
            let errorOutput = '';

            pythonProcess.stdout.on('data', (data) => {
                result += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });

            pythonProcess.on('error', (err) => {
                lastError = err.message;
                trySpawn(index + 1);
            });

            pythonProcess.on('close', (code) => {
                if (code !== 0) {
                    if (errorOutput.includes('not found') || errorOutput.includes('not recognized')) {
                        return trySpawn(index + 1);
                    }

                    let enhancedError = errorOutput;
                    if (errorOutput.includes('ModuleNotFoundError')) {
                        enhancedError = `Missing Python Dependencies. Please run: pip install -r server/src/ai/requirements.txt\n\nOriginal Error: ${errorOutput}`;
                    }

                    return reject(new Error(enhancedError || `Python script failed with code ${code}`));
                }

                try {
                    const output = JSON.parse(result);
                    if (output.success) resolve(output.embedding);
                    else reject(new Error(output.error || 'Failed to extract embedding'));
                } catch (err) {
                    reject(new Error('Invalid response from AI script: ' + result));
                }
            });
        };

        trySpawn(0);
    });
};

// @desc    Check if initial setup is needed
// @route   GET /api/auth/setup-status
// @access  Public
const checkSetupStatus = async (req, res) => {
    try {
        const superAdminExists = await User.findOne({ role: 'super_admin' });
        res.json({ isSetupComplete: !!superAdminExists });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    First-time Super Admin setup (account + face)
// @route   POST /api/auth/setup
// @access  Public (One-time use only)
const setupSuperAdmin = async (req, res) => {
    try {
        // Security: Only allow if no Super Admin exists
        const existing = await User.findOne({ role: 'super_admin' });
        if (existing) {
            return res.status(403).json({ message: 'System is already configured. Setup is locked.' });
        }

        const { name, email, password, faceDataUri } = req.body;

        if (!name || !email || !password || !faceDataUri) {
            return res.status(400).json({ message: 'All fields including Face Image are required.' });
        }

        // 1. Process face image
        const base64Data = faceDataUri.replace(/^data:image\/\w+;base64,/, "");
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const tempPath = path.join(uploadsDir, `setup-${Date.now()}.png`);
        fs.writeFileSync(tempPath, base64Data, { encoding: 'base64' });

        // 2. Extract face embedding
        const embedding = await getFaceEmbedding(tempPath);
        fs.unlinkSync(tempPath); // Cleanup

        // 3. Create Super Admin with face embedding
        const user = await User.create({
            name,
            email,
            password,
            role: 'super_admin',
            faceEmbedding: embedding
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'System configured successfully. Super Admin created with biometric profile.',
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Setup failed. Invalid data.' });
        }
    } catch (error) {
        console.error('[Setup Error]:', error);
        res.status(500).json({ message: 'System setup failed', error: error.message });
    }
};

module.exports = { loginUser, registerAdmin, seedSuperAdmin, getAdmins, checkSetupStatus, setupSuperAdmin };
