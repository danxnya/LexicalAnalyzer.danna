"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalizadorLexico = void 0;
const SimbolosEspeciales_1 = require("./SimbolosEspeciales");
class AnalizadorLexico {
    constructor(afd, sigma) {
        this.EdoAceptacion = false;
        this.iniLexema = 0;
        this.finLexema = 0;
        this.lexema = '';
        this.sigma = sigma;
        this.afd = afd;
        this.caracterActual = 0;
        this.tamString = sigma.length;
        this.indicesDeCaracteres = [];
    }
    yylex() {
        this.indicesDeCaracteres.push(this.caracterActual);
        if (this.caracterActual >= this.sigma.length) {
            this.lexema = '';
            return SimbolosEspeciales_1.SimbolosEspeciales.FIN;
        }
        this.iniLexema = this.caracterActual;
        let estadoActual = 0;
        this.EdoAceptacion = false;
        this.finLexema = -1;
        let token = SimbolosEspeciales_1.SimbolosEspeciales.TOKENERROR;
        this.lexema = '';
        let ultimoPosicionEstadoDeAceptacionVisto = -1;
        while (this.caracterActual < this.sigma.length) {
            let transicion = parseInt(this.afd[estadoActual][this.sigma.charCodeAt(this.caracterActual)]);
            if (transicion >= 0) {
                estadoActual = transicion;
                this.caracterActual++;
                if (parseInt(this.afd[estadoActual][255]) >= 0) {
                    ultimoPosicionEstadoDeAceptacionVisto = this.caracterActual - 1;
                    this.EdoAceptacion = true;
                    token = parseInt(this.afd[estadoActual][255]);
                }
            }
            else {
                if (!this.EdoAceptacion) {
                    this.lexema = this.sigma.charAt(this.caracterActual) + '';
                    token = SimbolosEspeciales_1.SimbolosEspeciales.TOKENERROR;
                    this.caracterActual = this.iniLexema + 1;
                    estadoActual = 0;
                    return token;
                }
                else {
                    this.finLexema = ultimoPosicionEstadoDeAceptacionVisto;
                    this.lexema = this.sigma.substring(this.iniLexema, this.finLexema + 1);
                    this.caracterActual = this.finLexema + 1;
                    estadoActual = 0;
                    return token;
                }
            }
        }
        if (!this.EdoAceptacion) {
            this.lexema = this.sigma.charAt(this.caracterActual) + '';
            token = SimbolosEspeciales_1.SimbolosEspeciales.TOKENERROR;
            this.caracterActual = this.iniLexema + 1;
            estadoActual = 0;
            return token;
        }
        else {
            this.finLexema = ultimoPosicionEstadoDeAceptacionVisto;
            this.lexema = this.sigma.substring(this.iniLexema, this.finLexema + 1);
            this.caracterActual = this.finLexema + 1;
            estadoActual = 0;
            return token;
        }
    }
    getLexema() {
        return this.lexema;
    }
    undoToken() {
        if (this.indicesDeCaracteres.length === 0)
            return false;
        this.caracterActual = this.indicesDeCaracteres.pop();
        return true;
    }
    printIndices() {
        this.indicesDeCaracteres.forEach(i => {
            console.log(i);
        });
    }
}
exports.AnalizadorLexico = AnalizadorLexico;
