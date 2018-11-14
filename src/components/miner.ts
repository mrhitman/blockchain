import Blockchain from "./blockchain";
import P2PServer from "../p2p-server";
import Transaction from "./wallet/transaction";
import TransactionPool from "./wallet/transaction-pool";
import Wallet from "./wallet";

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

  async mine() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    const block = await this.blockchain.addBlock(validTransactions);
    this.p2pServer.syncChains();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

export default Miner;
