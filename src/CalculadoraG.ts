import { AnalizadorLexico } from "./AnalizadorLexico";
import * as fs from 'fs';

/*
Definimos las funciones booleanas para la gramatica de operaciones aritmeticas

E => TE'
E' => +TE' | -TE' | ε
T => FT'
T' => *FT' | /FT' | ε
F => (E) | num
*/

// Token asignado a cada simbolo
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

const AL = new AnalizadorLexico();

type Nodo = { name: string, children?: Nodo[] };

// Funciones para la gramática
function E(resultado: { val: number }): { val: boolean, tree: Nodo } {
    const temp = { val: 0 };
    const tree: Nodo = { name: "E", children: [] };

    const tResult = T(temp);
    if (tResult.val) {
        resultado.val = temp.val;
        tree.children?.push(tResult.tree);
        const epResult = Ep(resultado);
        if (epResult.val) {
            tree.children?.push(epResult.tree);
        }
        return { val: true, tree: tree };
    }
    return { val: false, tree: tree };
}

function Ep(resultado: { val: number }): { val: boolean, tree: Nodo } {
    const token = AL.yylex();
    const tree: Nodo = { name: "E'", children: [] };
    const temp = { val: 0 };

    if (token === TOKEN.PLUS || token === TOKEN.MINUS) {
        const tResult = T(temp);
        if (tResult.val) {
            resultado.val += (token === TOKEN.PLUS ? temp.val : -temp.val);
            tree.children?.push({ name: token === TOKEN.PLUS ? "+" : "-" }, tResult.tree);
            const epResult = Ep(resultado);
            if (epResult.val) {
                tree.children?.push(epResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    return { val: true, tree: tree };
}

function T(resultado: { val: number }): { val: boolean, tree: Nodo } {
    const temp = { val: 0 };
    const tree: Nodo = { name: "T", children: [] };

    const fResult = F(temp);
    if (fResult.val) {
        resultado.val = temp.val;
        tree.children?.push(fResult.tree);
        const tpResult = Tp(resultado);
        if (tpResult.val) {
            tree.children?.push(tpResult.tree);
        }
        return { val: true, tree: tree };
    }
    return { val: false, tree: tree };
}

function Tp(resultado: { val: number }): { val: boolean, tree: Nodo } {
    const token = AL.yylex();
    const tree: Nodo = { name: "T'", children: [] };
    const temp = { val: 0 };

    if (token === TOKEN.PROD || token === TOKEN.DIV) {
        const fResult = F(temp);
        if (fResult.val) {
            resultado.val = token === TOKEN.PROD ? resultado.val * temp.val : resultado.val / temp.val;
            tree.children?.push({ name: token === TOKEN.PROD ? "*" : "/" }, fResult.tree);
            const tpResult = Tp(resultado);
            if (tpResult.val) {
                tree.children?.push(tpResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    return { val: true, tree: tree };
}

function F(resultado: { val: number }): { val: boolean, tree: Nodo } {
    const token = AL.yylex();
    const tree: Nodo = { name: "F", children: [] };

    if (token === TOKEN.LPAREN) {
        const eResult = E(resultado);
        if (eResult.val && AL.yylex() === TOKEN.RPAREN) {
            tree.children?.push({ name: "(" }, eResult.tree, { name: ")" });
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    } else if (token === TOKEN.NUM) {
        resultado.val = parseFloat(AL.getLexema());
        tree.children?.push({ name: "num", children: [{ name: `${resultado.val}` }] });
        return { val: true, tree: tree };
    }
    AL.undoToken();
    return { val: false, tree: tree };
}

// Guardar el árbol y el resultado en un archivo JSON
// Guardar el árbol y el resultado en un archivo JSON
function guardarArbolConResultado(tree: Nodo, resultado: number, nombreArchivo: string) {
    const nuevoArbol = { tree, resultado };
    let data = [];

    // Verificar si el archivo ya contiene datos
    if (fs.existsSync(nombreArchivo)) {
        const contenidoActual = fs.readFileSync(nombreArchivo, 'utf-8');
        try {
            const parsedData = JSON.parse(contenidoActual);
            data = Array.isArray(parsedData) ? parsedData : []; // Asegura que `data` sea un arreglo
        } catch (error) {
            console.warn(`Advertencia: contenido inválido en ${nombreArchivo}. Inicializando como arreglo vacío.`);
            data = [];
        }
    }

    // Agregar el nuevo árbol al arreglo de datos
    data.push(nuevoArbol);
    fs.writeFileSync(nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Árbol y resultado guardados en ${nombreArchivo}`);
}


// Parseo que incluye la generación de árbol y resultado
function parse(input: string): { valid: boolean, tree: Nodo, resultado: number } {
    AL.SetSigma(input);
    const resultado = { val: 0 };
    const eResult = E(resultado);

    if (eResult.val && AL.yylex() === TOKEN.END) {
        guardarArbolConResultado(eResult.tree, resultado.val, './dump/tree.json');
        return { valid: true, tree: eResult.tree, resultado: resultado.val };
    }
    return { valid: false, tree: { name: "Error" }, resultado: 0 };
}

// Pruebas y generación del archivo JSON con árbol y resultado
function runTests() {
    const testCases = [
        //"2+3.1",
        //"(2 + 3) * 4",
        //"736587287387/732856*(1)"
        //"2 + 3 * 4",
        "((2 + 3) * 4 - 2) / 2",
    ];

    for (const test of testCases) {
        console.log(`Cadena a Validar: "${test}"`);
        const resultado = parse(test);
        if (resultado.valid) {
            console.log(`Cadena: Válida, Resultado: ${resultado.resultado}. Árbol guardado en JSON.`);
        } else {
            console.log("Cadena: Inválida");
        }
    }
}

runTests();
