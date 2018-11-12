const SHA256 = require("crypto-js/sha256");
const fork = require("child_process").fork;
const config = require("../config");

class Block {
  constructor(time, lastHash, hash, data, nonce, difficulty) {
    this.time = time;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  toString() {
    return `Block:
            Timestamp : ${this.time}
            Last hash : ${this.lastHash.substring(0, 10)}
            Hash      : ${this.hash.substring(0, 10)}
            Nonce     : ${this.nonce}
            Difficulty: ${this.difficulty}
            Data      : ${this.data}
        `;
  }

  static genesis() {
    return new this(
      "Genesis time",
      "-",
      "first hash",
      [],
      0,
      config.difficulty
    );
  }

  static async mineBlock(lastBlock, data) {
    const forked = fork(`${__dirname}/mineHash.js`);
    const p = new Promise((resolve, reject) => {
      forked.send({ lastBlock, data });
      forked.on("message", resolve);
      forked.on("error", reject);
    });
    const { hash, time, nonce, difficulty } = await p;

    return new this(time, lastBlock.hash, hash, data, nonce, difficulty);
  }

  static hash(time, lastHash, data, nonce, difficulty) {
    return SHA256(`${time}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const { time, lastHash, data, nonce, difficulty } = block;
    return Block.hash(time, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, time) {
    return lastBlock.time + config.mine_rate > time
      ? lastBlock.difficulty + 1
      : lastBlock.difficulty - 1;
  }
}

module.exports = Block;
