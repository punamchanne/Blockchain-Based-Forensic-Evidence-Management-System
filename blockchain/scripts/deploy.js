const hre = require("hardhat");

async function main() {
    const EvidenceStorage = await hre.ethers.getContractFactory("EvidenceStorage");
    const evidenceStorage = await EvidenceStorage.deploy();

    await evidenceStorage.waitForDeployment();

    console.log(
        `EvidenceStorage deployed to ${evidenceStorage.target}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
