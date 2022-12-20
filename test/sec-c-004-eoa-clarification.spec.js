const { expect } = require('chai');
const { ethers } = require('hardhat');

const { deployContract } = require('./test-util/test-util.js');

describe('Security Audit C-004 EOA clarification', () => {
  let accounts;
  let superHonk;

  before(async () => {
    accounts = await ethers.getSigners();
    superHonk = await deployContract('SuperHonk');
  });

  it('should not allow an EOA to invoke SuperHonk.honk', async () => {
    const txToSend = superHonk
      .connect(accounts[1])
      .functions
      .honk();
    await expect(txToSend).to.be.revertedWith('EOA not allowed');
  });

});
