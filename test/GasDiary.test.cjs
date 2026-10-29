const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GasDiary Contract", function () {
  let gasDiary;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const GasDiaryFactory = await ethers.getContractFactory("GasDiary");
    gasDiary = await GasDiaryFactory.deploy();
    await gasDiary.waitForDeployment();
  });

  it("should allow a user to tag a transaction with category and note", async function () {
    const fakeTxHash = ethers.keccak256(ethers.toUtf8Bytes("tx-test-1"));

    await expect(
      gasDiary.connect(user1).tagTransaction(fakeTxHash, "DeFi Swap", "Swapped BOT for USDT")
    )
      .to.emit(gasDiary, "TransactionTagged")
      .withArgs(user1.address, fakeTxHash, "DeFi Swap", "Swapped BOT for USDT", (t) => t > 0);

    const tag = await gasDiary.getUserTag(user1.address, fakeTxHash);
    expect(tag.category).to.equal("DeFi Swap");
    expect(tag.note).to.equal("Swapped BOT for USDT");
    expect(tag.exists).to.be.true;

    const hashes = await gasDiary.getUserTaggedHashes(user1.address);
    expect(hashes.length).to.equal(1);
    expect(hashes[0]).to.equal(fakeTxHash);

    const count = await gasDiary.getUserTagCount(user1.address);
    expect(count).to.equal(1);
  });

  it("should allow batch tagging multiple transactions", async function () {
    const hash1 = ethers.keccak256(ethers.toUtf8Bytes("tx-batch-1"));
    const hash2 = ethers.keccak256(ethers.toUtf8Bytes("tx-batch-2"));

    await gasDiary.connect(user1).batchTagTransactions(
      [hash1, hash2],
      ["NFT Mint", "Contract Deployment"],
      ["Minted rare pass", "Deployed test contract"]
    );

    const count = await gasDiary.getUserTagCount(user1.address);
    expect(count).to.equal(2);

    const batchRecords = await gasDiary.getUserTagsBatch(user1.address, [hash1, hash2]);
    expect(batchRecords[0].category).to.equal("NFT Mint");
    expect(batchRecords[1].category).to.equal("Contract Deployment");
  });

  it("should allow removing a tag and updating list properly", async function () {
    const hash1 = ethers.keccak256(ethers.toUtf8Bytes("tx-remove-1"));
    const hash2 = ethers.keccak256(ethers.toUtf8Bytes("tx-remove-2"));

    await gasDiary.connect(user1).tagTransaction(hash1, "Transfer", "Sent BOT to friend");
    await gasDiary.connect(user1).tagTransaction(hash2, "Staking", "Validator stake");

    expect(await gasDiary.getUserTagCount(user1.address)).to.equal(2);

    await expect(gasDiary.connect(user1).removeTag(hash1))
      .to.emit(gasDiary, "TagRemoved")
      .withArgs(user1.address, hash1, (t) => t > 0);

    expect(await gasDiary.getUserTagCount(user1.address)).to.equal(1);

    const remainingHashes = await gasDiary.getUserTaggedHashes(user1.address);
    expect(remainingHashes.length).to.equal(1);
    expect(remainingHashes[0]).to.equal(hash2);

    const tag1 = await gasDiary.getUserTag(user1.address, hash1);
    expect(tag1.exists).to.be.false;
  });

  it("should isolate tags between different users", async function () {
    const commonHash = ethers.keccak256(ethers.toUtf8Bytes("common-tx"));

    await gasDiary.connect(user1).tagTransaction(commonHash, "User1 Cat", "Note 1");
    await gasDiary.connect(user2).tagTransaction(commonHash, "User2 Cat", "Note 2");

    const tagUser1 = await gasDiary.getUserTag(user1.address, commonHash);
    const tagUser2 = await gasDiary.getUserTag(user2.address, commonHash);

    expect(tagUser1.category).to.equal("User1 Cat");
    expect(tagUser2.category).to.equal("User2 Cat");
  });
});
