export class PartialMatchIndexer {
    constructor(size=0) {
        this.text = size? Array(size) : [];
        this.root = this._createNode();
        this.delim = '\xfe';
    }

    _createNode() {
        return {
            transition: {}
        };
    }

    _insert(node, str, index) {
        if (!str.length) {
            node.links = node.links || [];
            node.links.push(index);
            return node;
        }

        let l = str[0];
        let t = node.transition[l];

        if (!t) {
            t = this._createNode();
        }
        node.transition[l] = this._insert(t, str.slice(1), index);
        return node;
    }

    _harvest(node) {
        let result = node.links || [];
        for (let key of Object.keys(node.transition)) {
            result = result.concat(this._harvest(node.transition[key]));
        }
        return result;
    }

    addAll(wordlist) {
        for (let ii = 0; ii < wordlist.length; ++ii) {
            this.add(wordlist[ii]);
        }
    }

    add(word) {
        let index = this.text.length;
        this.text.push(word + this.delim);
        for (let ii = 0; ii < word.length; ++ii) {
            this.root = this._insert(this.root, word.slice(ii), index);
        }
    }

    print() {
        console.log(JSON.stringify(this.root));
    }

    search(term) {
        const descend = (node, substr) => {
            if (substr.length) {
                const next = node.transition[substr[0]];
                if (next) {
                    return descend(next, substr.slice(1));
                } else {
                    return [];
                }
            } else {
                // collect all links from leaf nodes
                return this._harvest(node);
            }

        }
        let links = descend(this.root, term);
        return links.reduce((acc, wordIndex) => {
            return acc.concat(this.text[wordIndex].slice(0, -1));
        }, []);
    }
}

