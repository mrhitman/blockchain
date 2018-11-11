const SHA256 = require("crypto-js/sha256");
const config = require("../config");
const fork = require("child_process").fork;

const DIFFICULTY = config.difficulty;

class Block {
    constructor(time, lastHash, hash, data, nonce) {
        this.time = time;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString() {
        return `Block:
            Timestamp: ${this.time}
            Last hash: ${this.lastHash.substring(0, 10)}
            Hash     : ${this.hash.substring(0, 10)}
            Nonce    : ${this.nonce}
            Data     : ${this.data}
        `;
    }

    static genesis() {
        return new this('Genesis time', '-', 'first hash', [], 0);
    }

    static mineBlock(lastBlock, data) {
        let hash, time;
        const lastHash = lastBlock.hash;
        let nonce = 0;

        do {
            nonce++;
            time = Date.now();
            hash = Block.hash(time, lastHash, data, nonce);
        } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY))

        const forked = fork(`${__dirname}/mineHash.js`);
        forked.on("message", msg => {
            console.log('Message from forked', msg);
        })
        forked.send({
            lastHash,
            data
        });

        return new this(time, lastHash, hash, data, nonce);
    }

    static hash(time, lastHash, data, nonce) {
        return SHA256(`${time}${lastHash}${data}${nonce}`).toString();
    }

    static blockHash(block) {
        const {
            time,
            lastHash,
            data,
            nonce
        } = block;
        return Block.hash(time, lastHash, data, nonce);
    }
}

module.exports = Block;