const Case = require('../models/Case');

// @desc    Create a new case
// @route   POST /api/cases
// @access  Private (Admin)
const createCase = async (req, res) => {
    const { caseId, incidentType, location, description } = req.body;

    const caseExists = await Case.findOne({ caseId });
    if (caseExists) {
        console.log(`[Error] Duplicate Case ID: ${caseId}`);
        return res.status(400).json({ message: 'Case ID already exists' });
    }

    const newCase = await Case.create({
        caseId,
        incidentType,
        location,
        description,
        createdBy: req.user._id,
        status: 'open'
    });

    res.status(201).json(newCase);
};

// @desc    Get all cases
// @route   GET /api/cases
// @access  Private (Super Admin / Admin)
const getCases = async (req, res) => {
    // If super admin, return all. If admin, return all or just theirs? 
    // Spec says "Super Admin: View all cases". "Admin: View blockchain proof" implied access to cases.
    // Usually Admins work on cases. Let's return all for now or filter.
    // For simplicity, return all cases sorted by date.

    const cases = await Case.find({}).populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(cases);
};

// @desc    Get single case
// @route   GET /api/cases/:id
// @access  Private
const getCaseById = async (req, res) => {
    const pCase = await Case.findById(req.params.id).populate('createdBy', 'name email');
    if (pCase) {
        res.json(pCase);
    } else {
        res.status(404).json({ message: 'Case not found' });
    }
};

// @desc    Update case status
// @route   PUT /api/cases/:id/status
// @access  Private (Admin)
const updateCaseStatus = async (req, res) => {
    const { status } = req.body;
    const pCase = await Case.findById(req.params.id);

    if (pCase) {
        pCase.status = status;
        const updatedCase = await pCase.save();
        res.json(updatedCase);
    } else {
        res.status(404).json({ message: 'Case not found' });
    }
};

module.exports = { createCase, getCases, getCaseById, updateCaseStatus };
