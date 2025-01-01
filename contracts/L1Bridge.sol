// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Interface for the L1 Message Service
interface IL1MessageService {
    function sendMessage(
        address recipient,
        uint256 value,
        bytes calldata data
    ) external payable;
}

contract L1Bridge {
    address public owner;
    address public messageService; // Address of the Linea L1 Message Service

    // Events
    event Deposit(address indexed sender, uint256 amount, address indexed recipient);
    event Withdraw(address indexed recipient, uint256 amount);

    constructor(address _messageService) {
        require(_messageService != address(0), "Invalid message service address");
        owner = msg.sender;
        messageService = _messageService;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Deposit ETH for bridging to Linea
    function deposit(address recipient) external payable {
        require(msg.value > 0, "No ETH sent");
        require(recipient != address(0), "Invalid recipient address");

        // Call sendMessage on the L1 Message Service
        IL1MessageService(messageService).sendMessage{value: msg.value}(
            recipient,
            msg.value,
            "" // Optional: Add extra data if needed
        );

        emit Deposit(msg.sender, msg.value, recipient);
    }

    // Withdraw ETH from the contract (triggered by Linea Postman)
    function withdraw(address payable recipient, uint256 amount) external {
        require(msg.sender == messageService, "Caller is not the message service");
        require(amount > 0, "Invalid amount");
        require(address(this).balance >= amount, "Insufficient balance");

        recipient.transfer(amount);
        emit Withdraw(recipient, amount);
    }

    // Update the Linea Message Service address
    function updateMessageService(address newMessageService) external onlyOwner {
        require(newMessageService != address(0), "Invalid message service address");
        messageService = newMessageService;
    }

    // Fallback function to accept ETH
    receive() external payable {}
}