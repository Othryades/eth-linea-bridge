const { ethers } = require("hardhat");

async function main() {
    const L2BridgeAddress = "0x2962DCDA71736e2cBAFd5939B48c64070Bc075a1";

    const L2Bridge = await ethers.getContractAt("Bridge", L2BridgeAddress);

    // Fetch all Withdraw events
    const filter = L2Bridge.filters.Withdraw();
    const events = await L2Bridge.queryFilter(filter, 0, "latest");

    console.log("Withdraw events on L2 (Linea Testnet):", events);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during event query:", error);
        process.exit(1);
    });