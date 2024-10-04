"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AFN_1 = require("./AFN");
class Si {
    constructor(i = 0, S = new Set()) {
        this.i = i;
        this.S = S;
        this.Transiciones = {};
    }
}
// Función IndiceCaracter para obtener el índice del carácter en el alfabeto
function IndiceCaracter(alfabeto, c) {
    return alfabeto.indexOf(c);
}
// Implementación de la función EstadosSi
function EstadosSi() {
    const afn = new AFN_1.AFN();
    let i, j, r;
    let existe;
    let Sj, Sk;
    const ArrAlfabeto = [...afn.alfabeto]; // Suponemos que el alfabeto está disponible en AFN
    // Conjunto de estados procesados y cola de estados por procesar
    const C = new Set(); // EdosAFD
    const colaEdoSjSinAnalizar = [];
    // Inicializamos el contador de estados
    j = 0;
    // Cerradura epsilon del estado inicial
    Sj = new Si(j, afn.cerraduraEpsilon(afn.edoIni)); // Cerradura epsilon del estado inicial
    C.add(Sj); // Añadimos el estado inicial al conjunto C
    colaEdoSjSinAnalizar.push(Sj); // Añadimos el estado inicial a la cola de análisis
    j++;
    // Proceso principal
    while (colaEdoSjSinAnalizar.length > 0) {
        // Sacamos el primer estado de la cola
        Sj = colaEdoSjSinAnalizar.shift(); // Dequeue
        // Recorremos cada símbolo del alfabeto
        for (const c of ArrAlfabeto) {
            Sk = new Si(); // Creamos un nuevo estado Sk
            Sk.S = afn.IrAConjunto(Sj.S, c); // Calculamos IrA para el conjunto de estados con el símbolo c
            if (Sk.S.size === 0) {
                continue; // Si el conjunto está vacío, seguimos con el siguiente símbolo
            }
            existe = false;
            // Verificamos si el estado Sk ya existe en C
            for (const I of C) {
                if (I.S.size === Sk.S.size && compararConjuntos(I.S, Sk.S)) {
                    existe = true;
                    r = IndiceCaracter(ArrAlfabeto, c); // Obtenemos el índice del carácter
                    Sj.Transiciones[c] = I.i; // Asignamos la transición desde Sj a I usando el símbolo c
                    break;
                }
            }
            // Si no existe, lo añadimos a C y a la cola
            if (!existe) {
                Sk.i = j;
                r = IndiceCaracter(ArrAlfabeto, c); // Obtenemos el índice del carácter
                Sj.Transiciones[c] = Sk.i; // Asignamos la transición desde Sj a Sk
                C.add(Sk); // Añadimos el nuevo estado a C
                colaEdoSjSinAnalizar.push(Sk); // Lo añadimos a la cola para seguir procesando
                j++;
            }
        }
    }
    // Aquí puedes construir el AFD a partir del conjunto C si es necesario
    //return new AFD(C);
}
// Función para comparar conjuntos de estados (ya la tienes, pero la incluyo para contexto)
function compararConjuntos(set1, set2) {
    if (set1.size !== set2.size) {
        return false;
    }
    // Calculamos la diferencia simétrica
    const diferenciaSimetrica = new Set([...set1].filter(x => !set2.has(x)).concat([...set2].filter(x => !set1.has(x))));
    // Si la diferencia simétrica está vacía, los conjuntos son iguales
    return diferenciaSimetrica.size === 0; // Retorna true si los conjuntos son iguales
}
