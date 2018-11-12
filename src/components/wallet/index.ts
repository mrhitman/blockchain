import config from "../../config";
import chainUtil from "../chain-util";

class Wallet {
  public balance: number;
  public keyPair: any;
  public publicKey: string;

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

export default Wallet;
