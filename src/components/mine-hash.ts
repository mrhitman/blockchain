import Block from "./block";

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
    hash.substring(0, difficulty) !== "0".repeat(difficulty)
  );

  process.send({
    time,
    hash,
    nonce,
    difficulty
  });
});
