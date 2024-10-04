"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transicion = void 0;
const Estado_1 = require("./Estado");
class Transicion {
    // Por limitaciones de TypeScript, se debe usar un constructor con parámetros opcionales
    // En lugar de la sobrecarga de métodos de C#    
    constructor(simboloInf, simboloSup, edoDestino) {
        if (simboloSup === undefined && edoDestino instanceof Estado_1.Estado) { // instanceof es para verificar si edoDestino es una instancia de Estado
            this.simboloInf = simboloInf;
            this.simboloSup = simboloInf; // Ambos símbolos son iguales
            this.edoDestino = edoDestino;
        }
        // Si se pasan dos símbolos y un estado, se asignan los valores normalmente
        else if (typeof simboloSup === 'string' && edoDestino instanceof Estado_1.Estado) {
            this.simboloInf = simboloInf;
            this.simboloSup = simboloSup;
            this.edoDestino = edoDestino;
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
        return null;
    }
}
exports.Transicion = Transicion;
