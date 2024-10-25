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
let acumulador = 0;
// Funcion para la regla E, que maneja la suma y resta
function E(resultado) {
    //console.log("Regla E: Ejecutando T()");
    const temp = { val: 0 };
    if (T(temp)) {
        resultado.val = temp.val; // Guardamos el valor de T
        //console.log("Regla E: T() es verdadero, ejecutando Ep()");
        return Ep(resultado);
    }
    //console.log("Regla E: T() es falso");
    return false;
}
// Funcion para la regla E', que maneja las operaciones de + y -
function Ep(resultado) {
    const token = AL.yylex();
    //console.log(`Regla E': Token recibido: ${token}`);
    const temp = { val: 0 };
    if (token === TOKEN.PLUS) {
        //console.log("Regla E': Token es '+', ejecutando T() y luego Ep()");
        if (T(temp)) {
            resultado.val += temp.val; // Acumula el valor
            return Ep(resultado);
        }
        return false;
    }
    else if (token === TOKEN.MINUS) {
        //console.log("Regla E': Token es '-', ejecutando T() y luego Ep()");
        if (T(temp)) {
            resultado.val -= temp.val; // Resta el valor
            return Ep(resultado);
        }
        return false;
    }
    //console.log("Regla E': No es '+' ni '-', se devuelve el token");
    AL.undoToken(); // Devuelve el token si no corresponde a la regla actual
    return true;
}
// Funcion para la regla T, que maneja la multiplicación y división
function T(resultado) {
    //console.log("Regla T: Ejecutando F()");
    const temp = { val: 0 };
    if (F(temp)) {
        resultado.val = temp.val; // Guardamos el valor de F
        //console.log("Regla T: F() es verdadero, ejecutando Tp()");
        return Tp(resultado);
    }
    //console.log("Regla T: F() es falso");
    return false;
}
// Funcion para la regla Tp, que maneja * y /
function Tp(resultado) {
    const token = AL.yylex();
    //console.log(`Regla Tp: Token recibido: ${token}`);
    const temp = { val: 0 };
    if (token === TOKEN.PROD) {
        //console.log("Regla Tp: Token es '*', ejecutando F() y luego Tp()");
        if (F(temp)) {
            resultado.val *= temp.val; // Multiplica el valor
            return Tp(resultado);
        }
        return false;
    }
    else if (token === TOKEN.DIV) {
        //console.log("Regla Tp: Token es '/', ejecutando F() y luego Tp()");
        if (F(temp)) {
            resultado.val /= temp.val; // Divide el valor
            return Tp(resultado);
        }
        return false;
    }
    //console.log("Regla Tp: No es '*' ni '/', se devuelve el token");
    AL.undoToken(); // Devuelve el token si no corresponde a la regla actual
    return true;
}
// Funcion para la regla F, que maneja los números y paréntesis
function F(resultado) {
    const token = AL.yylex();
    //console.log(`Regla F: Token recibido: ${token}`);
    if (token === TOKEN.LPAREN) {
        //console.log("Regla F: Token es '(', ejecutando E()");
        if (E(resultado)) {
            //console.log("Regla F: E() es verdadero, buscando ')'");
            return AL.yylex() === TOKEN.RPAREN;
        }
        //console.log("Regla F: E() es falso");
        return false;
    }
    else if (token === TOKEN.NUM) {
        resultado.val = parseFloat(AL.getLexema()); // Convertimos el token a número
        //console.log(`Regla F: Token es 'num' con valor ${resultado.val}`);
        return true;
    }
    //console.log("Regla F: Token no es '(' ni 'num', devolviendo token");
    AL.undoToken(); // Devuelve el token si no es un número o paréntesis
    return false;
}
// Modificar la función parse para retornar el valor de la expresión
function parse(input) {
    //console.log(`Parseando la entrada: "${input}"`);
    AL.SetSigma(input);
    const resultado = { val: 0 };
    const valido = E(resultado) && AL.yylex() === TOKEN.END;
    return { valid: valido, value: resultado.val };
}
function runTests() {
    const testCases = [
        "2+3.1",
        "(2 + 3) * 4",
        //"2 + 3 * 4 / 2 - 1",
        //"2 + (3 * 4)",
        //"2 + 3 * (4 + 5)",
        //"2 +",  // Invalida
        //"2 * (3 + 4))",  // Invalida
        //"(2 + 3",  // Invalida
    ];
    for (const test of testCases) {
        console.log(`\x1b[31mcadena a Validar: "${test}"\x1b[0m`);
        const resultado = parse(test);
        if (resultado.valid) {
            console.log(`\x1b[31mCadena: Valida, Valor: ${resultado.value}\x1b[0m`);
        }
        else {
            console.log(`\x1b[31mCadena: Invalida\x1b[0m`);
        }
        console.log("\n\n");
    }
}
runTests();
