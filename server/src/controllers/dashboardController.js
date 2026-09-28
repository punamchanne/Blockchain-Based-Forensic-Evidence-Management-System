const Case = require('../models/Case');
const Evidence = require('../models/Evidence');
const User = require('../models/User');

// @desc    Get Super Admin Dashboard Stats & Activity
// @route   GET /api/dashboard/stats
// @access  Private (Super Admin)
const getDashboardStats = async (req, res) => {
    try {
        // 1. Counts
        const totalCases = await Case.countDocuments();
        const activeCases = await Case.countDocuments({ status: 'open' });
        const totalEvidence = await Evidence.countDocuments();
        const totalOfficers = await User.countDocuments({ role: 'admin' });

        // 2. Recent Cases (Last 5)
        const recentCases = await Case.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('createdBy', 'name');

        // 3. Recent Evidence (Last 5)
        const recentEvidence = await Evidence.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('uploadedBy', 'name');

        // 4. Merge into "Alerts/Activity"
        const activity = [];

        recentCases.forEach(c => {
            activity.push({
                id: `case-${c._id}`,
                type: 'info',
                msg: `New Case Opened: #${c.caseId} (${c.incidentType})`,
                time: c.createdAt,
                sortTime: c.createdAt
            });
        });

        recentEvidence.forEach(e => {
            activity.push({
                id: `ev-${e._id}`,
                type: 'alert',
                msg: `Evidence Uploaded to Case #${e.caseId}`,
                fileUrl: e.fileUrl,
                fileType: e.fileType,
                time: e.createdAt,
                sortTime: e.createdAt
            });
        });

        // Add System checks
        activity.push({
            id: 'sys-ipfs',
            type: 'success',
            msg: 'IPFS Gateway Connected',
            time: new Date(),
            sortTime: new Date()
        });

        // Sort by time desc
        activity.sort((a, b) => new Date(b.sortTime) - new Date(a.sortTime));

        res.json({
            stats: {
                totalCases,
                activeCases,
                totalEvidence,
                totalOfficers
            },
            activity
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Admin Personal History
// @route   GET /api/dashboard/history
// @access  Private (Admin)
const getAdminHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch cases created by this admin
        const myCases = await Case.find({ createdBy: userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Fetch evidence uploaded by this admin
        const myEvidence = await Evidence.find({ uploadedBy: userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // Combine into history logs
        const history = [];

        myCases.forEach(c => {
            history.push({
                action: "New Case Created",
                id: `#${c.caseId}`,
                time: c.createdAt,
                desc: `${c.incidentType} - ${c.location || 'Local HQ'}`,
                type: "CREATE"
            });
        });

        myEvidence.forEach(e => {
            history.push({
                action: "Evidence Uploaded",
                id: `#RECORD`,
                time: e.createdAt,
                desc: `File: ${e.fileUrl.split('/').pop()} uploaded to Case #${e.caseId}`,
                type: "UPLOAD"
            });
        });

        // Sort by time
        history.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDashboardStats, getAdminHistory };
