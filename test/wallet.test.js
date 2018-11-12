/**
 * @global describe, it, beforeEach
 */
const Wallet = require("../src/components/wallet");
const expect = require("chai").expect;

describe("Wallet", () => {
  it("create", () => {
    const wallet = new Wallet();
    expect(wallet).haveOwnProperty("balance");
  });

});
