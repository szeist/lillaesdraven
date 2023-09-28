// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract SharedWallet {
    address public wife;
    address public husband;
    uint256 public pendingAmount;
    address public pendingRecipient;
    address public lastInitiator;

    constructor(address _wife, address _husband) {
        wife = _wife;
        husband = _husband;
    }

    receive() external payable { }

    modifier spouses() {
        require(msg.sender == wife || msg.sender == husband, "Not an authorized party");
        _;
    }

    modifier notInitiator() {
        require(msg.sender != lastInitiator, "Cannot approve your own transaction");
        _;
    }

    function deposit() external payable {}

    function initiateTransfer(address recipient, uint256 amount) external spouses {
        require(address(this).balance >= amount, "Insufficient funds");
        require(pendingAmount == 0, "Another transaction is pending");

        pendingAmount = amount;
        pendingRecipient = recipient;
        lastInitiator = msg.sender;
    }

    function approveTransfer() external spouses notInitiator {
        require(pendingAmount > 0, "No transaction to approve");

        payable(pendingRecipient).transfer(pendingAmount);

        pendingAmount = 0;
        pendingRecipient = address(0);
        lastInitiator = address(0);
    }

    function cancelTransfer() external spouses {
        require(pendingAmount > 0, "No transaction to cancel");

        pendingAmount = 0;
        pendingRecipient = address(0);
        lastInitiator = address(0);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
