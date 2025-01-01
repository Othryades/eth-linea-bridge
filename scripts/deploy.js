const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying Bridge contract...");

    // Linea Testnet Message Service Address
    const messageServiceAddress = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7";

    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();
    console.log("Deploying from account:", deployer.address);

    // Get the contract factory
    const Bridge = await ethers.getContractFactory("Bridge");

    // Deploy the contract
    const bridge = await Bridge.deploy(messageServiceAddress);

    // Wait for deployment to be mined
    await bridge.waitForDeployment();

    // Log the deployed contract address
    console.log("Bridge contract deployed to:", bridge.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });