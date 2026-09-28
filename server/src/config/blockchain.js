const { ethers } = require('ethers');
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const ABI = [
    "function uploadEvidence(string _ipfsHash, string _caseId, string _fileType, string _evidenceHash) public",
    "event EvidenceUploaded(string indexed evidenceHash, string ipfsHash, string caseId, address indexed uploader, uint256 timestamp)"
];

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);

module.exports = { provider, wallet, contract };
