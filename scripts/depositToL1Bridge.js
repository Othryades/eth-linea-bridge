const { ethers } = require("hardhat");

async function main() {
    const L1BridgeAddress = "0x2962DCDA71736e2cBAFd5939B48c64070Bc075a1";
    const recipient = "0x4D3A61d1591f0724D23fD27c78294734980Ee891";
    const amount = ethers.parseEther("0.0001"); // Correct way to parse 0.0001 ETH

    const L1Bridge = await ethers.getContractAt("L1Bridge", L1BridgeAddress);
    const tx = await L1Bridge.deposit(recipient, { value: amount });
    await tx.wait();

    console.log("Deposit successful, transaction hash:", tx.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deposit:", error);
        process.exit(1);
    });