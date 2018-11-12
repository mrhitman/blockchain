import ChainUtil from "../chain-util";
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

  static newTransaction(senderWallet: Wallet, receipient: string, amount: number) {
    const transaction = new this();

    if (amount > senderWallet.balance) {
      global.console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    transaction.outputs.push(
      ...[
        {
          amount: senderWallet.balance - amount,
          address: senderWallet.publicKey
        },
        { amount, address: receipient }
      ]
    );

    transaction.signTransaction(senderWallet);
    return transaction;
  }

  signTransaction(senderWallet: Wallet) {
    this.input = {
      time: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(this.outputs))
    };
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
