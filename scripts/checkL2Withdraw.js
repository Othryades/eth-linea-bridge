const { ethers } = require("hardhat");

async function main() {
    // Use the Linea Testnet Bridge address
    const L2BridgeAddress = "0x69395caF540df3de167613503d478deF52485290"; // Linea Testnet Bridge
    const L2Bridge = await ethers.getContractAt("Bridge", L2BridgeAddress);

    // Fetch all Withdraw events
    const filter = L2Bridge.filters.Withdraw();
    const events = await L2Bridge.queryFilter(filter, "latest");

    console.log("Withdraw events on L2 (Linea Testnet):", events);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });