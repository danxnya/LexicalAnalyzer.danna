import { AFN } from './AFN';
import { Estado } from './Estado';

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
    let C: Set<AFN> = new Set<AFN>();
    let Suma: AFN = new AFN().creaAFNBasico('+');
    let Resta: AFN = new AFN().creaAFNBasico('-');
    let Mult: AFN = new AFN().creaAFNBasico('*');
    let Div: AFN = new AFN().creaAFNBasico('/');
    let Pizq: AFN = new AFN().creaAFNBasico('(');
    let Pder: AFN = new AFN().creaAFNBasico(')');
    let Num1: AFN = new AFN().creaAFNBasico('0', '9');
    Num1.cerraduraPositiva();
    let Num2: AFN = new AFN().creaAFNBasico('0', '9');
    Num2.cerraduraPositiva();
    let punto: AFN = new AFN().creaAFNBasico('.');
    punto.concatenacionAFN(Num2);
    punto.cerraduraPositiva();
    Num1.concatenacionAFN(punto);
    let space: AFN = new AFN().creaAFNBasico(' ').cerraduraPositiva();
    C.add(Suma);
    C.add(Resta);
    C.add(Mult);
    C.add(Div);
    C.add(Pizq);
    C.add(Pder);
    C.add(Num1);
    C.add(space);


    console.log("Llamada de UnirER para C"); 
    let NewRes: AFN = new AFN().UnirER(C);
    console.log(NewRes);
}

main();
