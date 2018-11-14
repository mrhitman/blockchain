import ChainUtil from "../chain-util";
import config from "../../config";
import Wallet from ".";

type InputType = null | {
  time: number;
  amount: number;
  address: string;
  signature: string;
};

type OutputType = {
  amount: number;
  address: string;
};

class Transaction {
  public id: string;
  public input: InputType = null;
  public outputs: Array<OutputType> = [];

  constructor() {
    this.id = ChainUtil.id();
  }

  update(senderWallet: Wallet, receipient: string, amount: number) {
    const senderOutput = this.outputs.find(
      output => output.address === senderWallet.publicKey
    );
    if (amount > senderOutput.amount) {
      global.console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.amount = senderOutput.amount -= amount;
    this.outputs.push({ amount, address: receipient });

    return this.signTransaction(senderWallet);
  }

  static transactionsWithOutputs(senderWallet: Wallet, outputs) {
    const trx = new this();
    trx.outputs.push(...outputs);
    return trx.signTransaction(senderWallet);
  }

  static newTransaction(senderWallet: Wallet, receipient: string, amount: number) {
    if (amount > senderWallet.balance) {
      global.console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    return Transaction.transactionsWithOutputs(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: receipient }
    ]);
  }

  static rewardTransaction(minerWallet: Wallet, blockchainWallet: Wallet) {
    return Transaction.transactionsWithOutputs(blockchainWallet, [
      { amount: config.mining_reward, address: minerWallet.publicKey }
    ])
  }

  signTransaction(senderWallet: Wallet) {
    this.input = {
      time: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(this.outputs))
    };
    return this;
  }

  verifyTransaction() {
    return ChainUtil.verifySignature(
      this.input.address,
      this.input.signature,
      ChainUtil.hash(this.outputs)
    );
  }
}

export default Transaction;
