import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
const { provider } = ethers;

import { GuessTheNumberChallenge } from '../typechain-types';

describe('GuessTheNumberChallenge', () => {
  let target: GuessTheNumberChallenge;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('GuessTheNumberChallenge', deployer)
    ).deploy({
      value: ethers.parseEther('1'),
    })) as unknown as GuessTheNumberChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    await target.guess(42, { value: ethers.parseEther('1') });

    expect(await provider.getBalance(target.getAddress())).to.equal(0);
  });
});
