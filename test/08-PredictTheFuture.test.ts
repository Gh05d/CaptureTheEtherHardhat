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
    expect(await provider.getBalance(target.getAddress())).to.equal(0);
    expect(await target.isComplete()).to.equal(true);
  });
});
