const Block = require("./block");
const config = require("../config");

process.on("message", (msg) => {
    const { lastHash, data }  = msg;

    let hash, time;
    let nonce = 0;

    do {
        nonce++;
        time = Date.now();
        hash = Block.hash(time, lastHash, data, nonce);
    } while (hash.substring(0, config.difficulty) !== '0'.repeat(config.difficulty))

    process.send({
        time,
        hash,
        nonce
    });
});