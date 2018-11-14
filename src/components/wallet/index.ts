import config from "../../config";
import chainUtil from "../chain-util";
import TransactionPool from "./transaction-pool";
import Transaction from "./transaction";

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

  createTransaction(recipient: string, amount: number, tp: TransactionPool) {
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

  static blockchainWallet() {
    const wallet = new this();
    wallet.address = "blockchain-wallet";
    return wallet;
  }
}

export default Wallet;
