import * as WebSocket from "ws";
import Blockchain from "./components/blockchain";
import TransactionPool from "./components/wallet/transaction-pool";
import Transaction from "./components/wallet/transaction";

const port = Number(process.env.WS_PORT || 2000);
const peers = process.env.PEERS ? process.env.PEERS.split(",") : [];

enum MessageTypes {
  chain,
  transaction
}
class P2PServer {
  protected blockchain: Blockchain;
  protected transactionPool: TransactionPool;
  protected sockets: Array<WebSocket>;

  constructor(blockchain: Blockchain, tp: TransactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = tp;
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port });
    server.on("connection", this.connectSocket.bind(this));

    this.connectToPeers();

    global.console.log(`Listen p2p server on ${port}`);
  }

  connectToPeers() {
    peers.map(peer => {
      const socket = new WebSocket(peer);
      socket.on("open", () => this.connectSocket(socket));
    });
  }

  connectSocket(socket: WebSocket) {
    this.sockets.push(socket);
    global.console.log("Socket connected");

    this.messageHandler(socket);
    this.sendChain(socket);
  }

  messageHandler(socket: WebSocket) {
    socket.on("message", message => {
      const data = JSON.parse(message as string);
      switch (data.type) {
        case MessageTypes.chain:
          this.blockchain.replaceChain(data.chain);
          break;

        case MessageTypes.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
        default:
          console.log("Invalid message type");
      }
    });
  }

  sendChain(socket: WebSocket) {
    socket.send(
      JSON.stringify({ type: MessageTypes.chain, chain: this.blockchain.chain })
    );
  }

  syncChains() {
    this.sockets.map(this.sendChain.bind(this));
  }

  sendTransaction(socket: WebSocket, trx: Transaction) {
    socket.send(
      JSON.stringify({ type: MessageTypes.transaction, transaction: trx })
    );
  }

  broadcastTransaction(trx: Transaction) {
    this.sockets.map(socket => this.sendTransaction(socket, trx));
  }
}

export default P2PServer;
