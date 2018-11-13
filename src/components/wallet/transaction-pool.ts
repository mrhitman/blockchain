import Transaction from "./transaction";

class TransactionPool {
  public transactions: Array<Transaction> = [];

  updateOrAddTransaction(transaction: Transaction) {
    let trxWithId = this.transactions.find(trx => trx.id === transaction.id);

    if (trxWithId) {
      this.transactions[this.transactions.indexOf(trxWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address: string) {
    return this.transactions.find(trx => trx.input.address === address);
  }
}

export default TransactionPool;
