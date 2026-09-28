const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios'); // Import axios
const Evidence = require('../models/Evidence');
const Case = require('../models/Case');
const { uploadToIPFS } = require('../config/ipfs');
const { contract } = require('../config/blockchain');

// @desc    Generate forensic sketch using Hugging Face API (Cloud)
// @route   POST /api/sketch/generate
// @access  Private (Admin only)
const generateSketch = async (req, res) => {
    try {
        const { caseId, gender, age, faceShape, eyeType, noseType, hairType, includeBackground } = req.body;

        if (!caseId) {
            return res.status(400).json({ message: 'Case ID is required' });
        }

        console.log(`[AI] Starting Cloud sketch generation for Case: ${caseId} (Background: ${includeBackground})`);

        // Construct Enhanced Prompt
        let prompt = `forensic composite sketch, ${gender}, age ${age}, ${faceShape} face, ${eyeType} eyes, ${noseType} nose, ${hairType} hair, black and white, professional pencil drawing, police forensic artist style, extremely detailed graphite texture, sharp lines, front view, neutral expression`;

        if (includeBackground) {
            prompt += `, standing in a dimly lit crime scene background, forensic laboratory atmosphere, cinematic police station lighting, highly detailed environmental context`;
        } else {
            prompt += `, plain white background, studio lighting`;
        }

        const negative_prompt = "color, photo, photorealistic, 3d render, cartoon, anime, blurry, low quality, distorted face, messy lines, digital art look";

        // Call Hugging Face API
        const HF_API_URL = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";
        const HF_TOKEN = process.env.HF_API_TOKEN;

        if (!HF_TOKEN) {
            return res.status(500).json({ message: "Server Error: Missing HF_API_TOKEN" });
        }

        let imageBuffer;
        try {
            console.log(`[AI] Sending request to ${HF_API_URL}...`);
            const response = await axios.post(
                HF_API_URL,
                { inputs: prompt },
                {
                    headers: {
                        Authorization: `Bearer ${HF_TOKEN}`,
                        Accept: "image/png"
                    },
                    responseType: 'arraybuffer'
                }
            );
            imageBuffer = Buffer.from(response.data);
            console.log("[AI] Cloud Generation Success");
        } catch (apiError) {
            const errorMessage = apiError.response?.data?.toString() || apiError.message;
            console.error("[AI] API Error Details:", errorMessage);

            if (errorMessage.includes("loading")) {
                return res.status(503).json({
                    message: 'AI Model is loading (Cold Start).',
                    error: 'The model is initializing on the cloud. Please wait 30 seconds and try again.'
                });
            }

            return res.status(500).json({
                message: 'AI Cloud Generation Failed',
                error: errorMessage
            });
        }

        // Process Generated Image
        const outputFileName = `sketch-${Date.now()}.png`;
        const outputDir = path.join(__dirname, '../ai/outputs');

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, outputFileName);
        fs.writeFileSync(outputPath, imageBuffer);

        // 1. Hash and IPFS
        const hashSum = crypto.createHash('sha256');
        hashSum.update(imageBuffer);
        const evidenceHash = hashSum.digest('hex');
        const ipfsHash = await uploadToIPFS(imageBuffer);

        // 2. Deployment
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const finalPath = path.join(uploadsDir, outputFileName);
        fs.copyFileSync(outputPath, finalPath);
        const fileUrl = `/uploads/${outputFileName}`;

        // 3. Blockchain
        console.log(`[Blockchain] Securing sketch for Case: ${caseId}`);
        const tx = await contract.uploadEvidence(
            ipfsHash,
            caseId,
            'Forensic Sketch',
            evidenceHash
        );
        await tx.wait();
        console.log(`[Blockchain] Secured. TX: ${tx.hash}`);

        // 4. Persistence
        // A. Fetch Case Data for reporting
        const caseData = await Case.findOne({ caseId });

        const evidence = await Evidence.create({
            evidenceId: 'EV-SKETCH-' + Date.now(),
            caseId,
            fileType: 'Forensic Sketch',
            ipfsHash,
            evidenceHash,
            blockchainTxHash: tx.hash,
            uploadedBy: req.user._id,
            fileUrl,
            description: `AI Generated forensic sketch (${gender}, ${age}, ${faceShape}, ${eyeType}, ${noseType}, ${hairType})${includeBackground ? " with crime scene background" : ""}`
        });

        res.json({
            success: true,
            message: 'Sketch generated and secured successfully',
            evidence
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { generateSketch };
