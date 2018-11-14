import { fork } from "child_process";
import config from "../config";
import ChainUtil from "./chain-util";

class Block {
  public time: number;
  public lastHash: string;
  public hash: string;
  public data: any;
  public nonce: number;
  public difficulty: number;

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

  static async mineBlock(lastBlock: Block, data) {
    const forked = fork(`${__dirname}/mine-hash.js`);
    const p = new Promise((resolve, reject) => {
      forked.send({ lastBlock, data });
      forked.on("message", resolve);
      forked.on("error", reject);
    });
    const { hash, time, nonce, difficulty } = (await p) as any;

    return new this(time, lastBlock.hash, hash, data, nonce, difficulty);
  }

  static hash(
    time: number,
    lastHash: string,
    data,
    nonce: number,
    difficulty: number
  ) {
    return ChainUtil.hash(`${time}${lastHash}${data}${nonce}${difficulty}`);
  }

  static blockHash(block: Block) {
    const { time, lastHash, data, nonce, difficulty } = block;
    return Block.hash(time, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock: Block, time: number) {
    let difficulty =
      lastBlock.time + config.mine_rate > time
        ? lastBlock.difficulty + 1
        : lastBlock.difficulty - 1;
    difficulty = difficulty > config.max_difficulty ? config.max_difficulty : difficulty;
    difficulty = difficulty < config.min_difficulty ? config.max_difficulty : difficulty;
    return difficulty;
  }
}

export default Block;
