import chainUtil from "../chain-util";
import ChainUtil from "../chain-util";

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
  public input: InputType;
  public outputs: Array<OutputType>;

  constructor() {
    this.id = chainUtil.id();
    this.input = null;
    this.outputs = [];
  }

  static newTransaction(senderWallet, receipient, amount) {
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

  signTransaction(senderWallet) {
    this.input = {
      time: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(chainUtil.hash(this.outputs))
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
