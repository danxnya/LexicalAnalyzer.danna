import { AnalizadorLexico } from "./AnalizadorLexico";

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

const AL = new AnalizadorLexico();

enum TOKEN {
    PLUS = 10,
    MINUS = 20,
    PROD = 30,
    DIV = 40,
    LPAREN = 50,
    RPAREN = 60,
    SPACE = 70,
    NUM = 80,
    END = 0,
}

// Funcion para la regla E
function E(): boolean {
    console.log("Regla E: Ejecutando T()");
    if (T()) {
        console.log("Regla E: T() es verdadero, ejecutando Ep()");
        return Ep();
    }
    console.log("Regla E: T() es falso");
    return false;
}

// Funcion para la regla E'
function Ep(): boolean {
    const token = AL.yylex();
    console.log(`Regla E': Token recibido: ${token}`);
    if (token === TOKEN.PLUS) {
        console.log("Regla E': Token es '+', ejecutando T() y luego Ep()");
        if (T()) {
            return Ep();
        }
        return false;
    } else if (token === TOKEN.MINUS) {
        console.log("Regla E': Token es '-', ejecutando T() y luego Ep()");
        if (T()) {
            return Ep();
        }
        return false;
    }
    console.log("Regla E': No es '+' ni '-', se devuelve el token");
    AL.undoToken();  // Devuelve el token si no corresponde a la regla actual
    return true;
}

// Funcion para la regla T
function T(): boolean {
    console.log("Regla T: Ejecutando F()");
    if (F()) {
        console.log("Regla T: F() es verdadero, ejecutando Tp()");
        return Tp();
    }
    console.log("Regla T: F() es falso");
    return false;
}

// Funcion para la regla Tp
function Tp(): boolean {
    const token = AL.yylex();
    console.log(`Regla Tp: Token recibido: ${token}`);
    if (token === TOKEN.PROD) {
        console.log("Regla Tp: Token es '*', ejecutando F() y luego Tp()");
        if (F()) {
            return Tp();
        }
        return false;
    } else if (token === TOKEN.DIV) {
        console.log("Regla Tp: Token es '/', ejecutando F() y luego Tp()");
        if (F()) {
            return Tp();
        }
        return false;
    }
    console.log("Regla Tp: No es '*' ni '/', se devuelve el token");
    AL.undoToken();  // Devuelve el token si no corresponde a la regla actual
    return true;
}

// Funcion para la regla F
function F(): boolean {
    const token = AL.yylex();
    console.log(`Regla F: Token recibido: ${token}`);
    if (token === TOKEN.LPAREN) {
        console.log("Regla F: Token es '(', ejecutando E()");
        if (E()) {
            console.log("Regla F: E() es verdadero, buscando ')'");
            return AL.yylex() === TOKEN.RPAREN;
        }
        console.log("Regla F: E() es falso");
        return false;
    } else if (token === TOKEN.NUM) {
        console.log("Regla F: Token es 'num'");
        return true;
    }
    console.log("Regla F: Token no es '(' ni 'num', devolviendo token");
    AL.undoToken();  // Devuelve el token si no es un número o paréntesis
    return false;
}

function parse(input: string): boolean {
    console.log(`Parseando la entrada: "${input}"`);
    AL.SetSigma(input);
    return E() && AL.yylex() === TOKEN.END;
}

function runTests() {
    const testCases = [
        "2+3",
        "(2 + 3) * 4",
        "2 + 3 * 4 / 2 - 1",
        "2 + (3 * 4)",
        "2 + 3 * (4 + 5)",
        "2 +",  // Invalida
        "2 * (3 + 4))",  // Invalida
        "(2 + 3",  // Invalida
    ];

    for (const test of testCases) {
        console.log(`\x1b[31mcadena a Validar: "${test}"\x1b[0m`);
        console.log(`\x1b[31mCadena: ${parse(test) ? "Valida" : "Invalida"}\x1b[0m`);
        console.log("\n\n");
    }
}

runTests();