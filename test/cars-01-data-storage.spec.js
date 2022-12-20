const { expect } = require('chai');
const { ethers } = require('hardhat');

const { deployContract } = require('./test-util/test-util.js');

describe('Cars - data storage', () => {
  let accounts;
  let superHonk;
  let cars;

  before(async () => {
    accounts = await ethers.getSigners();
    superHonk = await deployContract('SuperHonk');
    cars = await deployContract('Cars', superHonk.address);
  });

  it('should initialise with zero cars', async () => {
    const initialNumCars = await cars.callStatic.numCars();

    expect(initialNumCars).to.equal(0);
  });
});
