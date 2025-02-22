import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { Attacker, PredictTheBlockHashChallenge } from '../typechain-types';

describe('PredictTheBlockHashChallenge', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let target: PredictTheBlockHashChallenge;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('PredictTheBlockHashChallenge', deployer)
    ).deploy({ value: ethers.parseEther('1') })) as unknown as PredictTheBlockHashChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    expect(await target.isComplete()).to.equal(true);
  });
});
