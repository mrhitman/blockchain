// require("dotenv").load();
const express = require("express");
const Blockchain = require("./components/blockchain");
const bodyParser = require("body-parser");
const P2PServer = require("./p2p-server");

const app = express();
const bc = new Blockchain();
const p2pserver = new P2PServer(bc);

app.use(bodyParser.json());

app.get("/blocks", (req, res) => {
    res.json(bc.chain);
});

app.post("/mine", (req, res) => {
    const block = bc.addBlock(req.body.data);
    global.console.log(`New block added ${block.toString()}`);

    p2pserver.syncChains();

    res.redirect("/blocks");
});

const port = process.env.HTTP_PORT || 3000;
app.listen(port, () => global.console.log(`Server started on ${port}`));
p2pserver.listen();