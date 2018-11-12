import { Server, WebSocket } from "ws";
import Blockchain from "./components/blockchain";

const port = process.env.WS_PORT || 2000;
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

class P2PServer {
  protected blockchain: Blockchain;
  protected sockets: Array<WebSocket>;
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new Server({ port });
    server.on("connection", this.connectSocket.bind(this));

    this.connectToPeers();

    console.log(`Listen p2p server on ${port}`);
  }

  connectToPeers() {
    peers.map(peer => {
      const socket = new WebSocket(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    global.console.log("Socket connected");

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket) {
    socket.on("message", message => {
      const data = JSON.parse(message);

      this.blockchain.replaceChain(data);
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify(this.blockchain.chain));
  }

  syncChains() {
    this.sockets.map(socket => {
      this.sendChain(socket);
    });
  }
}

export default P2PServer;
