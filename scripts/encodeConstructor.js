const { ethers } = require("ethers");

async function main() {
    //L1 (Sepolia) msg service contract address	
    const messageServiceAddress = "0xB218f8A4Bc926cF1cA7b3423c154a0D627Bdb7E5";

    // Directly create an instance of AbiCoder
    const abiCoder = new ethers.AbiCoder();
    const encodedArgs = abiCoder.encode(["address"], [messageServiceAddress]);

    console.log("Encoded constructor arguments:", encodedArgs);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
