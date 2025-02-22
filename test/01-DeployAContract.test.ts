import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { DeployChallenge } from '../typechain-types';

describe('DeployChallenge', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let target: DeployChallenge;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();
  });

  it('exploit', async () => {
    target = (await (
      await ethers.getContractFactory('DeployChallenge', deployer)
    ).deploy()) as unknown as DeployChallenge;

    await target.waitForDeployment();

    expect(await target.isComplete()).to.equal(true);
  });
});
