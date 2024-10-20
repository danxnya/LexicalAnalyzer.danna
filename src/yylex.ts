import { SimbolosEspeciales } from './SimbolosEspeciales';
import { Stack } from './Stack';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const tablaAFD = JSON.parse(fs.readFileSync(path.join(__dirname, 'afd.json'), 'utf-8'));

let CadenaSigma: string = "";  // Inicializa la cadena sigma como una cadena vacía
let PasoPorEdoAcept: boolean = false;
let IniLexema: number = 0;
let FinLexema: number = -1;
let IndiceCaracterActual: number = 0;
let token: number = -1;
const Pila: Stack<number> = new Stack<number>();  // Instancia de la pila para manejar estados

let ultimolexema: string = "";  // Inicializa el último lexema

// Implementación de SetSigma
function SetSigma(sigma: string): void {
    CadenaSigma = sigma;               // Asigna la cadena a procesar
    PasoPorEdoAcept = false;           // Inicializa PasoPorEdoAcept a false
    IniLexema = 0;                     // El índice inicial del lexema es 0
    FinLexema = -1;                    // No se ha definido aún un final para el lexema
    IndiceCaracterActual = 0;          // Se empieza desde el primer carácter de la cadena
    token = -1;                        // No se ha encontrado ningún token todavía
    Pila.clear();                      // Limpia la pila
    ultimolexema = "";                 // Inicializa el último lexema
}

// Función principal yylex que procesa la cadena
function yylex(): number | string {
    const pila = new Stack<number>();  // Instancia de la pila para almacenar posiciones
    let lexema = "";
    const indicesDeCaracteres: number[] = [];  // Almacena los índices de caracteres procesados

    // Recorremos la cadena mientras haya caracteres por analizar
    while (true) {
        pila.push(IndiceCaracterActual);  // Guardamos el índice actual en la pila
        indicesDeCaracteres.push(IndiceCaracterActual);  // También guardamos el índice en el array

        if (IndiceCaracterActual >= CadenaSigma.length) {
            lexema = "FIN";  // Asignamos el lexema "FIN"
            ultimolexema = lexema;
            return SimbolosEspeciales.FIN;  // Si alcanzamos el final de la cadena
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
                continue;  // Continuamos con la siguiente transición
            }

            break;  // Si no hay transición válida, rompemos el ciclo
        }

        // Si no se encontró una transición aceptable
        if (!PasoPorEdoAcept) {
            IndiceCaracterActual = IniLexema + 1;
            lexema = CadenaSigma.substring(IniLexema, IniLexema + 1);
            token = SimbolosEspeciales.TOKENERROR;
            ultimolexema = lexema;
            return token;  // Devolvemos un error si no hay estado de aceptación
        }
        else {
            // Si hubo una transición aceptable, construimos el lexema
            lexema = CadenaSigma.substring(IniLexema, FinLexema + 1);
            IndiceCaracterActual = FinLexema + 1;
            ultimolexema = lexema;
            // Si el token es de tipo OMITIR, continuamos analizando la cadena
            if (token === SimbolosEspeciales.OMITIR) 
                continue;
            else 
                return token;  // Retornamos el token identificado
        }
    }
}

// Función para leer un archivo y procesarlo línea por línea con yylex
function LineaPorLinea(filename: string): void {
    const filePath = path.join(__dirname, filename);

    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false,
    });

    rl.on('line', (line: string) => {
        SetSigma(line);  // Procesar cada línea
        let result;
        do {
            result = yylex();
            console.log(`${ultimolexema},${result}`);  // Imprimir lexema y token separados por coma
        } while (result !== SimbolosEspeciales.FIN);
    });

    rl.on('close', () => { // Evento que se dispara cuando se termina de leer el archivo
        console.log('\nFin de archivo');
    });
}

// Ejemplo de uso: procesa un archivo llamado 'test.txt' línea por línea
LineaPorLinea('../dump/test.txt');

export { yylex, SetSigma, LineaPorLinea };

