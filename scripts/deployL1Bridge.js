const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying L1Bridge contract...");
    // Linea Mainnet L1 Message Service address
    // const messageServiceAddress = "0xd19d4B5d358258f05D7B411E21A1460D11B0876F";
    // Sepolia Message Service address
    const messageServiceAddress = "0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5";

    // Get the deployer's signer
    const [deployer] = await ethers.getSigners();
    console.log("Deploying from account:", deployer.address);

    // Get the contract factory
    const L1Bridge = await ethers.getContractFactory("L1Bridge");

    // Deploy the contract
    const l1Bridge = await L1Bridge.deploy(messageServiceAddress);

    // Wait for the deployment to be mined
    await l1Bridge.waitForDeployment();

    // Log the deployed contract address
    console.log("L1Bridge contract deployed to:", l1Bridge.target);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });    