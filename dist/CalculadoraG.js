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
const data = [];
function E(resultado) {
    var _a, _b;
    const temp = { val: 0 };
    const tree = { name: "E", children: [] }; // Nodo raíz del árbol
    const tResult = T(temp); // Llamamos a la función T con el acumulador de resultado
    if (tResult.val) { // Si la función T es válida
        resultado.val = temp.val; // Asignamos el valor de la función T al acumulador de resultado
        (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push(tResult.tree); // Agregamos el nodo de la función T al árbol
        const epResult = Ep(resultado);
        if (epResult.val) { // Si la función E' es válida llamamos a la función E' con el acumulador de resultado
            (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push(epResult.tree); // Agregamos el nodo de la función E' al árbol
        }
        return { val: true, tree: tree }; // Retornamos verdadero y el árbol, el valor del resultado se guarda en el acumulador como referencia
    }
    return { val: false, tree: tree };
}
function Ep(resultado) {
    var _a, _b, _c;
    const token = AL.yylex();
    const tree = { name: "E'", children: [] };
    const temp = { val: 0 };
    if (token === TOKEN.PLUS || token === TOKEN.MINUS) {
        const tResult = T(temp);
        if (tResult.val) {
            resultado.val += (token === TOKEN.PLUS ? temp.val : -temp.val);
            // Invertir el orden de los nodos aquí
            (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push(tResult.tree, { name: token === TOKEN.PLUS ? "+" : "-" });
            const epResult = Ep(resultado);
            if (epResult.val) {
                (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push(epResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    (_c = tree.children) === null || _c === void 0 ? void 0 : _c.push({ name: "ε" }); // Nodo explícito para epsilon
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
    var _a, _b, _c;
    const token = AL.yylex();
    const tree = { name: "T'", children: [] };
    const temp = { val: 0 };
    if (token === TOKEN.PROD || token === TOKEN.DIV) {
        const fResult = F(temp);
        if (fResult.val) {
            resultado.val = token === TOKEN.PROD ? resultado.val * temp.val : resultado.val / temp.val;
            // Invertir el orden de los nodos aquí
            (_a = tree.children) === null || _a === void 0 ? void 0 : _a.push(fResult.tree, { name: token === TOKEN.PROD ? "*" : "/" });
            const tpResult = Tp(resultado);
            if (tpResult.val) {
                (_b = tree.children) === null || _b === void 0 ? void 0 : _b.push(tpResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    (_c = tree.children) === null || _c === void 0 ? void 0 : _c.push({ name: "ε" }); // Nodo o Estado especial definido para epsilon
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
function guardarArbolConResultado(tree, resultado, nombreArchivo) {
    const nuevoArbol = { tree, resultado };
    data.push(nuevoArbol); // Agregar el nuevo árbol al arreglo en memoria
    fs.writeFileSync(nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
    // console.log(`Árbol y resultado guardados en ${nombreArchivo}`);
}
// Funcion para sobre escribir el archivo con el árbol y resultado y no guardar varios árboles
/*
function guardarArbolConResultado(tree: Nodo, resultado: number, nombreArchivo: string) {
    const nuevoArbol = { tree, resultado };
    fs.writeFileSync(nombreArchivo, JSON.stringify([nuevoArbol], null, 2), 'utf-8');
    console.log(`Árbol y resultado guardados en ${nombreArchivo}`);
}
*/
function recorrerPostorden(nodo) {
    let resultado = "";
    // Si el nodo tiene hijos, los procesamos primero
    if (nodo.children) {
        for (const child of nodo.children) {
            resultado += recorrerPostorden(child) + " ";
        }
    }
    // Luego, procesamos el nodo actual si es un número u operador, excluyendo no terminales, epsilon y paréntesis
    if (nodo.name !== "E" && nodo.name !== "E'" && nodo.name !== "T" && nodo.name !== "T'" && nodo.name !== "F" && nodo.name !== "ε" && nodo.name !== "num" && nodo.name !== "(" && nodo.name !== ")") {
        resultado += nodo.name + " ";
    }
    return resultado.trim();
}
function limpiarArchivo(nombreArchivo) {
    fs.writeFileSync(nombreArchivo, '', 'utf-8');
}
function parseConPostfijo(input) {
    AL.SetSigma(input);
    const resultado = { val: 0 };
    const eResult = E(resultado);
    if (eResult.val && AL.yylex() === TOKEN.END) {
        const postfijo = recorrerPostorden(eResult.tree).trim();
        guardarArbolConResultado(eResult.tree, resultado.val, './dump/tree.json');
        return { valid: true, postfijo: postfijo, resultado: resultado.val };
    }
    return { valid: false, postfijo: "", resultado: 0 };
}
function runTestsConPostfijo() {
    const testCases = [
        "((1+2)*3)",
        "2+1",
    ];
    for (const test of testCases) {
        console.log(`Cadena: "${test}"`);
        const resultado = parseConPostfijo(test);
        if (resultado.valid) {
            console.log(`Cadena: Válida, Resultado: ${resultado.resultado}. Posfijo: ${resultado.postfijo}`);
        }
        else {
            console.log("Cadena: Inválida");
        }
    }
}
limpiarArchivo('./dump/tree.json');
runTestsConPostfijo();
