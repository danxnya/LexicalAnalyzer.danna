import { AnalizadorLexico } from "./AnalizadorLexico";
import JSON from "@/ts/Calculadora.json"
//import * as fs from 'fs';

//! Colocar la ruta correcta del archivo AFD.json y cambiar nombre del archivo
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

const AL = new AnalizadorLexico(JSON);

type Nodo = { name: string, children?: Nodo[] }; // Variable de tipo Nodo para guardar el árbol

const data: Array<{ tree: Nodo, resultado: number }> = [];

function E(resultado: { val: number }): { val: boolean, tree: Nodo } { // Funcion con un acumulador de resultado, de tipo booleano para saber si la cadena es válida y un árbol de tipo Nodo
    const temp = { val: 0 };
    const tree: Nodo = { name: "E", children: [] }; // Nodo raíz del árbol

    const tResult = T(temp); // Llamamos a la función T con el acumulador de resultado
    if (tResult.val) { // Si la función T es válida
        resultado.val = temp.val;   // Asignamos el valor de la función T al acumulador de resultado
        tree.children?.push(tResult.tree); // Agregamos el nodo de la función T al árbol
        const epResult = Ep(resultado);
        if (epResult.val) { // Si la función E' es válida llamamos a la función E' con el acumulador de resultado
            tree.children?.push(epResult.tree);  // Agregamos el nodo de la función E' al árbol
        }
        return { val: true, tree: tree }; // Retornamos verdadero y el árbol, el valor del resultado se guarda en el acumulador como referencia
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
            // Invertir el orden de los nodos aquí
            tree.children?.push(tResult.tree, { name: token === TOKEN.PLUS ? "+" : "-" });
            const epResult = Ep(resultado);
            if (epResult.val) {
                tree.children?.push(epResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    tree.children?.push({ name: "ε" }); // Nodo explícito para epsilon
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
            // Invertir el orden de los nodos aquí
            tree.children?.push(fResult.tree, { name: token === TOKEN.PROD ? "*" : "/" });
            const tpResult = Tp(resultado);
            if (tpResult.val) {
                tree.children?.push(tpResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }
    AL.undoToken();
    tree.children?.push({ name: "ε" }); // Nodo o Estado especial definido para epsilon
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

function guardarArbolConResultado(tree: Nodo, resultado: number, nombreArchivo: string) {
    const nuevoArbol = { tree, resultado };
    data.push(nuevoArbol); // Agregar el nuevo árbol al arreglo en memoria

    //fs.writeFileSync(nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
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


function recorrerPostorden(nodo: Nodo): string {
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

/*function limpiarArchivo(nombreArchivo: string) {
    fs.writeFileSync(nombreArchivo, '', 'utf-8');
}*/

export function parseConPostfijo(input: string): { valid: boolean, postfijo: string, resultado: number } {
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
        } else {
            console.log("Cadena: Inválida");
        }
    }
}


//limpiarArchivo('./dump/tree.json');
runTestsConPostfijo();