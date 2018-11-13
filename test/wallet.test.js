/**
 * @global describe, it, beforeEach
 */
const Wallet = require("../dist/components/wallet").default;
const TransactionPool = require("../dist/components/wallet/transaction-pool")
  .default;
const expect = require("chai").expect;

describe("Wallet", () => {
  let wallet, tp;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  it("create", () => {
    expect(wallet).haveOwnProperty("balance");
  });

  describe("creating a transaction", () => {
    let trx, sendAmount, recipient;
    beforeEach(() => {
      sendAmount = 50;
      recipient = "some address";
      trx = wallet.createTransaction(recipient, sendAmount, tp);
    });

    describe("and doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      it("soubles the sendAmount substracted from the wallet balance", () => {
        expect(
          trx.outputs.find(output => output.address === wallet.publicKey).amount
        ).eq(wallet.balance - sendAmount * 2);
      });

      it("clones the sendAmount output for the recipient", () => {
        expect(
          trx.outputs
            .filter(output => output.address === recipient)
            .map(output => output.amount)
        ).members([sendAmount, sendAmount]);
      });
    });
  });
});
