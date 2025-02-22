import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import { GuessTheSecretNumberChallenge } from '../typechain-types';

describe('GuessTheSecretNumberChallenge', () => {
  let target: GuessTheSecretNumberChallenge;
  let deployer: SignerWithAddress;
  let attacker: SignerWithAddress;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    target = (await (
      await ethers.getContractFactory('GuessTheSecretNumberChallenge', deployer)
    ).deploy({
      value: ethers.parseEther('1'),
    })) as unknown as GuessTheSecretNumberChallenge;

    await target.waitForDeployment();

    target = target.connect(attacker);
  });

  it('exploit', async () => {
    const hash = await ethers.provider.getStorage(target.getAddress(), 0);

    let solution = 0;

    for (let i = 0; i < 256; i++) {
      const paddedHex = ethers.toBeHex(i, 1);
      const guess = ethers.keccak256(paddedHex);

      if (hash === guess) {
        solution = i;
        break;
      }
    }

    await target.guess(solution, { value: ethers.parseEther('1') });

    expect(await target.isComplete()).to.equal(true);
  });
});
