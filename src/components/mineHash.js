const Block = require("./block");
const config = require("../config");

let hash, time, lastHash, data;
let nonce = 0;

process.on("message", (msg) => {
    lastHash = msg.lastHash;
    lastHash = msg.data;
});

do {
    nonce++;
    time = Date.now();
    hash = Block.hash(time, lastHash, data, nonce);
} while (hash.substring(0, config.difficulty) !== '0'.repeat(config.difficulty))

process.send({
    nonce,
    hash,
    time
});