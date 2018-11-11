/**
 * @global describe, it, beforeEach
 */

const Blockchain = require("../src/components/blockchain");
const Block = require("../src/components/block");
const expect = require("chai").expect;

describe("Blockchain", () => {
    let bc, bc2;

    beforeEach(() => {
        bc = new Blockchain()
        bc2 = new Blockchain()
    });

    it('add block', () => {
        const block = bc.addBlock('data 1');
        expect(block).to.be.instanceOf(Block);
        expect(bc.chain).length(2);
    });

    it('validate genesis block', () => {
        bc2.addBlock('bc2');
        expect(bc.isValidChain(bc2.chain)).eq(true);
    });

    it('invalid genesis block', () => {
        bc2.chain[0].data = 'changed data';
        bc2.addBlock('bc2');
        expect(bc.isValidChain(bc2.chain)).eq(false);
    });

    it('invalid hash block', () => {
        const block = bc2.addBlock('bc2');
        block.lastHash = 'changed hash';
        bc2.addBlock('bc3');
        expect(bc.isValidChain(bc2.chain)).eq(false);
    });

    it('replace chain success', () => {
        bc.addBlock('1');
        bc.addBlock('2');
        bc2.replaceChain(bc.chain);
        expect(bc2.chain).eq(bc.chain);
    });

    it('replace shorter chain', () => {
        bc.addBlock('1');
        bc.addBlock('2');
        bc.replaceChain(bc2.chain);
        expect(bc2.chain).not.eq(bc.chain);
    });
});