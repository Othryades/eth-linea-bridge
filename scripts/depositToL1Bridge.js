const { ethers } = require("hardhat");

async function main() {
     // L1 Bridge address
    const L1BridgeAddress = "0x014bB8655Ec464b26230Bd53cf002477E7C2a99d";
    // L2 wallet address
    const recipient = "0xdC97b9eA6CD77eeF8A803AE09152B782A327C6a8"; 
    const amount = ethers.parseEther("0.0004"); // in ETH

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
