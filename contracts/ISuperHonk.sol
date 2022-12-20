// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

interface ISuperHonk {
  function count() external view returns (uint256);

  function honk() external;
}

contract SuperHonk is ISuperHonk {
  uint256 public override count;

  event LoudSound(address indexed source);

  function honk() external override {
    require(tx.origin != msg.sender, 'EOA not allowed');
    count += 1;
    emit LoudSound(tx.origin);
  }
}
