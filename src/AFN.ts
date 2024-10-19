import { Estado } from './Estado';
import { Transicion } from './Transicion';
import { SimbolosEspeciales } from './SimbolosEspeciales';
import { Si } from './EstadosSi';
import { Stack } from './Stack';
import { Queue } from './Queue';
//import * as fs from 'fs';
//import * as path from 'path';


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

    creaAFNBasico(n: number): AFN;//Refactorizar si hay tiempo para que sea más legible
    creaAFNBasico(s: string): AFN;
    creaAFNBasico(s1: string, s2: string): AFN;
    creaAFNBasico(n1: number, n2: number): AFN;
    creaAFNBasico(SorN1: any, SorN2?: any): AFN {
        if (typeof SorN2 === 'number' || typeof SorN2 === 'string') {
            let s1: string, s2: string;
            s1 = (typeof SorN1 === 'number') ? String.fromCharCode(SorN1) : SorN1;
            s2 = (typeof SorN2 === 'number') ? String.fromCharCode(SorN2) : SorN2;

            let t: Transicion;
            let e1: Estado, e2: Estado;
            e1 = new Estado();
            e2 = new Estado();
            e2.SetEdoAcept = true;

            t = new Transicion(s1, s2, e2);
            e1.SetTrans = new Set([t]);

            for (let i = s1.charCodeAt(0); i <= s2.charCodeAt(0); i++)
                this.alfabeto.add(String.fromCharCode(i));

            this.edoIni = e1;
            this.edosAFN.add(e1);
            this.edosAFN.add(e2);
            this.edosAcept.add(e2);

            //console.log(`\x1b[1m\x1b[31mAFN básico ${s1} - ${s2}: OK\x1b[0m`);
            //console.log(`Estado inicial: ${e1.GetIdEstado}`);
            //console.log(`Estado de aceptación: ${e2.GetIdEstado}`);

            return this;
        } else if (typeof SorN2 === 'undefined') {
            let s: string = (typeof SorN1 === 'number') ? String.fromCharCode(SorN1) : SorN1;
            let t: Transicion;
            let e1: Estado, e2: Estado;

            e1 = new Estado();
            e2 = new Estado();

            e2.SetEdoAcept = true;

            t = new Transicion(s, e2);
            e1.SetTrans = new Set([t]);

            this.edoIni = e1;
            this.edosAFN.add(e1);
            this.edosAFN.add(e2);
            this.edosAcept.add(e2);
            this.alfabeto.add(s);

            //console.log(`\x1b[1m\x1b[31mAFN básico ${s}: OK\x1b[0m`);
            //console.log(`Estado inicial: ${e1.GetIdEstado}`);
            //console.log(`Estado de aceptación: ${e2.GetIdEstado}`);
            return this;
        } else {
            throw new Error('Argumentos inválidos');
        }
    }

    unirAFN(f2: AFN): AFN {
        let e1 = new Estado();
        let e2 = new Estado();
        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);

        e1.SetTrans = new Set([...e1.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, f2.edoIni!)]);

        // for (let e of this.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }

        // Recorremos el set de estados de aceptación de this para agregar transiciones epsilon y cambiar el estado de aceptación
        this.edosAcept.forEach(e => {
            e.SetTrans = new Set([...e.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, e2)]);
            e.SetEdoAcept = false;
        });


        // for (let e of f2.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }

        f2.edosAcept.forEach(e => {
            e.SetTrans = new Set([...e.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, e2)]);
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
        /*
        console.log(`\x1b[1m\x1b[31mUnión de ${this.idAFN} y ${f2.idAFN}: OK\x1b[0m`);


        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);
        */
        return this;
    }

    concatenacionAFN(f2: AFN): AFN {
        for (let t of f2.edoIni!.GetTrans) {
            for (let e of this.edosAcept) {
                e.SetTrans = new Set([...e.GetTrans, t]);
                e.SetEdoAcept = false;
            }
        }
        f2.edosAFN.delete(f2.edoIni!);
        this.edosAcept = f2.edosAcept;
        this.edosAFN = new Set([...this.edosAFN, ...f2.edosAFN]);
        this.alfabeto = new Set([...this.alfabeto, ...f2.alfabeto]);

        /*// Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mConcatenación de ${this.idAFN} y ${f2.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);
        */
        return this;
    }

    cerraduraPositiva(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, e2), new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);

        /*// Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mCerradura positiva de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);
        */
        return this;
    }

    cerraduraKleene(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, e2), new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([...e1.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, e2)]);

        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);

        /*// Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mCerradura de Kleene de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);
        */
        return this;
    }

    cerraduraOpcional(): AFN {
        let e1 = new Estado();
        let e2 = new Estado();

        e1.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, this.edoIni!)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, e2)]);
            e.SetEdoAcept = false;
        }

        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([...e1.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, e2)]);

        this.edoIni = e1;
        this.edosAcept.clear();
        this.edosAcept.add(e2);
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);

        // Impresiones para verificar el funcionamiento
        /*console.log(`\x1b[1m\x1b[31mCerradura opcional de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);
        */
        return this;
    }

    cerraduraEpsilon(e: Estado): Set<Estado>;
    cerraduraEpsilon(C: Set<Estado>): Set<Estado>;
    cerraduraEpsilon(EorC: Estado | Set<Estado>): Set<Estado> {
        if (EorC instanceof Estado) {

            let conjunto: Set<Estado> = new Set();
            let stackDeEstados: Stack<Estado> = new Stack<Estado>;
            stackDeEstados.push(EorC);

            conjunto.add(EorC);

            while (stackDeEstados.size() > 0) {
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
            // console.log(`\x1b[1m\x1b[31mCerradura epsilon de ${EorC.GetIdEstado}: ${conjunto.size} estados\x1b[0m`);
            return conjunto;
        } else if (EorC instanceof Set) {
            let R: Set<Estado> = new Set();

            for (let e of EorC) {
                R = new Set([...R, ...this.cerraduraEpsilon(e)]);
            }
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mCerradura epsilon de conjunto: ${R.size} estados\x1b[0m`);
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
                    //console.log("No hay transición con el símbolo " + item);
                }
            }
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mMoverA de ${EorC.GetIdEstado} por ${item}: ${SalidaEstados.size} estados\x1b[0m`);
            return SalidaEstados; // Donde R es el conjunto de estados de salida
        } else if (EorC instanceof Set) {
            let R: Set<Estado> = new Set();
            for (let e of EorC) {
                R = new Set([...R, ...this.moverA(e, item)]); // Union de conjuntos
            }
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mMoverA de conjunto por ${item}: ${R.size} estados\x1b[0m`);
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
            // console.log(`IrA de ${EorC.GetIdEstado} por ${simb}`);
            return this.cerraduraEpsilon(this.moverA(EorC, simb));
        } else if (EorC instanceof Set) {
            let R: Set<Estado> = new Set();
            R = this.cerraduraEpsilon(this.moverA(EorC, simb));
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mIrA de conjunto por ${simb}: ${R.size} estados\x1b[0m`);
            return R;
        } else {
            throw new Error("Argumento inválido");
        }
    }

    UnirER(C: Set<AFN>): AFN {
        //Creamos un nuevo estado inicial
        let e = new Estado();

        //Por cada AFN en C, realizamos la unión
        for (let f of C) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion(SimbolosEspeciales.EPSILON, f.edoIni!)]);
            this.alfabeto = new Set([...this.alfabeto, ...f.alfabeto]);
            this.edosAFN = new Set([...this.edosAFN, ...f.edosAFN]);
            this.edosAcept = new Set([...this.edosAcept, ...f.edosAcept]);
        }

        //Agregamos token a los estados de aceptación a los estados de aceptación
        let token = 0;
        for (let edo of this.edosAFN)
            edo.SetToken = (edo.GetEdoAcept) ? token += 10 : -1;

        //Agregamos el nuevo estado inicial
        this.edoIni = e;
        this.edosAFN.add(e);

        /*// Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mUnion especial de expresiones regulares de ${this.idAFN}: OK\x1b[0m`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);*/
        return this;
    }

    ToAFD(): Map<number, Array<number>> {
        // Variables locales
        let indexSi: number;
        let Sj: Si, Sk: Si;

        // Inicializamos las estructuras de datos
        const C: Set<Si> = new Set();  // Conjunto de conjuntos de estados
        const queueSi: Queue<Si> = new Queue();  // Cola de estados por procesar
        const AFDTrans: Map<number, Array<number>> = new Map(); // diccionario de transiciones del AFD

        // Inicializamos el contador de estados
        indexSi = 0;

        // Cerradura epsilon del estado inicial
        Sj = new Si(indexSi++, this.cerraduraEpsilon(this.edoIni!));
        C.add(Sj);
        queueSi.enqueue(Sj);  // Añadimos el estado inicial a la cola de análisis

        // Proceso principal
        while (queueSi.size() != 0) {
            //Inicializamos un arreglo de transiciones con -1
            const trans: Array<number> = new Array<number>(257).fill(-1);

            // Sacamos el primer estado de la cola
            Sj = queueSi.dequeue()!;

            // Recorremos cada símbolo del alfabeto
            for (const c of this.alfabeto) {
                Sk = new Si(indexSi, this.IrA(Sj.S, c));  // Creamos un nuevo estado Sk

                if (Sk.S.size === 0) // Si el conjunto está vacío, seguimos con el siguiente símbolo
                    continue;

                // Verificamos si el estado Sk ya existe en C
                const existe = [...C].find(x => x.Equals(Sk));
                if (existe === undefined) {
                    queueSi.enqueue(Sk);
                    C.add(Sk);
                    indexSi++;
                    trans[c.charCodeAt(0)] = Sk.id;
                } else {
                    trans[c.charCodeAt(0)] = existe.id;
                }
            }
            //Agrgamos token al arreglo de transiciones
            const edoAcept = [...Sj.S].find(x => x.GetEdoAcept);
            trans[256] = (edoAcept !== undefined) ? edoAcept.GetToken : -1;

            //Agregamos al diccionario las transiciones del estado Sj
            AFDTrans.set(Sj.id, trans);
        }
        /*Crear archivo JSON con las transiciones del AFD opcional ???? o afura
        const filePath = path.join(__dirname, 'afd.json');
        // Convertir el Map a un objeto plano
        const obj: { [key: number]: number[] } = {};
        AFDTrans.forEach((value, key) => {
            obj[key] = value;
        });
        const jsonData = JSON.stringify(obj);
        fs.writeFile(filePath, jsonData, (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                console.log('File has been written');
            }
        });*/
        return AFDTrans;
    }


    imprimirAFN(): void {
        console.log(`\n\x1b[1m\x1b[31mAFN ${this.idAFN}\x1b[0m`);
        console.log(`Estado inicial: ${this.edoIni?.GetIdEstado}`);
        console.log(`Estados de aceptación: ${this.edosAcept.size}`);
        console.log(`Estados AFN: ${this.edosAFN.size}`);
        console.log(`Alfabeto: ${this.alfabeto.size}`);
        for (let e of this.edosAFN) {
            console.log(`\nEstado: ${e.GetIdEstado}`);
            console.log(`Transiciones:`);
            for (let t of e.GetTrans) {
                if (t.getSimboloInf() === t.getSimboloSup())
                    console.log(`\tSímbolo: ${t.getSimboloInf()}`);
                else
                    console.log(`\tSímbolo: ${t.getSimboloInf()} - ${t.getSimboloSup()})`);
                console.log(`\tDestino: ${t.edoDestino?.GetIdEstado}`);
            }
            console.log(`Es estado de aceptación: ${e.GetEdoAcept}`);
        }
    }
}


export { AFN };
