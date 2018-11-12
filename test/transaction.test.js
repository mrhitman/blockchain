/**
 * @global describe, it, beforeEach
 */
const Transacton = require("../src/components/wallet/transaction");
const Wallet = require("../src/components/wallet");
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
    const trx = Transacton.newTransaction(wallet, recipient, 4000);
    expect(trx).undefined;
  });
});
