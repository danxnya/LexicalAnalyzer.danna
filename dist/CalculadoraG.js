"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnalizadorLexico_1 = require("./AnalizadorLexico");
/*
Definimos las funciones booleanas para la gramatica de operaciones aritmeticas

E => TE'
E' => +TE' | -TE' | ε
T => FT'
T' => *FT' | /FT' | ε
F => (E) | num

Token asignado a cada simbolo:
    +       -> 10
    -       -> 20
    *       -> 30
    /       -> 40
    (       -> 50
    )       -> 60
    space   -> 70
    num     -> 80
    end     -> 0 ó ascii 0
*/
const AL = new AnalizadorLexico_1.AnalizadorLexico();
var TOKEN;
(function (TOKEN) {
    TOKEN[TOKEN["PLUS"] = 10] = "PLUS";
    TOKEN[TOKEN["MINUS"] = 20] = "MINUS";
    TOKEN[TOKEN["PROD"] = 30] = "PROD";
    TOKEN[TOKEN["DIV"] = 40] = "DIV";
    TOKEN[TOKEN["LPAREN"] = 50] = "LPAREN";
    TOKEN[TOKEN["RPAREN"] = 60] = "RPAREN";
    TOKEN[TOKEN["SPACE"] = 70] = "SPACE";
    TOKEN[TOKEN["NUM"] = 80] = "NUM";
    TOKEN[TOKEN["END"] = 0] = "END";
})(TOKEN || (TOKEN = {}));
// Funcion para la regla E
function E() {
    console.log("Regla E: Ejecutando T()");
    const tValue = T(); // Calculamos el valor de T
    if (tValue !== null) {
        console.log("Regla E: T() es válido, ejecutando Ep()");
        return Ep(tValue); // Pasamos el valor de T a Ep()
    }
    console.log("Regla E: T() es inválido");
    return null;
}
// Funcion para la regla Ep
function Ep(leftValue) {
    const token = AL.yylex();
    console.log(`Regla Ep: Token recibido: ${token}`);
    if (token === TOKEN.PLUS) {
        console.log("Regla Ep: Token es '+', ejecutando T() y luego Ep()");
        const tValue = T(); // Calculamos el valor de T
        if (tValue !== null) {
            return Ep(leftValue + tValue); // Sumamos el resultado y seguimos con Ep()
        }
        return null;
    }
    else if (token === TOKEN.MINUS) {
        console.log("Regla Ep: Token es '-', ejecutando T() y luego Ep()");
        const tValue = T();
        if (tValue !== null) {
            return Ep(leftValue - tValue); // Restamos el resultado y seguimos con Ep()
        }
        return null;
    }
    console.log("Regla Ep: No es '+' ni '-', se devuelve el token");
    AL.undoToken();
    return leftValue; // Epsilon: Retornamos el valor acumulado
}
// Funcion para la regla T
function T() {
    console.log("Regla T: Ejecutando F()");
    const fValue = F(); // Calculamos el valor de F
    if (fValue !== null) {
        console.log("Regla T: F() es válido, ejecutando Tp()");
        return Tp(fValue); // Pasamos el valor de F a Tp()
    }
    console.log("Regla T: F() es inválido");
    return null;
}
// Funcion para la regla T'
function Tp(leftValue) {
    const token = AL.yylex();
    console.log(`Regla Tp: Token recibido: ${token}`);
    if (token === TOKEN.PROD) {
        console.log("Regla Tp: Token es '*', ejecutando F() y luego Tp()");
        const fValue = F();
        if (fValue !== null) {
            return Tp(leftValue * fValue); // Multiplicamos el resultado y seguimos con Tp()
        }
        return null;
    }
    else if (token === TOKEN.DIV) {
        console.log("Regla Tp: Token es '/', ejecutando F() y luego Tp()");
        const fValue = F();
        if (fValue !== null) {
            return Tp(leftValue / fValue); // Dividimos el resultado y seguimos con Tp()
        }
        return null;
    }
    console.log("Regla Tp: No es '*' ni '/', se devuelve el token");
    AL.undoToken();
    return leftValue; // Epsilon: Retornamos el valor acumulado
}
// Funcion para la regla F
function F() {
    const token = AL.yylex();
    console.log(`Regla F: Token recibido: ${token}`);
    if (token === TOKEN.LPAREN) {
        console.log("Regla F: Token es '(', ejecutando E()");
        const eValue = E();
        if (eValue !== null && AL.yylex() === TOKEN.RPAREN) {
            console.log("Regla F: E() es válido y se encontró ')'");
            return eValue;
        }
        console.log("Regla F: E() es inválido o no se encontró ')'");
        return null;
    }
    else if (token === TOKEN.NUM) {
        console.log(`Regla F: Token es 'num' (${AL.getLexema()})`);
        return parseFloat(AL.getLexema()); // Convertimos el número de la cadena a entero
    }
    console.log("Regla F: Token no es '(' ni 'num', devolviendo token");
    AL.undoToken();
    return null;
}
// Funcion parse para procesar la cadena
function parse(input) {
    console.log(`Parseando la entrada: "${input}"`);
    AL.SetSigma(input);
    const result = E();
    if (result !== null && AL.yylex() === TOKEN.END) {
        return result;
    }
    return null;
}
// Pruebas
function runTests() {
    const testCases = [
        " 2+   32.120",
        "4-2",
        "3*5",
        "10/   2",
        "( 2 + 3 )*4",
        "2+(3* 4)/2- 1"
    ];
    for (const test of testCases) {
        console.log(`Test: "\x1b[1;31m${test}\x1b[0m"`);
        const result = parse(test);
        console.log(`Resultado: \x1b[1;31m${result !== null ? result : "Invalido"}\x1b[0m`);
        console.log("\n\n");
    }
}
runTests();
