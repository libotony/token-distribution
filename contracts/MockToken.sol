pragma solidity ^0.4.18;

import './StandardToken.sol';

contract MockToken is StandardToken {
  string public constant NAME    = "Mock Token";  //The Token's name
  uint8 public constant DECIMALS = 18;              //Number of decimals of the smallest unit
  string public constant SYMBOL  = "MTN";           //An identifier

  function MockToken() public {
    totalSupply_ = (10 ** 9 ) * (10 ** 18);
    balances[msg.sender] = totalSupply_;
    Transfer(0, msg.sender, totalSupply_);
  }
}