import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Attacker, SimpleERC223Token, TokenBankChallenge } from '../typechain-types';

const TOTAL_TOKENS_SUPPLY = 1000000;

describe('TokenBankChallenge', () => {
  let target: TokenBankChallenge;
  let token: SimpleERC223Token;
  let attacker: SignerWithAddress;
  let deployer: SignerWithAddress;
  let attackerContract: Attacker;

  before(async () => {
    [attacker, deployer] = await ethers.getSigners();

    const [targetFactory, tokenFactory] = await Promise.all([
      ethers.getContractFactory('TokenBankChallenge', deployer),
      ethers.getContractFactory('SimpleERC223Token', deployer),
    ]);

    const AttackerFactory = await ethers.getContractFactory('Attacker');
    attackerContract = (await AttackerFactory.deploy()) as unknown as Attacker;

    await attackerContract.waitForDeployment();

    target = (await targetFactory.deploy(
      await attackerContract.getAddress()
    )) as unknown as TokenBankChallenge;
    await target.waitForDeployment();

    const tokenAddress = await target.token();
    token = (await tokenFactory.attach(tokenAddress)) as unknown as SimpleERC223Token;

    await token.waitForDeployment();

    target = target.connect(attacker);
    token = token.connect(attacker);
  });

  it('exploit', async () => {
    await attackerContract.setBankContract(target.getAddress(), token.getAddress());
    await attackerContract.connect(attacker).attack();

    expect(await token.balanceOf(target.getAddress())).to.equal(0);
    expect(await token.balanceOf(attackerContract.getAddress())).to.equal(
      ethers.parseEther(TOTAL_TOKENS_SUPPLY.toString())
    );
  });
});
