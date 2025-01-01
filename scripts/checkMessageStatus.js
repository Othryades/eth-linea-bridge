const { ethers } = require("hardhat");

async function main() {
    const L2MessageServiceAddress = "0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec"; // L2 Message Service
    const L2MessageService = await ethers.getContractAt("IL2MessageService", L2MessageServiceAddress);

    const messageHash = "0xC84C2DE85843B658C2AC8F5B6F7B21F8520C10F256BA1CF8EB9BB5EE580D8CDA";
    const isMessageClaimed = await L2MessageService.isMessageClaimed(messageHash);

    console.log("Is message claimed:", isMessageClaimed);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });