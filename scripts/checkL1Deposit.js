const { ethers } = require("hardhat");

async function main() {
    const L1BridgeAddress = "0x014bB8655Ec464b26230Bd53cf002477E7C2a99d"; // Replace with your L1 Bridge address

    const L1Bridge = await ethers.getContractAt("L1Bridge", L1BridgeAddress);

    // Fetch all Deposit events
    const filter = L1Bridge.filters.Deposit();
    const events = await L1Bridge.queryFilter(filter, "latest");

    console.log("Deposit events on L1 (Sepolia):", events);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deposit check:", error);
        process.exit(1);
    });