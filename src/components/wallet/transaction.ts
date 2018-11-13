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

  static newTransaction(
    senderWallet: Wallet,
    receipient: string,
    amount: number
  ) {
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

    return transaction.signTransaction(senderWallet);
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
