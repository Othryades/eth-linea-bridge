const { ethers } = require("hardhat");

async function main() {
    // Replace with the correct message service address
    // const messageServiceAddress = "0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec"; // Linea Mainnet
    const messageServiceAddress = "0x971e727e956690b9957be6d51Ec16E73AcAC83A7"; // Linea Mainnet
    

    console.log("Deploying Bridge contract...");

    // Get the contract factory
    const Bridge = await ethers.getContractFactory("Bridge");

    // Deploy the contract
    const bridge = await Bridge.deploy(messageServiceAddress);

    // Wait for the contract to be deployed
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