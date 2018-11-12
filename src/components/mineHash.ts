import Block from "./block";
import config from "../config";

process.on("message", ({ lastBlock, data }) => {
  let hash, time;
  let nonce = 0;
  let difficulty;

  do {
    nonce++;
    time = Date.now();
    difficulty = Block.adjustDifficulty(lastBlock, time);
    hash = Block.hash(time, lastBlock.hash, data, nonce, difficulty);
  } while (
    hash.substring(0, config.difficulty) !== "0".repeat(config.difficulty)
  );

  process.send({
    time,
    hash,
    nonce,
    difficulty
  });
});
