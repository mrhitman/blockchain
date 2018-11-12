/**
 * @global describe, it, beforeEach
 */

const Blockchain = require("../dist/components/blockchain").default;
const Block = require("../dist/components/block").default;
const expect = require("chai").expect;

describe("Blockchain", () => {
  let bc, bc2;

  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  });

  it("add block", async () => {
    const block = await bc.addBlock("data 1");
    expect(block).to.be.instanceOf(Block);
    expect(bc.chain).length(2);
  });

  it("validate genesis block", async () => {
    expect(bc.isValidChain(bc2.chain)).eq(true);
  });

  it("invalid genesis block", async () => {
    bc2.chain[0].data = "changed data";
    await bc2.addBlock("bc2");
    expect(bc.isValidChain(bc2.chain)).eq(false);
  });

  it("invalid hash block", async () => {
    const block = await bc2.addBlock("bc2");
    block.lastHash = "changed hash";
    await bc2.addBlock("bc3");
    expect(bc.isValidChain(bc2.chain)).eq(false);
  });

  it("replace chain success", async () => {
    await bc.addBlock("1");
    await bc.addBlock("2");
    bc2.replaceChain(bc.chain);
    expect(bc2.chain).eq(bc.chain);
  });

  it("replace shorter chain", async () => {
    await bc.addBlock("1");
    await bc.addBlock("2");
    bc.replaceChain(bc2.chain);
    expect(bc2.chain).not.eq(bc.chain);
  });
});
