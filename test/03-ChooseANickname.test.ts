import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';

import { NicknameChallenge } from '../typechain-types';

describe('NicknameChallenge', () => {
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;
  let captureTheEther: Contract;
  let target: NicknameChallenge;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    captureTheEther = await (
      await ethers.getContractFactory('CaptureTheEther', attacker)
    ).deploy(attacker.address);

    await captureTheEther.waitForDeployment();

    target = (await (
      await ethers.getContractFactory('NicknameChallenge')
    ).attach(
      await captureTheEther.playerNicknameContract(attacker.address)
    )) as unknown as NicknameChallenge;

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    expect(await target.isComplete()).to.equal(true);
  });
});
