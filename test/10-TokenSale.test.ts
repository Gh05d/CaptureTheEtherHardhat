import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { TokenSaleChallenge, Attacker } from '../typechain-types';

describe('TokenSaleChallenge', () => {
  let target: TokenSaleChallenge;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('TokenSaleChallenge', deployer)
    ).deploy(attacker.address, {
      value: ethers.parseEther('1'),
    })) as unknown as TokenSaleChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    expect(await target.isComplete()).to.equal(true);
  });
});
