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
exports.yylex = yylex;
exports.SetSigma = SetSigma;
exports.LineaPorLinea = LineaPorLinea;
const SimbolosEspeciales_1 = require("./SimbolosEspeciales");
const Stack_1 = require("./Stack");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
const tablaAFD = JSON.parse(fs.readFileSync(path.join(__dirname, 'afd.json'), 'utf-8'));
let CadenaSigma = ""; // Inicializa la cadena sigma como una cadena vacía
let PasoPorEdoAcept = false;
let IniLexema = 0;
let FinLexema = -1;
let IndiceCaracterActual = 0;
let token = -1;
const Pila = new Stack_1.Stack(); // Instancia de la pila para manejar estados
let ultimolexema = ""; // Inicializa el último lexema
// Implementación de SetSigma
function SetSigma(sigma) {
    CadenaSigma = sigma; // Asigna la cadena a procesar
    PasoPorEdoAcept = false; // Inicializa PasoPorEdoAcept a false
    IniLexema = 0; // El índice inicial del lexema es 0
    FinLexema = -1; // No se ha definido aún un final para el lexema
    IndiceCaracterActual = 0; // Se empieza desde el primer carácter de la cadena
    token = -1; // No se ha encontrado ningún token todavía
    Pila.clear(); // Limpia la pila
    ultimolexema = ""; // Inicializa el último lexema
}
// Función principal yylex que procesa la cadena
function yylex() {
    const pila = new Stack_1.Stack(); // Instancia de la pila para almacenar posiciones
    let lexema = "";
    const indicesDeCaracteres = []; // Almacena los índices de caracteres procesados
    // Recorremos la cadena mientras haya caracteres por analizar
    while (true) {
        pila.push(IndiceCaracterActual); // Guardamos el índice actual en la pila
        indicesDeCaracteres.push(IndiceCaracterActual); // También guardamos el índice en el array
        if (IndiceCaracterActual >= CadenaSigma.length) {
            lexema = "FIN"; // Asignamos el lexema "FIN"
            ultimolexema = lexema;
            return SimbolosEspeciales_1.SimbolosEspeciales.FIN; // Si alcanzamos el final de la cadena
        }
        IniLexema = IndiceCaracterActual;
        let edoActual = 0;
        PasoPorEdoAcept = false;
        FinLexema = -1;
        token = -1;
        // Procesamos cada carácter de la cadena Sigma
        while (IndiceCaracterActual < CadenaSigma.length) {
            const caracterActual = CadenaSigma.charCodeAt(IndiceCaracterActual);
            // Obtener la transición actual a partir del autómata finito determinista (AFD)
            const edoTransicion = tablaAFD[edoActual][caracterActual];
            if (edoTransicion !== undefined && edoTransicion !== -1) {
                // Verificamos si el estado actual es de aceptación
                if (tablaAFD[edoTransicion][256] !== undefined && tablaAFD[edoTransicion][256] !== -1) {
                    PasoPorEdoAcept = true;
                    token = tablaAFD[edoTransicion][256];
                    FinLexema = IndiceCaracterActual;
                }
                IndiceCaracterActual++;
                edoActual = edoTransicion;
                continue; // Continuamos con la siguiente transición
            }
            break; // Si no hay transición válida, rompemos el ciclo
        }
        // Si no se encontró una transición aceptable
        if (!PasoPorEdoAcept) {
            IndiceCaracterActual = IniLexema + 1;
            lexema = CadenaSigma.substring(IniLexema, IniLexema + 1);
            token = SimbolosEspeciales_1.SimbolosEspeciales.TOKENERROR;
            ultimolexema = lexema;
            return token; // Devolvemos un error si no hay estado de aceptación
        }
        else {
            // Si hubo una transición aceptable, construimos el lexema
            lexema = CadenaSigma.substring(IniLexema, FinLexema + 1);
            IndiceCaracterActual = FinLexema + 1;
            ultimolexema = lexema;
            // Si el token es de tipo OMITIR, continuamos analizando la cadena
            if (token === SimbolosEspeciales_1.SimbolosEspeciales.OMITIR)
                continue;
            else
                return token; // Retornamos el token identificado
        }
    }
}
// Función para leer un archivo y procesarlo línea por línea con yylex
function LineaPorLinea(filename) {
    const filePath = path.join(__dirname, filename);
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false,
    });
    rl.on('line', (line) => {
        SetSigma(line); // Procesar cada línea
        let result;
        do {
            result = yylex();
            console.log(`${ultimolexema},${result}`); // Imprimir lexema y token separados por coma
        } while (result !== SimbolosEspeciales_1.SimbolosEspeciales.FIN);
    });
    rl.on('close', () => {
        console.log('\nFin de archivo');
    });
}
// Ejemplo de uso: procesa un archivo llamado 'test.txt' línea por línea
LineaPorLinea('../dump/test.txt');
