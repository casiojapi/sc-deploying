const { expect } = require('chai');
const { ethers } = require('hardhat');

const { deployContract } = require('./test-util/test-util.js');

describe('Security Audit C-001 Withdrawal', () => {
  let accounts;
  let superHonk;
  let cars;

  let withdrawFailTx;
  let withdrawSuccessTx;

  before(async () => {
    accounts = await ethers.getSigners();
    superHonk = await deployContract('SuperHonk');
    cars = await deployContract('Cars', superHonk.address);

    await cars.connect(accounts[1]).functions.addCar(
      '0xff00ff', // colour: purple
      4, // doors: 4
      {
        value: ethers.utils.parseEther('1.1'),
      },
    );
  });

  it('should not allow other account to withdraw contract balance', async () => {
    withdrawFailTx = cars
      .connect(accounts[1]) // is not contract owner
      .functions
      .contractOwnerWithdraw();
    await expect(withdrawFailTx).to.be.revertedWith('only contract owner');
  });

  it('should have same contract balance after failed attempt to withdraw', async () => {
    // NOTE: Cannot use `changeEtherBalances` because
    // transaction was reverted - manual check instead.
    const contractBalance = await cars
      .provider
      .getBalance(cars.address);
    await expect(contractBalance).to.equal(ethers.utils.parseEther('1.1'));
  });

  it('should allow contract owner account to withdraw contract balance', async () => {
    withdrawSuccessTx = cars
      .connect(accounts[0]) // is contract owner
      .functions
      .contractOwnerWithdraw();
    await expect(withdrawSuccessTx).not.to.be.reverted;
  });

  it('should have transferred full balance from contract to contract owner account after successful attempt to withdraw', async () => {
    // NOTE: `changeEtherBalances` does account for gas expenditure of RBTC,
    // and the amounts asserted only constitute
    // the `value` transferred in the transaction.
    await expect(await withdrawSuccessTx)
      .to.changeEtherBalances(
        [accounts[1], accounts[0], cars],
        [0, ethers.utils.parseEther('1.1'), ethers.utils.parseEther('-1.1')],
      );
  });
});
