
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Case = require('../server/src/models/Case');

dotenv.config({ path: './server/.env' });

const listCases = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const cases = await Case.find({}, 'caseId');
        console.log('Existing Case IDs:');
        cases.forEach(c => console.log(`- ${c.caseId}`));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listCases();
