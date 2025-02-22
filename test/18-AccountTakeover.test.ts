import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { AccountTakeoverChallenge } from '../typechain-types';

describe('AccountTakeover', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let target: AccountTakeoverChallenge;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('AccountTakeover', deployer)
    ).deploy()) as unknown as AccountTakeoverChallenge;

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
