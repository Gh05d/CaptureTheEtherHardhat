import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MappingChallenge } from '../typechain-types';

describe('MappingChallenge', () => {
  let target: MappingChallenge;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('MappingChallenge', deployer)
    ).deploy()) as unknown as MappingChallenge;

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
