import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
const { utils } = ethers;

describe('DonationChallenge', () => {
  let target: Contract;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = await (
      await ethers.getContractFactory('DonationChallenge', deployer)
    ).deploy({
      value: ethers.parseEther('1'),
    });

    await target.waitForDeployment();

    target = await target.connect(attacker);
  });

  it('exploit', async () => {
    /**
     * YOUR CODE HERE
     * */

    expect(await target.isComplete()).to.equal(true);
  });
});
