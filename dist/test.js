"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AFN_1 = require("./AFN");
function main() {
    console.log("TEST");
    //let afnA = new AFN();
    //afnA = afnA.creaAFNBasico('a');
    //let afnB = new AFN();
    //afnB = afnB.creaAFNBasico('b');
    //let afnC = new AFN();
    //afnC = afnC.creaAFNBasico('c');
    // // Para crear (a or b) and c
    //afnA.unirAFN(afnB);
    //afnA.concatenacionAFN(afnC);
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
    let C = new Set();
    let Suma = new AFN_1.AFN();
    Suma = Suma.creaAFNBasico('+');
    Suma.imprimirAFN();
    let Resta = new AFN_1.AFN().creaAFNBasico('-');
    let Mult = new AFN_1.AFN().creaAFNBasico('*');
    let Div = new AFN_1.AFN().creaAFNBasico('/');
    let Pizq = new AFN_1.AFN().creaAFNBasico('(');
    let Pder = new AFN_1.AFN().creaAFNBasico(')');
    let Num1 = new AFN_1.AFN().creaAFNBasico('0', '9');
    Num1.cerraduraPositiva();
    let Num2 = new AFN_1.AFN().creaAFNBasico('0', '9');
    Num2.cerraduraPositiva();
    let punto = new AFN_1.AFN().creaAFNBasico('.');
    punto.concatenacionAFN(Num2);
    punto.cerraduraPositiva();
    Num1.concatenacionAFN(punto);
    let space = new AFN_1.AFN().creaAFNBasico(' ').cerraduraPositiva();
    C.add(Suma);
    C.add(Resta);
    C.add(Mult);
    C.add(Div);
    C.add(Pizq);
    C.add(Pder);
    C.add(Num1);
    C.add(space);
    let NewRes = new AFN_1.AFN().UnirER(C);
    NewRes.imprimirAFN();
}
main();
