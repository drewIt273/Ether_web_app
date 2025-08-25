/**
 * Instance by DrewIt
 * 
 * nodecreator.js
 */

class nodeCreator {
    constructor(tn = "div") {
        this.node = document.createElement(tn)
    }

    child(tn = "div", attrs) {
        let n = document.createElement(tn);
        for (const a in attrs) {
            let v = String(attrs[a]);
            n.setAttribute(a, v)
        }
        this.node.appendChild(n)

        return this
    }
}

function createNode(tag = "div") {
    return new nodeCreator(tag)
}