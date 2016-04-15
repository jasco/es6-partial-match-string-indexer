import { PartialMatchIndexer as Trie } from '../src/partial-match-indexer';

let chai = require('chai');
let path = require('path');

chai.should();


describe('Trie', () => {
    describe('partial match search', () => {
        let trie;

        beforeEach(() => {
            trie = new Trie();
            trie.addAll(['hello', 'jello', 'yellow', 'mushroom', 'coat', 'a', 'boy']);
            //trie.print();
        });

        it('should match prefix and suffix', () => {
            var e = ['boy', 'yellow'];
            var r = trie.search('y');
            r.should.have.members(e);
            r.length.should.equal(e.length);
        });

        it('should match embedded patterns', () => {
            var e = ['hello', 'jello', 'yellow'];
            var r = trie.search('ll');
            r.should.have.members(e);
            r.length.should.equal(e.length);
        });

        it('should match varied matches', () => {
            var e = [ 'hello', 'jello', 'yellow', 'mushroom', 'coat', 'boy' ];
            var r = trie.search('o');
            r.should.have.members(e);
            r.length.should.equal(e.length);
        });

        it('should match full words', () => {
            var e = ['a', 'coat']
            var r = trie.search('a');
            r.should.have.members(e);
            r.length.should.equal(e.length);
        });

        it('should return empty results if the pattern does not exist', () => {
            trie.search('qwerty').should.deep.equal([]);
        });

        it('should only return one hit even if the search term is repeated in the word', () => {
            let test = new Trie();
            test.add('tumdetumtum');
            let r = test.search('tum');
            r.length.should.equal(1);
        });
    });
    describe('test extended params', () => {
        it('accepts a preallocation size', () => {
            let trie = new Trie(10);
            trie.addAll(['hello', 'jello', 'yellow', 'mushroom', 'coat', 'a', 'boy']);

            // anyway to test more than acceptance of param apart from speed?
            trie.search('hello').should.deep.equal(['hello']);
        });
    });
    describe('test remove word', () => {
        it('should remove a word from the trie including unused branches', () => {
            let trieA = new Trie();
            let trieB = new Trie();
            trieA.add('abcdef');
            trieB.add('abcdef');
            trieB.add('uvwxyz');
            trieB.should.not.deep.equal(trieA);
            trieB.remove('uvwxyz');
            trieB.should.deep.equal(trieA);
        });
        it('should remove a word from the trie with some shared prefixes', () => {
            let trieA = new Trie();
            let trieB = new Trie();
            trieA.add('abcdef');
            trieB.add('abcdef');
            trieB.add('abcxyz');
            trieB.should.not.deep.equal(trieA);
            trieB.remove('abcxyz');
            trieB.should.deep.equal(trieA);
        });
        it('should remove a word from the trie with some shared suffixes', () => {
            let trieA = new Trie();
            let trieB = new Trie();
            trieA.add('abcdef');
            trieB.add('abcdef');
            trieB.add('xyzdef');
            trieB.should.not.deep.equal(trieA);
            trieB.remove('xyzdef');
            trieB.should.deep.equal(trieA);
        });
    });
});
