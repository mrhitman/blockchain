/**
 * @global describe, it, beforeEach
 */
const expect = require("chai").expect;
const TransactionPool = require("../dist/components/wallet/transaction-pool").default;
const Transaction = require("../dist/components/wallet/transaction").default;
const Wallet = require("../dist/components/wallet").default;

describe("Transaction pool", () => {
  let tp, wallet, trx;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    trx = Transaction.newTransaction(wallet, "address", 30);
    tp.updateOrAddTransaction(trx);
  });

  it("trx added", () => {
    expect(tp.transactions.find(t => t.id === trx.id)).eq(trx);
  });

  it("update trx in pool", () => {
    const oldTrx = JSON.stringify(trx);
    const newTrx = trx.update(wallet, "new address", 10);
    tp.updateOrAddTransaction(trx);

    expect(
      JSON.stringify(tp.transactions.find(t => t.id === newTrx.id))
    ).not.eq(oldTrx);
  });
});
