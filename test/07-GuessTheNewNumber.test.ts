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
    expect(await provider.getBalance(target.getAddress())).to.equal(0);
  });
});
