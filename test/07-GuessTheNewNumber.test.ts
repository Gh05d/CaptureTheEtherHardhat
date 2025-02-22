import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
const { provider } = ethers;

import { GuessTheNewNumberChallenge, Attacker } from '../typechain-types';

describe('GuessTheNewNumberChallenge', () => {
  let target: GuessTheNewNumberChallenge;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    const TargetFactory = await ethers.getContractFactory('GuessTheNewNumberChallenge', deployer);
    target = (await TargetFactory.deploy({
      value: ethers.parseEther('1'),
    })) as unknown as GuessTheNewNumberChallenge;

    await target.waitForDeployment();

    target = await target.connect(attacker);
  });

  it('exploit', async () => {
    const AttackerFactory = await ethers.getContractFactory('Attacker', attacker);
    const attackerContract = (await AttackerFactory.deploy(target.getAddress(), {
      value: ethers.parseEther('1'),
    })) as unknown as Attacker;

    await attackerContract.waitForDeployment();

    await attackerContract.connect(attacker).attack();

    expect(await provider.getBalance(target.getAddress())).to.equal(0);
  });
});
