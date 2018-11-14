import config from "../../config";
import chainUtil from "../chain-util";
import TransactionPool from "./transaction-pool";
import Transaction from "./transaction";
import Blockchain from "../blockchain";

class Wallet {
  public balance: number;
  public keyPair: any;
  public publicKey: string;
  public address: string;

  constructor() {
    this.balance = config.initial_balance;
    this.keyPair = chainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  toString() {
    return `Wallet: 
            publicKet: ${this.publicKey.toString()}
            balance  : ${this.balance}
        `;
  }

  sign(dataHash: string) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient: string, amount: number, bc: Blockchain, tp: TransactionPool) {
    this.balance = this.calculateBalance(bc);

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
      return;
    }

    let trx = tp.existingTransaction(this.publicKey);
    trx = trx
      ? trx.update(this, recipient, amount)
      : Transaction.newTransaction(this, recipient, amount);

    tp.updateOrAddTransaction(trx);
    return trx;
  }

  calculateBalance(blockchain: Blockchain) {
    let balance = this.balance;
    let transactions = [];

    blockchain.chain.map(block =>
      block.data.map(trx => {
        transactions.push(trx);
      })
    );

    const walletInputTs = transactions.filter(
      trx => trx.input.address === this.publicKey
    );

    let startTime = 0;

    if (walletInputTs.length) {
      const recentInputT = walletInputTs.reduce(
        (prev, current) =>
          prev.input.time > current.input.time ? prev : current,
        0
      );

      balance = recentInputT.outputs.find(
        output => output.address === this.publicKey
      ).amount;

      startTime = recentInputT.input.time;

      transactions.map(trx => {
        if (trx.input.time > startTime) {
          trx.outputs.find(output => {
            if (output.address === this.publicKey) {
              balance += output.amount;
            }
          });
        }
      });
    }

    return balance;
  }

  static blockchainWallet() {
    const wallet = new this();
    wallet.address = "blockchain-wallet";
    return wallet;
  }
}

export default Wallet;
