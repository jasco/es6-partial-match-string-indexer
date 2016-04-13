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
            trie.search('y').should.deep.equal(['boy', 'yellow']);
        });

        it('should match embedded patterns', () => {
            trie.search('ll').should.deep.equal(['hello', 'jello', 'yellow']);
        });

        it('should match varied matches', () => {
            trie.search('o').should.deep.equal([ 'hello', 'jello', 'yellow', 'mushroom', 'mushroom', 'coat', 'boy' ]);
        });

        it('should match full words', () => {
            trie.search('a').should.deep.equal(['a', 'coat']);
        });

        it('should return empty results if the pattern does not exist', () => {
            trie.search('qwerty').should.deep.equal([]);
        });
    });
});
