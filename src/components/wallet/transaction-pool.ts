import Transaction from "./transaction";

class TransactionPool {
  public transactions: Array<Transaction> = [];

  updateOrAddTransaction(trx: Transaction) {
    let trxWithId = this.transactions.find(trx => trx.id === trx.id);

    if (trxWithId) {
      this.transactions[this.transactions.indexOf(trxWithId)] = trx;
    } else {
      this.transactions.push(trx);
    }
  }

  existingTransaction(address: string) {
    return this.transactions.find(trx => trx.input.address === address);
  }
}

export default TransactionPool;
