"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AFN_1 = require("./AFN");
function main() {
    console.log("TEST");
    let afnA = new AFN_1.AFN();
    afnA = afnA.creaAFNBasico('a');
    let afnB = new AFN_1.AFN();
    afnB = afnB.creaAFNBasico('b');
    let afnC = new AFN_1.AFN();
    afnC = afnC.creaAFNBasico('c');
    // // Para crear (a or b) and c
    // afnA.unirAFN(afnB);
    // afnA.concatenacionAFN(afnC);
    // // Para (a or b) or c
    // afnA.unirAFN(afnB);
    // afnA.unirAFN(afnC);
    // afnA.unirAFN(afnB); // ya al puro pedo :)
    // afnA.concatenacionAFN(afnB); // Parece estar bien
    // afnA.cerraduraPositiva(); // Parece estar bien
    // afnA.cerraduraKleene(); // Parece estar bien
    // afnA.cerraduraOpcional(); // Parece estar bien
    //afnA.cerraduraEpsilon(afnA.edoIni!); // PENDIENTE DE REVISAR(Deberia estar bien); Consideramos que edoIni no es nulo xd
    // afnA.moverA(afnA.edoIni!, 'a'); // PENDIENTE DE REVISAR
    // afnA.IrA(afnA.edoIni!, 'a'); // PENDIENTE DE REVISAR
}
main();
