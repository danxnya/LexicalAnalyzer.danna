import { Estado } from './Estado';
import { Transicion } from './Transicion';
import { SimbolosEspeciales } from './SimbolosEspeciales';


class AFN {
    static contIdAFN: number = 0;
    edoIni: Estado | null;
    edosAFN: Set<Estado> = new Set();
    edosAcept: Set<Estado> = new Set();
    alfabeto: Set<string> = new Set();
    idAFN: number;

    constructor() {
        this.idAFN = AFN.contIdAFN++;
        this.edoIni = null;
        // No es necesario limpiar los sets, ya que están vacíos.
    }

    creaAFNBasico(s: number): AFN;
    creaAFNBasico(s: string): AFN;
    creaAFNBasico(s: string, s2: string): AFN;
    creaAFNBasico(s: any, s2?: string): AFN {
        let t: Transicion;
        let s1: string = (typeof s === 'number' && typeof s2 === undefined) ? String.fromCharCode(s) : s;
        let e1: Estado, e2: Estado;
        e1 = new Estado();
        e2 = new Estado()
        t = new Transicion(s1, s2, e2);
        // Set es una interfaz, por lo que no se puede asignar directamente
        e1.SetTrans = new Set([t]);
        e2.SetEdoAcept = true;
        this.edoIni = e1;
        if (s2 === 'string')
            for (let i = s2.charCodeAt(0); i <= s1.charCodeAt(0); i++)
                this.alfabeto.add(String.fromCharCode(i));
        else
            this.alfabeto.add(s1);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);
        this.edosAcept.add(e2);
        return this;
    }

    unirAFN(f2: AFN): AFN {
        let e1 = new Estado();
        let e2 = new Estado();
        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, this.edoIni!)]);

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, f2.edoIni!)]);

        // for (let e of this.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }

        this.edosAcept.forEach(e => {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetEdoAcept = false;
        });


        // for (let e of f2.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }

        f2.edosAcept.forEach(e => {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetEdoAcept = false;
        });

        this.edosAcept.clear();
        f2.edosAcept.clear();
        this.edoIni = e1;
        e2.SetEdoAcept = true;
        this.edosAcept.add(e2);
        this.edosAFN = new Set([...this.edosAFN, ...f2.edosAFN, e1, e2]);
        this.alfabeto = new Set([...this.alfabeto, ...f2.alfabeto]);

        return this;
    }

    concatenacionAFN(f2: AFN): AFN {
        for (let t of f2.edoIni!.GetTrans) {
            for (let e of this.edosAcept) {
                e.SetTrans = new Set([t]);
                e.SetEdoAcept = false;
            }
        }
        f2.edosAFN.delete(f2.edoIni!);
        this.edosAcept = f2.edosAcept;
        this.edosAFN = new Set([...this.edosAFN, ...f2.edosAFN]);
        this.alfabeto = new Set([...this.alfabeto, ...f2.alfabeto]);
        return this;
    }

    cerraduraPositiva(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, this.edoIni!)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);
        return this;
    }

    cerraduraKleene(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, this.edoIni!)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);

        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);
        return this;
    }

    cerraduraOpcional(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);

        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);
        return this;
    }


    cerraduraEpsilon(e: Estado): Set<Estado> {
        let conjunto: Set<Estado> = new Set();
        let stackDeEstados: Estado[] = [e];

        conjunto.add(e);

        while (stackDeEstados.length > 0) {
            let aux = stackDeEstados.pop()!;
            for (let t of aux.GetTrans) {
                let destino = t.getEdoTrans(SimbolosEspeciales.EPSILON);
                if (destino && !conjunto.has(destino)) {
                    conjunto.add(destino);
                    stackDeEstados.push(destino);
                }
            }
        }

        return conjunto;
    }



    cerraduraEpsilonConjunto(C: Set<Estado>): Set<Estado> {
        let R: Set<Estado> = new Set();
        // Definimos una pila de estados llamada P
        let P: Estado[] = [];
        let aux: Estado;
        for (let e of C) {
            R = new Set([...R, ...this.cerraduraEpsilon(e)]);
        }
        return R;
    }


    moverA(e: Estado, item: string): Set<Estado> {
        let R: Set<Estado> = new Set();
        for (let t of e.GetTrans) {
            let destino = t.getEdoTrans(item);
            if (destino) {
                R.add(destino);
            }
        }
        return R; // Donde R es el conjunto de estados de salida
    }


    moverAConjunto(C: Set<Estado>, item: string): Set<Estado> {
        let R: Set<Estado> = new Set();
        for (let e of C) {
            R = new Set([...R, ...this.moverA(e, item)]); // Union de conjuntos
        }
        return R;
    }


    IrA(e: Estado, simb: string): Set<Estado> {
        return this.cerraduraEpsilonConjunto(this.moverA(e, simb));
    }
    IrAConjunto(C: Set<Estado>, simb: string): Set<Estado> {
        let R: Set<Estado> = new Set();
        R = this.cerraduraEpsilonConjunto(this.moverAConjunto(C, simb));
        return R;
    }

}


export { AFN };
