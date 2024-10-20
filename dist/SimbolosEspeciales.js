"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimbolosEspeciales = void 0;
class SimbolosEspeciales {
}
exports.SimbolosEspeciales = SimbolosEspeciales;
// Definimos los símbolos especiales como constantes
SimbolosEspeciales.EPSILON = String.fromCharCode(5);
SimbolosEspeciales.FIN = 0;
//public static readonly FIN: string = String.fromCharCode(0);
SimbolosEspeciales.TOKENERROR = 9999;
// que OMITIR sea el valor ascii 32 (espacio)
SimbolosEspeciales.OMITIR = 70;
