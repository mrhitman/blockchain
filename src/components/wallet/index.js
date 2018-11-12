const config = require("../../config");
const chainUtil = require("../chain-util");

class Wallet {
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

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }
}

module.exports = Wallet;
