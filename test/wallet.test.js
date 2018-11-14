/**
 * @global describe, it, beforeEach
 */
const Wallet = require("../dist/components/wallet").default;
const Blockchain = require("../dist/components/blockchain").default;
const config = require("../dist/config").default;
const TransactionPool = require("../dist/components/wallet/transaction-pool")
  .default;
const expect = require("chai").expect;

describe("Wallet", () => {
  let wallet, tp, bc;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  it("create", () => {
    expect(wallet).haveOwnProperty("balance");
  });

  describe("creating a transaction", () => {
    let trx, sendAmount, recipient;
    beforeEach(() => {
      sendAmount = 50;
      recipient = "some address";
      trx = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe("and doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tp);
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

  describe("calculating a balance", () => {
    let addBalance, repeatAdd, senderWallet;

    beforeEach(async () => {
      senderWallet = new Wallet();
      addBalance = 100;
      repeatAdd = 3;
      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
      }
      await bc.addBlock(tp.transactions);
    });

    it("calculates the balance for the receipient", () => {
      expect(wallet.calculateBalance(bc)).eq(
        config.initial_balance + addBalance * repeatAdd
      );
    });

    it("calculates the balance for the sender", () => {
      expect(senderWallet.calculateBalance(bc)).eq(
        config.initial_balance - addBalance * repeatAdd
      );
    });
  });
});
