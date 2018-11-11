const SHA256 = require("crypto-js/sha256");
const fork = require("child_process").fork;

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

    static async mineBlock(lastBlock, data) {
        const lastHash = lastBlock.hash;

        const forked = fork(`${__dirname}/mineHash.js`);
        const p = new Promise((resolve, reject) => {
            forked.send({
                lastHash,
                data
            });
            forked.on("message", resolve);
            forked.on("error", reject);
        });
        const {
            hash,
            time,
            nonce
        } = await p;

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