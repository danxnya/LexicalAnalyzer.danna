"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalizadorLexico = void 0;
const SimbolosEspeciales_1 = require("./SimbolosEspeciales");
const Stack_1 = require("./tools/Stack");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
class AnalizadorLexico {
    constructor(filename, sigma) {
        this.CadenaSigma = "";
        this.PasoPorEdoAcept = false;
        this.IniLexema = 0;
        this.FinLexema = -1;
        this.IndiceCaracterActual = 0;
        this.token = -1;
        this.Pila = new Stack_1.Stack(); // Pila para almacenar los índices
        this.ultimolexema = "";
        if (sigma === undefined)
            this.SetSigma("");
        else
            this.SetSigma(sigma);
        this.setTablaAFD(filename);
    }
    setTablaAFD(filename) {
        this.SetSigma(this.CadenaSigma);
        this.tablaAFD = JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf-8'));
    }
    // Implementación de SetSigma
    SetSigma(sigma) {
        this.CadenaSigma = sigma;
        this.PasoPorEdoAcept = false;
        this.IniLexema = 0;
        this.FinLexema = -1;
        this.IndiceCaracterActual = 0;
        this.token = -1;
        this.Pila.clear(); // Limpia la pila cuando se establece una nueva cadena
        this.ultimolexema = "";
    }
    // Función principal yylex que procesa la cadena
    yylex() {
        let lexema = "";
        this.Pila.push(this.IndiceCaracterActual); // Guarda el índice actual en la pila
        if (this.IndiceCaracterActual >= this.CadenaSigma.length) {
            lexema = "FIN";
            this.ultimolexema = lexema;
            return SimbolosEspeciales_1.SimbolosEspeciales.FIN;
        }
        this.IniLexema = this.IndiceCaracterActual;
        let edoActual = 0;
        this.PasoPorEdoAcept = false;
        this.FinLexema = -1;
        this.token = -1;
        while (this.IndiceCaracterActual < this.CadenaSigma.length) {
            const caracterActual = this.CadenaSigma.charCodeAt(this.IndiceCaracterActual);
            const edoTransicion = this.tablaAFD[edoActual][caracterActual];
            if (edoTransicion !== undefined && edoTransicion !== -1) {
                if (this.tablaAFD[edoTransicion][256] !== undefined && this.tablaAFD[edoTransicion][256] !== -1) {
                    this.PasoPorEdoAcept = true;
                    this.token = this.tablaAFD[edoTransicion][256];
                    this.FinLexema = this.IndiceCaracterActual;
                }
                this.IndiceCaracterActual++;
                edoActual = edoTransicion;
                continue;
            }
            break;
        }
        if (!this.PasoPorEdoAcept) {
            this.IndiceCaracterActual = this.IniLexema + 1;
            lexema = this.CadenaSigma.substring(this.IniLexema, this.IniLexema + 1);
            this.token = SimbolosEspeciales_1.SimbolosEspeciales.TOKENERROR;
            this.ultimolexema = lexema;
            return this.token;
        }
        else {
            lexema = this.CadenaSigma.substring(this.IniLexema, this.FinLexema + 1);
            this.IndiceCaracterActual = this.FinLexema + 1;
            this.ultimolexema = lexema;
            if (this.token === SimbolosEspeciales_1.SimbolosEspeciales.OMITIR)
                return this.yylex(); // Salta los tokens omitidos
            else
                return this.token;
        }
    }
    getLexema() {
        return this.ultimolexema;
    }
    // Implementación de undoToken
    undoToken() {
        if (this.Pila.size() > 0) {
            const ultimoIndice = this.Pila.pop(); // Restaura el índice del último token leído
            if (ultimoIndice !== undefined) {
                this.IndiceCaracterActual = ultimoIndice; // Restablecemos la posición
                return true;
            }
        }
        return false;
    }
    // Función para leer un archivo y procesarlo línea por línea con yylex
    LineaPorLinea(filename) {
        const filePath = path.join(__dirname, filename);
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false,
        });
        rl.on('line', (line) => {
            this.SetSigma(line);
            let result;
            do {
                result = this.yylex();
                console.log(`${this.ultimolexema},${result}`);
            } while (result !== SimbolosEspeciales_1.SimbolosEspeciales.FIN);
        });
        rl.on('close', () => {
            // console.log('Fin de archivo');
        });
    }
}
exports.AnalizadorLexico = AnalizadorLexico;
function test() {
    let sigma = "A OR B & C";
    const analizador = new AnalizadorLexico("afd.json", sigma);
    console.log("::::::::::::::::::::::::Test 1::::::::::::::::::::::::\n\t" + sigma);
    let token = analizador.yylex();
    let result = "{ ";
    while (token !== SimbolosEspeciales_1.SimbolosEspeciales.FIN) {
        if (typeof token === 'number')
            result += String(token) + ", ";
        else if (typeof token === 'string') {
            result += token + ",  ";
        }
        token = analizador.yylex();
    }
    result += String(token) + " }";
    console.log(result);
    //////////////////////////////////////////
    sigma = "([0-9]+)&(.&([0-9]+))*";
    analizador.SetSigma(sigma);
    console.log("::::::::::::::::::::::::Test 2::::::::::::::::::::::::\n\t" + sigma);
    token = analizador.yylex();
    result = "{ ";
    while (token !== SimbolosEspeciales_1.SimbolosEspeciales.FIN) {
        if (typeof token === 'number')
            result += String(token) + ", ";
        else if (typeof token === 'string') {
            result += token + ",  ";
        }
        token = analizador.yylex();
    }
    result += String(token) + " }";
    console.log(result);
    ///////////////////////////////////////////////
    sigma = "\\b\\c   \\a\\";
    analizador.SetSigma(sigma);
    console.log("::::::::::::::::::::::::Test 3::::::::::::::::::::::::\n\t" + sigma);
    token = analizador.yylex();
    result = "{ ";
    while (token !== SimbolosEspeciales_1.SimbolosEspeciales.FIN) {
        if (typeof token === 'number')
            result += String(token) + ", ";
        else if (typeof token === 'string') {
            result += token + ",  ";
        }
        token = analizador.yylex();
    }
    result += String(token) + " }";
    console.log(result);
    //analizador.LineaPorLinea('../dump/test.txt');*/
}
test();
