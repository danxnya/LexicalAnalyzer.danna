"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Si = void 0;
class Si {
    constructor(i = 0, S = new Set()) {
        this.id = i;
        this.S = S;
    }
    Equals(obj) {
        if (this.S.size !== obj.S.size)
            return false;
        const inObj = new Set((this.S.size < obj.S.size) ?
            [...this.S].filter(x => !obj.S.has(x)) : [...obj.S].filter(x => !this.S.has(x)));
        return inObj.size === 0;
    }
}
exports.Si = Si;
