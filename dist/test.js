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
    //Crear AFN de un simbolo
    let C = new Set();
    let Suma = new AFN_1.AFN().creaAFNBasico('+');
    let Resta = new AFN_1.AFN().creaAFNBasico('-');
    let Mult = new AFN_1.AFN().creaAFNBasico('*');
    let Div = new AFN_1.AFN().creaAFNBasico('/');
    let Pizq = new AFN_1.AFN().creaAFNBasico('(');
    let Pder = new AFN_1.AFN().creaAFNBasico(')');
    let NUM = new AFN_1.AFN().creaAFNBasico('0', '9').cerraduraPositiva().concatenacionAFN(new AFN_1.AFN().creaAFNBasico('.').concatenacionAFN(new AFN_1.AFN().creaAFNBasico('0', '9').cerraduraPositiva()).cerraduraOpcional());
    let space = new AFN_1.AFN().creaAFNBasico(' ').cerraduraPositiva();
    C.add(Suma);
    C.add(Resta);
    C.add(Mult);
    C.add(Div);
    C.add(Pizq);
    C.add(Pder);
    C.add(NUM);
    C.add(space);
    let NewRes = new AFN_1.AFN().UnirER(C);
    const AFD = NewRes.ToAFD();
    for (let i of AFD.keys()) {
        console.log(`Estado ${i}:`);
        for (let j = 0; j < AFD.get(i).length - 1; j++) {
            if (AFD.get(i)[j] === -1)
                continue;
            console.log(`\t <${String.fromCharCode(j)}> =>${AFD.get(i)[j]}`);
        }
        if (AFD.get(i)[256] === -1)
            continue;
        console.log(`\t TOKEN =>${AFD.get(i)[256]}`);
    }
}
main();
