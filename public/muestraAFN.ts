import { AFN } from '@/ts/AFN';

let originalCount = AFN.contIdAFN;  // Guarda el contador original

let C: Set<AFN> = new Set<AFN>();

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

let AFN1: AFN = new AFN().UnirER(C);

// Restaurar el contador para que AFN1 no afecte al global
AFN.contIdAFN = originalCount;

export default AFN1;