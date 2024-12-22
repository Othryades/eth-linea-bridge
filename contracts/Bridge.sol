// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Bridge {
    address public owner; // Owner of the contract
    address public messageService; // Address of the Linea Message Service

    // Events
    event Deposit(address indexed from, uint256 amount, uint256 chainId);
    event Withdraw(address indexed to, uint256 amount);
    event MessageServiceUpdated(address indexed newMessageService);

    // Constructor
    constructor(address _messageService) {
        require(_messageService != address(0), "Invalid message service address");
        owner = msg.sender; // Set the deployer as the owner
        messageService = _messageService;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Deposit ETH for bridging
    function deposit(uint256 chainId) external payable {
        require(msg.value > 0, "No ETH sent");
        emit Deposit(msg.sender, msg.value, chainId);
    }

    // Withdraw ETH on the destination chain
    function withdraw(address payable to, uint256 amount) external {
        require(msg.sender == messageService, "Only message service can trigger withdrawals");
        require(amount > 0, "Invalid amount");
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
        emit Withdraw(to, amount);
    }

    // Update the message service (only the owner can do this)
    function updateMessageService(address newMessageService) external onlyOwner {
        require(newMessageService != address(0), "Invalid message service address");
        messageService = newMessageService;
        emit MessageServiceUpdated(newMessageService);
    }

    // Fallback function to accept ETH
    receive() external payable {}
}