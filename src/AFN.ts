import { Estado } from './Estado';
import { Transicion } from './Transicion';
import { SimbolosEspeciales } from './SimbolosEspeciales';


class AFN {
    static contIdAFN: number = 0;
    edoIni?: Estado;
    edosAFN: Set<Estado> = new Set();
    edosAcept: Set<Estado> = new Set();
    alfabeto: Set<string> = new Set();
    idAFN: number;

    constructor() {
        this.idAFN = AFN.contIdAFN++;
        // No es necesario limpiar los sets, ya que están vacíos.
    }

    creaAFNBasico(s: number): AFN;//Refactorizar si hay tiempo para que sea más legible
    creaAFNBasico(s: string): AFN;
    creaAFNBasico(s: string, s2: string): AFN;
    creaAFNBasico(s: any, s2?: string): AFN {
        let t: Transicion;
        let s1: string = (typeof s === 'number' && typeof s2 === undefined) ? String.fromCharCode(s) : s;
        let e1: Estado, e2: Estado;
        e1 = new Estado();
        e2 = new Estado();
        if (typeof s2 === 'string') {
            t = new Transicion(s1, s2, e2);
        } else {
            t = new Transicion(s1, e2);
        }
        // Set es una interfaz, por lo que no se puede asignar directamente
        e1.SetTrans = new Set([t]);
        e2.SetEdoAcept = true;
        this.edoIni = e1;
        if (typeof s2 === 'string')
            for (let i = s2.charCodeAt(0); i <= s1.charCodeAt(0); i++)
                this.alfabeto.add(String.fromCharCode(i));
        else
            this.alfabeto.add(s1);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);
        this.edosAcept.add(e2);
        console.log(`\x1b[1m\x1b[31mAFN básico ${s}: OK\x1b[0m`);
        console.log(`Estado inicial: ${e1.GetIdEstado}`);
        console.log(`Estado de aceptación: ${e2.GetIdEstado}`);
        return this;
    }

    unirAFN(f2: AFN): AFN {
        let e1 = new Estado();
        let e2 = new Estado();
        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, f2.edoIni!)]);

        // for (let e of this.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }

        // Recorremos el set de estados de aceptación de this para agregar transiciones epsilon y cambiar el estado de aceptación
        this.edosAcept.forEach(e => {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, e2)]);
            e.SetEdoAcept = false;
        });


        // for (let e of f2.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }

        f2.edosAcept.forEach(e => {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, e2)]);
            e.SetEdoAcept = false;
        });

        this.edosAcept.clear();
        f2.edosAcept.clear();
        this.edoIni = e1;
        e2.SetEdoAcept = true;
        this.edosAcept.add(e2);
        this.edosAFN = new Set([...this.edosAFN, ...f2.edosAFN, e1, e2]);
        this.alfabeto = new Set([...this.alfabeto, ...f2.alfabeto]);

        // Impresiones para verificar el funcionamiento

        console.log(`\x1b[1m\x1b[31mUnión de ${this.idAFN} y ${f2.idAFN}: OK\x1b[0m`);


        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);

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

        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mConcatenación de ${this.idAFN} y ${f2.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);

        return this;
    }

    cerraduraPositiva(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, e2)]);
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);

        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mCerradura positiva de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);

        return this;
    }

    cerraduraKleene(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, e2)]);
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, e2)]);

        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);

        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mCerradura de Kleene de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);

        return this;
    }

    cerraduraOpcional(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, e2)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, e2)]);

        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);

        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mCerradura opcional de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);

        return this;
    }

    cerraduraEpsilon(e: Estado): Set<Estado>;
    cerraduraEpsilon(C: Set<Estado>): Set<Estado>;
    cerraduraEpsilon(EorC: Estado | Set<Estado>): Set<Estado> {
        if (EorC instanceof Estado) {

            let conjunto: Set<Estado> = new Set();
            let stackDeEstados: Estado[] = [EorC];

            conjunto.add(EorC);

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
            // Impresiones para verificar el funcionamiento
            console.log(`\x1b[1m\x1b[31mCerradura epsilon de ${EorC.GetIdEstado}: ${conjunto.size} estados\x1b[0m`);
            return conjunto;
        } else if (EorC instanceof Set) {
            let R: Set<Estado> = new Set();
            // Definimos una pila de estados llamada P
            let P: Estado[] = [];
            let aux: Estado;
            for (let e of EorC) {
                R = new Set([...R, ...this.cerraduraEpsilon(e)]);
            }
            // Impresiones para verificar el funcionamiento
            console.log(`\x1b[1m\x1b[31mCerradura epsilon de conjunto: ${R.size} estados\x1b[0m`);
            return R;
        } else {
            throw new Error("Argumento inválido");
        }
    }

    moverA(e: Estado, item: string): Set<Estado>;
    moverA(C: Set<Estado>, item: string): Set<Estado>;
    moverA(EorC: Estado | Set<Estado>, item: string): Set<Estado> {
        if (EorC instanceof Estado) {
            let SalidaEstados: Set<Estado> = new Set();
            let aux: Estado | undefined;
            for (let t of EorC.GetTrans) {
                aux = t.getEdoTrans(item);
                if (aux != null) {
                    SalidaEstados.add(aux);
                }
                else {
                    console.log("No hay transición con el símbolo " + item);
                }
            }
            // Impresiones para verificar el funcionamiento
            console.log(`\x1b[1m\x1b[31mMoverA de ${EorC.GetIdEstado} por ${item}: ${SalidaEstados.size} estados\x1b[0m`);
            return SalidaEstados; // Donde R es el conjunto de estados de salida
        } else if (EorC instanceof Set) {
            let R: Set<Estado> = new Set();
            for (let e of EorC) {
                R = new Set([...R, ...this.moverA(e, item)]); // Union de conjuntos
            }
            // Impresiones para verificar el funcionamiento
            console.log(`\x1b[1m\x1b[31mMoverA de conjunto por ${item}: ${R.size} estados\x1b[0m`);
            return R;
        } else {
            throw new Error("Argumento inválido");
        }
    }

    IrA(e: Estado, simb: string): Set<Estado>;
    IrA(C: Set<Estado>, simb: string): Set<Estado>;
    IrA(EorC: Estado | Set<Estado>, simb: string): Set<Estado> {
        if (EorC instanceof Estado) {
            // Impresiones para verificar el funcionamiento
            console.log(`IrA de ${EorC.GetIdEstado} por ${simb}`);
            return this.cerraduraEpsilon(this.moverA(EorC, simb));
        } else if (EorC instanceof Set) {
            let R: Set<Estado> = new Set();
            R = this.cerraduraEpsilon(this.moverA(EorC, simb));
            // Impresiones para verificar el funcionamiento
            console.log(`\x1b[1m\x1b[31mIrA de conjunto por ${simb}: ${R.size} estados\x1b[0m`);
            return R;
        } else {
            throw new Error("Argumento inválido");
        }
    }

    UnirER(C: Set<AFN>): AFN {
        let e = new Estado();
        for (let f of C) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, f.edoIni!)]);
            this.alfabeto = new Set([...this.alfabeto, ...f.alfabeto]);
            this.edosAFN = new Set([...this.edosAFN, ...f.edosAFN]);
            this.edosAcept = new Set([...this.edosAcept, ...f.edosAcept]);
        }
        this.edoIni = e;
        this.edosAFN.add(e);
        console.log(`\x1b[1m\x1b[31mUnion especial de expresiones regulares de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);
        return this;
    }
}


export { AFN };
