import Blockchain from "./blockchain";
import TransactionPool from "./wallet/transaction-pool";
import Wallet from "./wallet";
import P2PServer from "../p2p-server";

class Miner {
  protected blockchain: Blockchain;
  protected transactionPool: TransactionPool;
  protected wallet: Wallet;
  protected p2pServer: P2PServer;

  constructor(blockchain: Blockchain, tp: TransactionPool, wallet: Wallet, p2pServer: P2PServer) {
    this.blockchain = blockchain;
    this.transactionPool = tp;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();


    this.p2pServer.syncChains();
    this.transactionPool.transactions = [];
    // this.p2pServer.broadcastTransaction();
  }
}

export default Miner;
