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
const AnalizadorLexico_1 = require("./AnalizadorLexico");
const fs = __importStar(require("fs"));
/*
Definimos las funciones booleanas para la gramatica de operaciones aritmeticas

E => TE'
E' => +TE' | -TE' | ε
T => FT'
T' => *FT' | /FT' | ε
F => (E) | num
*/
// Token asignado a cada simbolo
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
const AL = new AnalizadorLexico_1.AnalizadorLexico();
// Funciones para la gramática
function E(resultado) {
    var _a, _b;
    const temp = { val: 0 };
    const tree = { name: "E", children: [] };
    const tResult = T(temp);
    if (tResult.val) {
        resultado.val = temp.val;
        (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push(tResult.tree);
        const epResult = Ep(resultado);
        if (epResult.val) {
            (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push(epResult.tree);
        }
        return { val: true, tree: tree };
    }
    return { val: false, tree: tree };
}
function Ep(resultado) {
    var _a, _b;
    const token = AL.yylex();
    const tree = { name: "E'", children: [] };
    const temp = { val: 0 };
    if (token === TOKEN.PLUS || token === TOKEN.MINUS) {
        const tResult = T(temp);
        if (tResult.val) {
            resultado.val += (token === TOKEN.PLUS ? temp.val : -temp.val);
            (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push({ name: token === TOKEN.PLUS ? "+" : "-" }, tResult.tree);
            const epResult = Ep(resultado);
            if (epResult.val) {
                (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push(epResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    return { val: true, tree: tree };
}
function T(resultado) {
    var _a, _b;
    const temp = { val: 0 };
    const tree = { name: "T", children: [] };
    const fResult = F(temp);
    if (fResult.val) {
        resultado.val = temp.val;
        (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push(fResult.tree);
        const tpResult = Tp(resultado);
        if (tpResult.val) {
            (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push(tpResult.tree);
        }
        return { val: true, tree: tree };
    }
    return { val: false, tree: tree };
}
function Tp(resultado) {
    var _a, _b;
    const token = AL.yylex();
    const tree = { name: "T'", children: [] };
    const temp = { val: 0 };
    if (token === TOKEN.PROD || token === TOKEN.DIV) {
        const fResult = F(temp);
        if (fResult.val) {
            resultado.val = token === TOKEN.PROD ? resultado.val * temp.val : resultado.val / temp.val;
            (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push({ name: token === TOKEN.PROD ? "*" : "/" }, fResult.tree);
            const tpResult = Tp(resultado);
            if (tpResult.val) {
                (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push(tpResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    return { val: true, tree: tree };
}
function F(resultado) {
    var _a, _b;
    const token = AL.yylex();
    const tree = { name: "F", children: [] };
    if (token === TOKEN.LPAREN) {
        const eResult = E(resultado);
        if (eResult.val && AL.yylex() === TOKEN.RPAREN) {
            (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push({ name: "(" }, eResult.tree, { name: ")" });
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    else if (token === TOKEN.NUM) {
        resultado.val = parseFloat(AL.getLexema());
        (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push({ name: "num", children: [{ name: `${resultado.val}` }] });
        return { val: true, tree: tree };
    }
    AL.undoToken();
    return { val: false, tree: tree };
}
// Guardar el árbol y el resultado en un archivo JSON
// Guardar el árbol y el resultado en un archivo JSON
function guardarArbolConResultado(tree, resultado, nombreArchivo) {
    const nuevoArbol = { tree, resultado };
    let data = [];
    // Verificar si el archivo ya contiene datos
    if (fs.existsSync(nombreArchivo)) {
        const contenidoActual = fs.readFileSync(nombreArchivo, 'utf-8');
        try {
            const parsedData = JSON.parse(contenidoActual);
            data = Array.isArray(parsedData) ? parsedData : []; // Asegura que `data` sea un arreglo
        }
        catch (error) {
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
function parse(input) {
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
        }
        else {
            console.log("Cadena: Inválida");
        }
    }
}
runTests();
