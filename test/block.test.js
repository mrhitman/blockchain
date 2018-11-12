/**
 * @global describe, it, beforeEach
 */

const expect = require("chai").expect;
const Block = require("../dist/components/block").default;
const config = require("../dist/config").default;

describe("Block", () => {
  let data, lastBlock, block;

  beforeEach(async () => {
    data = "some data";
    lastBlock = Block.genesis();
    block = await Block.mineBlock(lastBlock, data);
  });

  it("genesis", () => {
    expect(lastBlock).to.be.instanceof(Block);
  });

  it("mine block", () => {
    expect(block).to.be.instanceof(Block);
  });

  it("create", () => {
    const block = new Block(0, "", "", {});
    expect(block).to.be.instanceof(Block);
  });

  it("check hash of lastBlock to block", () => {
    expect(block.lastHash).eq(lastBlock.hash);
  });

  it("generate hash that match difficulty", async () => {
    const b = await Block.mineBlock(block, "some");
    expect(b.lastHash.substring(0, config.difficulty)).eq(
      "0".repeat(config.difficulty)
    );
  });
});
