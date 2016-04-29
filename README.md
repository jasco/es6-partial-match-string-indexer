# Indexed Partial Match String Lookup

Index for exact, partial match searching of wordlist.  The entire word is
returned for each partial match.

## Overview

This is implemented using a naive suffix tree implementation.  Performance might be
improved using a compressed compressed trie or the Ukkonen algorithm.  Perhaps in a
subsequent implementation the implementation can be improved.

To easily support finding multiple matches, each leaf node contains a list of
indices for complete matches on that subtree branch.

Specifically, each branch node contains a `transitions` map which maps the next
character to the next node.  Each searchable term is stored in a list and indexed
in the trie with a unique word-ending delimiter.  The delimiter is associated with
each leaf node.  The searchable term's list position is referenced in the leaf node
in a `links` list.


## Installation

    npm install
    npm test   # or npm run test:cov


Javascript es6 is used. To produce es5 output:

    npm run compile

## Usage Example

    var Indexer = require('./src/partial-match-indexer.transpiled.js').PartialMatchIndexer;
    var index = new Indexer();
    index.add('hello');
    index.add('jello');
    index.add('plum');
    index.search('ll');

Results:

    [ "hello", "jello" ]


## Additional thoughts

The Ukkonen algorithm is a linear time, online algorithm for constructing
suffix tries. It is tuned for efficiently growing a suffix trie on an expanding
single body of text.  When used to index a series of search terms the commonly
shown techniques append the search terms into a single text body separated with
a word delimiter.  However, since the suffix of interest never extends beyond
the word itself, there seems to be an impediance mismatch between the algorithm
and this application.

In addition, it was not immediately clear how to walk the Ukkonen trie to find
all matches rather than just the first match when a suffix was repeated.  Also
the Ukkonen trie identified the specific location of the substring which then
took extra effort to locate the containing word.


## References

* https://github.com/fabsrc/es6-ukkonen-suffix-tree
