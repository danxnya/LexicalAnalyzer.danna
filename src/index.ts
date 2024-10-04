import { AFN } from './AFN';

function main() {
    console.log("TEST");


    let afnA = new AFN();
    afnA = afnA.creaAFNBasico('a');

    let afnB = new AFN();
    afnB = afnB.creaAFNBasico('b');

    let afnC = new AFN();
    afnC = afnC.creaAFNBasico('c');

    // Para crear (a or b) and c
    afnA.unirAFN(afnB);
    afnA.concatenacionAFN(afnC);


    // afnA.unirAFN(afnB); // Revisar: Posible estado extra en la union

    // afnA.concatenacionAFN(afnB); // Parece estar bien

    // afnA.cerraduraPositiva(); // Parece estar bien

    // afnA.cerraduraKleene(); // Parece estar bien

    // afnA.cerraduraOpcional(); // Parece estar bien

    //afnA.cerraduraEpsilon(afnA.edoIni!); // PENDIENTE DE REVISAR(Deberia estar bien); Consideramos que edoIni no es nulo xd

    afnA.moverA(afnA.edoIni!, 'a'); // PENDIENTE DE REVISAR

    afnA.IrA(afnA.edoIni!, 'a'); // PENDIENTE DE REVISAR
}   

main();
