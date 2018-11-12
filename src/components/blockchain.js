const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  async addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = await Block.mineBlock(lastBlock, data);
    this.chain.push(block);

    return block;
  }

  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      if (block.lastHash !== lastBlock.hash) {
        return false;
      }
      if (block.hash !== Block.blockHash(block)) {
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      global.console.log("New chain isn't long anought");
      return;
    }

    if (!this.isValidChain(newChain)) {
      global.console.log("New chain isn't valid");
      return;
    }

    global.console.log("Replace chain to new one succeed");
    this.chain = newChain;
  }
}

module.exports = Blockchain;
