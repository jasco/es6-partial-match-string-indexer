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

    /**
     * Return all links from leaves under this node
     */
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
        this.text.push(word);
        word += this.delim;  // ensures no implicit and a leaf always remain a leaf
        for (let ii = 0; ii < word.length; ++ii) {
            this.root = this._insert(this.root, word.slice(ii), index);
        }
    }

    /**
     * Recursively walk tree removing nodes if possible
     * @term - search string
     * @index - source word index in wordlist
     * @node - current node
     * returns true if node can be removed
     */
    _remove(term, index, node) {
        if (term.length === 0) {
            if (node.links) {
                const linkIndex = node.links.indexOf(index);
                if (linkIndex > -1) {
                    node.links = node.links.slice(0, linkIndex).concat(node.links.slice(linkIndex + 1));
                    this.text = this.text.slice(0, index).concat(this.text.slice(index + 1));
                }
                return (node.links.length === 0);
            } else {
                return false;
            }
        } else {
            const next = node.transition[term[0]];
            if (next) {
                const childRemoved = this._remove(term.slice(1), index, next);
                if (childRemoved) {
                    delete node.transition[term[0]];
                    return (Object.keys(node.transition).length === 0);
                }
            } else {
                return false;
            }
        }
    }

    remove(word) {
        const index = this.text.indexOf(word);
        word += this.delim;
        for (let ii = 0; ii < word.length; ++ii) {
            this._remove(word.slice(ii), index, this.root);
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

        return [...new Set(links)].reduce((acc, wordIndex) => {
            return acc.concat(this.text[wordIndex]);
        }, []);
    }
}

