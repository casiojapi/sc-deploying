// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.7;

import { ISuperHonk } from './ISuperHonk.sol';

contract Cars {
  enum CarStatus {
    driving,
    parked
  }

  event CarHonk(uint256 indexed carId);

  struct Car {
    bytes3 colour;
    uint8 doors;
    CarStatus status;
    address owner;
  }

  address payable public contractOwner;
  ISuperHonk private superHonk;
  uint256 public numCars = 0;
  mapping(uint256 => Car) public cars;

  constructor(address superHonkAddress) {
    contractOwner = payable(msg.sender);
    superHonk = ISuperHonk(superHonkAddress);
  }

  function addCar(bytes3 colour, uint8 doors)
    external
    payable
    returns (uint256 carId)
  {
    require(msg.value > 0.1 ether, 'requires payment');
    carId = ++numCars;
    Car memory newCar = Car(colour, doors, CarStatus.parked, msg.sender);
    cars[carId] = newCar;
  }

  function statusChange(uint256 carId, CarStatus newStatus)
    external
    onlyOwner(carId)
  {
    require(cars[carId].status != newStatus, 'no change');
    cars[carId].status = newStatus;
  }

  function honk(uint256 carId, bool isLoud) external onlyOwner(carId) {
    emit CarHonk(carId);
    if (isLoud) {
      superHonk.honk();
    }
  }

  function contractOwnerWithdraw() external {
    require(msg.sender == contractOwner, "only contract owner");
    contractOwner.transfer(address(this).balance);
  }

  modifier onlyOwner(uint256 carId) {
    require(cars[carId].owner == msg.sender, 'only owner');
    _;
  }
}
