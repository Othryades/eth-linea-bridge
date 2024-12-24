// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract L1Bridge {
    address public owner;
    address public messageService; // Address of the Linea Message Service

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

    modifier onlyMessageService() {
        require(msg.sender == messageService, "Caller is not the message service");
        _;
    }

    // Deposit ETH for bridging to Linea
    function deposit(address recipient) external payable {
        require(msg.value > 0, "No ETH sent");
        require(recipient != address(0), "Invalid recipient address");

        emit Deposit(msg.sender, msg.value, recipient);
    }

    // Withdraw ETH from the contract (triggered by Linea Postman)
    function withdraw(address payable recipient, uint256 amount) external onlyMessageService {
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