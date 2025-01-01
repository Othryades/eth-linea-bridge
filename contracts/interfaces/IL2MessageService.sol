// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IL2MessageService {
    function isMessageClaimed(bytes32 messageHash) external view returns (bool);
}