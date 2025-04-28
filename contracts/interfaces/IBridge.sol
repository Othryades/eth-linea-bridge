// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBridge {
    // Common events
    event Withdraw(address indexed recipient, uint256 amount);
    
    // Common functions
    function withdraw(address payable recipient, uint256 amount) external;
    function updateMessageService(address newMessageService) external;
    
    // View functions
    function owner() external view returns (address);
    function messageService() external view returns (address);
} 