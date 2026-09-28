const Evidence = require('../models/Evidence');
const Case = require('../models/Case');

// In a real app, we would use an IPFS client here to upload the file to IPFS
// For this MVP, we might simulate IPFS upload or assume the client sends the Hash if doing client-side upload.
// However, specs say "Backend generates SHA-256 hash", "Original file stored on IPFS".
// So Backend should handle file upload.

// We need 'ipfs-http-client' or similar. 
// For now, let's assume the file comes in req.file (via multer).

// @desc    Upload evidence (File -> IPFS -> Blockchain -> DB)
// @route   POST /api/evidence
// @access  Private (Admin)
// @desc    Upload evidence (File -> IPFS -> Blockchain -> DB)
// @route   POST /api/evidence
// @access  Private (Admin)
const uploadEvidence = async (req, res) => {
    try {
        const { caseId, fileType } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // 1. Generate SHA-256 Hash
        const crypto = require('crypto');
        const fs = require('fs');
        const path = require('path');

        const fileBuffer = req.file.buffer;
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const evidenceHash = hashSum.digest('hex');

        // 1.1 Check DB for duplicate
        const existingEvidence = await Evidence.findOne({ evidenceHash });
        if (existingEvidence) {
            console.log(`[Upload] Evidence already exists: ${evidenceHash}`);
            return res.json({
                success: true,
                evidence: existingEvidence,
                message: 'Evidence already secured. Returned existing record.'
            });
        }

        // 1.5 Save to Local Disk (for viewing)
        const fileName = `evidence-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(req.file.originalname || '.bin')}`;
        const uploadDir = path.join(__dirname, '../../uploads');

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadPath = path.join(uploadDir, fileName);
        fs.writeFileSync(uploadPath, fileBuffer);
        const fileUrl = `/uploads/${fileName}`;

        // 2. Mock IPFS Upload (Simulated)
        const ipfsHash = 'Qm' + crypto.randomBytes(20).toString('hex'); // We can store fileUrl in ipfsHash if we want to cheat, but let's keep it separate.

        // 3. Blockchain Transaction (Server-Side)
        const ethers = require('ethers');
        const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545');
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

        const ABI = [
            "function uploadEvidence(string _ipfsHash, string _caseId, string _fileType, string _evidenceHash) public",
            "event EvidenceUploaded(string indexed evidenceHash, string ipfsHash, string caseId, address indexed uploader, uint256 timestamp)"
        ];

        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

        console.log(`[Blockchain] Signing transaction for Case: ${caseId}`);
        const tx = await contract.uploadEvidence(ipfsHash, caseId || 'CASE-GENERIC', fileType, evidenceHash);
        console.log(`[Blockchain] Transaction sent: ${tx.hash}. Waiting for confirmation...`);

        await tx.wait(); // Wait for 1 confirmation
        console.log(`[Blockchain] Transaction confirmed.`);

        // 4. Save to Database
        const evidence = await Evidence.create({
            evidenceId: 'EV-' + Date.now(),
            caseId: caseId || 'CASE-GENERIC',
            fileType,
            ipfsHash, // Keeping mock IPFS hash for blockchain consistency
            evidenceHash,
            blockchainTxHash: tx.hash,
            uploadedBy: req.user._id,
            fileUrl // Saving local URL
        });

        res.json({
            success: true,
            evidence
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Save Evidence Record (After Blockchain Tx)
// @route   POST /api/evidence/save
// @access  Private
const saveEvidence = async (req, res) => {
    const { caseId, fileType, ipfsHash, evidenceHash, blockchainTxHash } = req.body;

    const evidence = await Evidence.create({
        evidenceId: 'EV-' + Date.now(),
        caseId,
        fileType,
        ipfsHash,
        evidenceHash,
        blockchainTxHash,
        uploadedBy: req.user._id
    });

    res.status(201).json(evidence);
};

// @desc    Get Evidence by Case
// @route   GET /api/evidence/:caseId
// @access  Private
const getEvidenceByCase = async (req, res) => {
    const evidence = await Evidence.find({ caseId: req.params.caseId });
    res.json(evidence);
};

module.exports = { uploadEvidence, saveEvidence, getEvidenceByCase };
