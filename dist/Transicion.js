"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transicion = void 0;
const Estado_1 = require("./Estado");
class Transicion {
    constructor(simboloInf, SimboloSupOredoDestino, edoDestino) {
        this.simboloInf = simboloInf;
        if (typeof SimboloSupOredoDestino === 'string' && edoDestino instanceof Estado_1.Estado) {
            this.simboloSup = SimboloSupOredoDestino;
            this.edoDestino = edoDestino;
        }
        else if (typeof SimboloSupOredoDestino === 'string' && edoDestino === undefined) {
            this.simboloSup = simboloInf;
            this.edoDestino = undefined;
        }
        else if (SimboloSupOredoDestino instanceof Estado_1.Estado) {
            this.simboloSup = simboloInf;
            this.edoDestino = SimboloSupOredoDestino;
        }
        else if (SimboloSupOredoDestino === undefined && edoDestino === undefined) {
            this.simboloSup = simboloInf;
        }
        else {
            throw new Error("Argumentos inválidos");
        }
    }
    setTransicion(s1, s2, e) {
        if (s2 === undefined && e instanceof Estado_1.Estado) {
            this.simboloInf = s1;
            this.simboloSup = s1;
            this.edoDestino = e;
        }
        else if (typeof s2 === 'string' && e instanceof Estado_1.Estado) {
            this.simboloInf = s1;
            this.simboloSup = s2;
            this.edoDestino = e;
        }
        else {
            throw new Error("Argumentos inválidos");
        }
    }
    // Getters y Setters
    getSimboloInf() { return this.simboloInf; }
    getSimboloSup() { return this.simboloSup; }
    getEdoTrans(s) {
        if (this.simboloInf <= s && s <= this.simboloSup) {
            return this.edoDestino;
        }
        return undefined;
    }
}
exports.Transicion = Transicion;
