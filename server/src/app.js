const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const evidenceRoutes = require('./routes/evidenceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const sketchRoutes = require('./routes/sketchRoutes');
const criminalRoutes = require('./routes/criminalRoutes');
const faceAuthRoutes = require('./routes/faceAuthRoutes');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded by other origins (frontend)
}));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sketch', sketchRoutes);
app.use('/api/criminals', criminalRoutes);
app.use('/api/face-auth', faceAuthRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/ai-outputs', express.static(path.join(__dirname, 'ai/outputs')));

module.exports = app;
