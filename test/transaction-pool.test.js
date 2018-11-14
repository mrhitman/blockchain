/**
 * @global describe, it, beforeEach
 */
const expect = require("chai").expect;
const TransactionPool = require("../dist/components/wallet/transaction-pool").default;
const Wallet = require("../dist/components/wallet").default;

describe("Transaction pool", () => {
  let tp, wallet, trx;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    trx = wallet.createTransaction("address", 30, tp);
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

  it("clears transactions", () => {
    tp.clear();
    expect(tp.transactions).length(0);
  });

  describe("mixin valid and corrupt transactions", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        trx = wallet.createTransaction(`some another address`, 30, tp);
        if (i % 2 === 0) {
          trx.input.amount = 1e6;
        } else {
          validTransactions.push(trx);
        }
      }
    });

    it("shows a difference between valid and corrupt transactions", () => {
      expect(JSON.stringify(tp.transactions)).not.eq(
        JSON.stringify(validTransactions)
      );
    });

    it("grabs valid transactions", () => {
      expect(tp.validTransactions()).members(validTransactions);
    });
  });
});
