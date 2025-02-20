import { expect } from 'chai';
import { Contract, Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('FuzzyIdentityChallenge', () => {
  let target: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (await ethers.getContractFactory('FuzzyIdentityChallenge', deployer)).deploy();

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    /**
     * YOUR CODE HERE
     * */

    expect(await target.isComplete()).to.equal(true);
  });
});
