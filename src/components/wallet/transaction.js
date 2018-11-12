const chainUtil = require("../chain-util");

class Transaction {
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

    transaction.sign(senderWallet);
    return transaction;
  }

  sign(senderWallet) {
    this.input = {
      time: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(chainUtil.hash(this.outputs))
    };
  }
}

module.exports = Transaction;
