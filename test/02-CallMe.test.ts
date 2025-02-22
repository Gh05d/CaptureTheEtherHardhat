import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { CallMeChallenge } from '../typechain-types';

describe('CallMeChallenge', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let target: CallMeChallenge;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('CallMeChallenge', deployer)
    ).deploy()) as unknown as CallMeChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    expect(await target.isComplete()).to.equal(true);
  });
});
