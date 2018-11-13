// require("dotenv").load();
import * as express from "express";
import * as bodyParser from "body-parser";
import Blockchain from "./components/blockchain";
import P2PServer from "./p2p-server";
import TransactionPool from "./components/wallet/transaction-pool";
import Wallet from "./components/wallet";

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pserver = new P2PServer(bc, tp);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

app.post("/mine", async (req, res) => {
  const block = await bc.addBlock(req.body.data);
  global.console.log(`New block added ${block.toString()}`);

  p2pserver.syncChains();

  res.redirect("/blocks");
});

app.get("/transactions", (req, res) => {
  res.json(tp.transactions);
});

app.post("/transact", (req, res) => {
  const { recipient, amount } = req.body;
  const trx = wallet.createTransaction(recipient, amount, tp);

  p2pserver.broadcastTransaction(trx);

  res.redirect("/transactions");
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: wallet.publicKey });
});

const port = process.env.HTTP_PORT || 3000;

app.listen(port, () => global.console.log(`Server started on ${port}`));
p2pserver.listen();
