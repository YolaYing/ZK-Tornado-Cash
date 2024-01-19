// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract DepositContract {
    address public user1;
    address public user2;
    uint256 public totalDeposited;
    bool public isUser1Deposited;
    bool public isUser2Deposited;

    event Mixed(address indexed user1, address indexed user2);

    modifier onlyUser1() {
        require(msg.sender == user1, "Only User1 can call this function");
        _;
    }

    modifier onlyUser2() {
        require(msg.sender == user2, "Only User2 can call this function");
        _;
    }

    modifier bothUsersNotDeposited() {
        require(!isUser1Deposited || !isUser2Deposited, "Both users have already deposited");
        _;
    }

    modifier bothUsersDeposited() {
        require(isUser1Deposited && isUser2Deposited, "Both users have not deposited yet");
        _;
    }

    function deposit() external payable bothUsersNotDeposited {
        if (!isUser1Deposited) {
            user1 = msg.sender;
            isUser1Deposited = true;
        } else {
            require(msg.sender != user1, "User1 cannot deposit twice");
            user2 = msg.sender;
            isUser2Deposited = true;
        }

        totalDeposited += msg.value;

        if (isUser1Deposited && isUser2Deposited) {
            emit Mixed(user1, user2);
        }
    }

    function getUserAddresses() external view bothUsersDeposited returns (address, address) {
        return (user1, user2);
    }
}