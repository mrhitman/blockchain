/**
 * @global describe, it, beforeEach
 */
const Transacton = require("../dist/components/wallet/transaction").default;
const Wallet = require("../dist/components/wallet").default;
const expect = require("chai").expect;

describe("Transaction", () => {
  let trx, wallet, recipient, amount;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = "some recpient address";
    trx = Transacton.newTransaction(wallet, recipient, amount);
  });

  it("outputs the amount subrstracted from the wallet balance", () => {
    expect(
      trx.outputs.find(output => output.address === wallet.publicKey).amount
    ).eq(wallet.balance - amount);
  });

  it("outputs the amount added to recipient", () => {
    expect(trx.outputs.find(output => output.address === recipient).amount).eq(
      amount
    );
  });

  it("transaction amount exceed the balance", () => {
    trx = Transacton.newTransaction(wallet, recipient, 4000);
    expect(trx).undefined;
  });

  it("inputs the balance of the wallet", () => {
    expect(trx.input.amount).eq(wallet.balance);
  });

  it("validate a valid transaction", () => {
    expect(trx.verifyTransaction()).true;
  });

  it("invalidate a corrupt transaction", () => {
    trx.outputs[0].amount = 40000;
    expect(trx.verifyTransaction()).false;
  });

  describe("Update", () => {
    let nextAmount = 20;
    let nextRecipient = "new recipient";

    beforeEach(() => {
      trx = trx.update(wallet, nextRecipient, nextAmount);
    });

    it("substracts the next amont from the sender's output", () => {
      expect(
        trx.outputs.find(output => output.address === wallet.publicKey).amount
      ).eq(wallet.balance - amount - nextAmount);
    });

    it("outputs an amount for the next recipient", () => {
      expect(
        trx.outputs.find(output => output.address === nextRecipient).amount
      ).eq(nextAmount);
    });
  });
});
