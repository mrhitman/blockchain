// require("dotenv").load();
import * as express from "express";
import Blockchain from "./components/blockchain";
import * as bodyParser from "body-parser";
import P2PServer from "./p2p-server";

const app = express();
const bc = new Blockchain();
const p2pserver = new P2PServer(bc);

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

app.get("/wallet", (req, res) => {});

const port = process.env.HTTP_PORT || 3000;
app.listen(port, () => global.console.log(`Server started on ${port}`));
p2pserver.listen();