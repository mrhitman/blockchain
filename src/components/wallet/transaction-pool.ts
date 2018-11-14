import Transaction from "./transaction";

class TransactionPool {
  public transactions: Array<Transaction> = [];

  updateOrAddTransaction(trx: Transaction) {
    let trxWithId = this.transactions.find(t => t.id === trx.id);

    if (trxWithId) {
      this.transactions[this.transactions.indexOf(trxWithId)] = trx;
    } else {
      this.transactions.push(trx);
    }
  }

  existingTransaction(address: string) {
    return this.transactions.find(trx => trx.input.address === address);
  }

  validTransactions() {
    return this.transactions.filter(trx => {
      const outputTotal = trx.outputs.reduce((total, output) => total + output.amount, 0);

      if (trx.input.amount !== outputTotal) {
        console.log(`Invalid trx from ${trx.input.address}`);
        return false;
      }

      if (!trx.verifyTransaction()) {
        console.log(`Invalid trx signature from ${trx.input.address}`);
        return false;
      }

      return true;
    });
  }

  clear() {
    this.transactions = [];
  }
}

export default TransactionPool;
