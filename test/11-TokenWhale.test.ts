import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { TokenWhaleChallenge } from '../typechain-types';

describe('TokenWhaleChallenge', () => {
  let target: TokenWhaleChallenge;
  let attacker: SignerWithAddress;
  let attacker2: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, attacker2, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('TokenWhaleChallenge', deployer)
    ).deploy(attacker.address)) as unknown as TokenWhaleChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    expect(await target.isComplete()).to.equal(true);
  });
});
