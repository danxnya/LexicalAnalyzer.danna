"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AFN_1 = require("../AFN");
const ER_1 = require("../ER");
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
    /*
    let Suma: AFN = new AFN().creaAFNBasico('+');
    let Resta: AFN = new AFN().creaAFNBasico('-');
    let Mult: AFN = new AFN().creaAFNBasico('*');
    let Div: AFN = new AFN().creaAFNBasico('/');
    let Pizq: AFN = new AFN().creaAFNBasico('(');
    let Pder: AFN = new AFN().creaAFNBasico(')');
    let NUM: AFN = new AFN().creaAFNBasico('0', '9').cerraduraPositiva().concatenacionAFN(new AFN().creaAFNBasico('.').concatenacionAFN(new AFN().creaAFNBasico('0', '9').cerraduraPositiva()).cerraduraOpcional());
    let space: AFN = new AFN().creaAFNBasico(' ').cerraduraPositiva();
    C.add(Suma);
    C.add(Resta);
    C.add(Mult);
    C.add(Div);
    C.add(Pizq);
    C.add(Pder);
    C.add(NUM);
    C.add(space);
    let NewRes: AFN = new AFN().UnirER(C);

    const AFD: Map<Number, Array<Number>> = NewRes.ToAFD();
    for (let i of AFD.keys()) {
        console.log(`Estado ${i}:`);
        for (let j = 0; j < AFD.get(i)!.length - 1; j++) {
            if (AFD.get(i)![j] === -1) continue;
            console.log(`\t <${String.fromCharCode(j)}> => ${AFD.get(i)![j]}`);
        }
        if (AFD.get(i)![256] === -1) continue;
        console.log(`\t TOKEN =>${AFD.get(i)![256]}`);
    }
    */
    let C = new Set();
    let testAFN = new AFN_1.AFN();
    let testER;
    C.add(new ER_1.ER('OR').generateAFN());
    C.add(new ER_1.ER('&').generateAFN());
    C.add(new ER_1.ER('\\+').generateAFN());
    C.add(new ER_1.ER('\\*').generateAFN());
    C.add(new ER_1.ER('\\?').generateAFN());
    C.add(new ER_1.ER('\\(').generateAFN());
    C.add(new ER_1.ER(' +').generateAFN());
    testAFN.creaAFNBasico(2);
    C.add(new ER_1.ER('\\)').generateAFN());
    C.add(new ER_1.ER('\\[').generateAFN());
    C.add(new ER_1.ER('\\]').generateAFN());
    C.add(new ER_1.ER('\\-').generateAFN());
    C.add(new ER_1.ER('([ -%]|\'|[,->]|[@-Z]|[^-■]|(\\.(&|[(-+]|\\?|[[-]])))').generateAFN());
    let NewRes = new AFN_1.AFN().UnirER(C);
    //NewRes.imprimirAFN()
    const AFD = NewRes.ToAFD();
    for (let i of AFD.keys()) {
        console.log(`Estado ${i}:`);
        for (let j = 0; j < AFD.get(i).length - 1; j++) {
            if (AFD.get(i)[j] === -1)
                continue;
            console.log(`\t <${String.fromCharCode(j)}> => ${AFD.get(i)[j]}`);
        }
        if (AFD.get(i)[256] === -1)
            continue;
        console.log(`\t TOKEN =>${AFD.get(i)[256]}`);
    }
}
main();
