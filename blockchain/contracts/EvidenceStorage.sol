// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EvidenceStorage {
    struct Evidence {
        string ipfsHash;
        string caseId;
        string fileType;
        address uploader;
        uint256 timestamp;
        string evidenceHash; // SHA-256 hash of the file content
    }

    // Mapping from SHA-256 hash to Evidence
    mapping(string => Evidence) public evidences;
    
    // Mapping to check if hash exists
    mapping(string => bool) public evidenceExists;

    event EvidenceUploaded(
        string indexed evidenceHash,
        string ipfsHash,
        string caseId,
        address indexed uploader,
        uint256 timestamp
    );

    constructor() {}

    /**
     * @dev Upload evidence metadata to blockchain
     * @param _ipfshash IPFS Hash of the file
     * @param _caseId Case ID associated with evidence
     * @param _fileType Type of file (image, video, doc)
     * @param _evidenceHash SHA-256 hash of the file content (for verification)
     */
    function uploadEvidence(
        string memory _ipfshash,
        string memory _caseId,
        string memory _fileType,
        string memory _evidenceHash
    ) public {
        require(!evidenceExists[_evidenceHash], "Evidence already exists on blockchain");

        evidences[_evidenceHash] = Evidence({
            ipfsHash: _ipfshash,
            caseId: _caseId,
            fileType: _fileType,
            uploader: msg.sender,
            timestamp: block.timestamp,
            evidenceHash: _evidenceHash
        });

        evidenceExists[_evidenceHash] = true;

        emit EvidenceUploaded(_evidenceHash, _ipfshash, _caseId, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify if evidence exists and return details
     * @param _evidenceHash SHA-256 hash of the file
     */
    function verifyEvidence(string memory _evidenceHash) public view returns (
        bool exists,
        string memory ipfsHash,
        string memory caseId,
        string memory fileType,
        address uploader,
        uint256 timestamp
    ) {
        require(evidenceExists[_evidenceHash], "Evidence not found");
        Evidence memory e = evidences[_evidenceHash];
        
        return (
            true,
            e.ipfsHash,
            e.caseId,
            e.fileType,
            e.uploader,
            e.timestamp
        );
    }
}
