"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AFN = void 0;
const Estado_1 = require("./Estado");
const Transicion_1 = require("./Transicion");
const SimbolosEspeciales_1 = require("./SimbolosEspeciales");
const EstadosSi_1 = require("./EstadosSi");
const Stack_1 = require("./Stack");
const Queue_1 = require("./Queue");
//import * as fs from 'fs';
//import * as path from 'path';
class AFN {
    constructor() {
        this.edosAFN = new Set();
        this.edosAcept = new Set();
        this.alfabeto = new Set();
        this.idAFN = AFN.contIdAFN++;
        // No es necesario limpiar los sets, ya que están vacíos.
    }
    creaAFNBasico(SorN1, SorN2) {
        if (typeof SorN2 === 'number' || typeof SorN2 === 'string') {
            let s1, s2;
            s1 = (typeof SorN1 === 'number') ? String.fromCharCode(SorN1) : SorN1;
            s2 = (typeof SorN2 === 'number') ? String.fromCharCode(SorN2) : SorN2;
            let t;
            let e1, e2;
            e1 = new Estado_1.Estado();
            e2 = new Estado_1.Estado();
            e2.SetEdoAcept = true;
            t = new Transicion_1.Transicion(s1, s2, e2);
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
        }
        else if (typeof SorN2 === 'undefined') {
            let s = (typeof SorN1 === 'number') ? String.fromCharCode(SorN1) : SorN1;
            let t;
            let e1, e2;
            e1 = new Estado_1.Estado();
            e2 = new Estado_1.Estado();
            e2.SetEdoAcept = true;
            t = new Transicion_1.Transicion(s, e2);
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
        }
        else {
            throw new Error('Argumentos inválidos');
        }
    }
    unirAFN(f2) {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, this.edoIni)]);
        e1.SetTrans = new Set([...e1.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, f2.edoIni)]);
        // for (let e of this.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }
        // Recorremos el set de estados de aceptación de this para agregar transiciones epsilon y cambiar el estado de aceptación
        this.edosAcept.forEach(e => {
            e.SetTrans = new Set([...e.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, e2)]);
            e.SetEdoAcept = false;
        });
        // for (let e of f2.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }
        f2.edosAcept.forEach(e => {
            e.SetTrans = new Set([...e.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, e2)]);
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
    concatenacionAFN(f2) {
        for (let t of f2.edoIni.GetTrans) {
            for (let e of this.edosAcept) {
                e.SetTrans = new Set([...e.GetTrans, t]);
                e.SetEdoAcept = false;
            }
        }
        f2.edosAFN.delete(f2.edoIni);
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
    cerraduraPositiva() {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, this.edoIni)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, e2), new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, this.edoIni)]);
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
    cerraduraKleene() {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, this.edoIni)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, e2), new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, this.edoIni)]);
            e.SetEdoAcept = false;
        }
        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([...e1.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, e2)]);
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
    cerraduraOpcional() {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, this.edoIni)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, e2)]);
            e.SetEdoAcept = false;
        }
        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([...e1.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, e2)]);
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
    cerraduraEpsilon(EorC) {
        if (EorC instanceof Estado_1.Estado) {
            let conjunto = new Set();
            let stackDeEstados = new Stack_1.Stack;
            stackDeEstados.push(EorC);
            conjunto.add(EorC);
            while (stackDeEstados.size() > 0) {
                let aux = stackDeEstados.pop();
                for (let t of aux.GetTrans) {
                    let destino = t.getEdoTrans(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON);
                    if (destino && !conjunto.has(destino)) {
                        conjunto.add(destino);
                        stackDeEstados.push(destino);
                    }
                }
            }
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mCerradura epsilon de ${EorC.GetIdEstado}: ${conjunto.size} estados\x1b[0m`);
            return conjunto;
        }
        else if (EorC instanceof Set) {
            let R = new Set();
            for (let e of EorC) {
                R = new Set([...R, ...this.cerraduraEpsilon(e)]);
            }
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mCerradura epsilon de conjunto: ${R.size} estados\x1b[0m`);
            return R;
        }
        else {
            throw new Error("Argumento inválido");
        }
    }
    moverA(EorC, item) {
        if (EorC instanceof Estado_1.Estado) {
            let SalidaEstados = new Set();
            let aux;
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
        }
        else if (EorC instanceof Set) {
            let R = new Set();
            for (let e of EorC) {
                R = new Set([...R, ...this.moverA(e, item)]); // Union de conjuntos
            }
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mMoverA de conjunto por ${item}: ${R.size} estados\x1b[0m`);
            return R;
        }
        else {
            throw new Error("Argumento inválido");
        }
    }
    IrA(EorC, simb) {
        if (EorC instanceof Estado_1.Estado) {
            // Impresiones para verificar el funcionamiento
            // console.log(`IrA de ${EorC.GetIdEstado} por ${simb}`);
            return this.cerraduraEpsilon(this.moverA(EorC, simb));
        }
        else if (EorC instanceof Set) {
            let R = new Set();
            R = this.cerraduraEpsilon(this.moverA(EorC, simb));
            // Impresiones para verificar el funcionamiento
            // console.log(`\x1b[1m\x1b[31mIrA de conjunto por ${simb}: ${R.size} estados\x1b[0m`);
            return R;
        }
        else {
            throw new Error("Argumento inválido");
        }
    }
    UnirER(C) {
        //Creamos un nuevo estado inicial
        let e = new Estado_1.Estado();
        //Por cada AFN en C, realizamos la unión
        for (let f of C) {
            e.SetTrans = new Set([...e.GetTrans, new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, f.edoIni)]);
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
    ToAFD() {
        // Variables locales
        let indexSi;
        let Sj, Sk;
        // Inicializamos las estructuras de datos
        const C = new Set(); // Conjunto de conjuntos de estados
        const queueSi = new Queue_1.Queue(); // Cola de estados por procesar
        const AFDTrans = new Map(); // diccionario de transiciones del AFD
        // Inicializamos el contador de estados
        indexSi = 0;
        // Cerradura epsilon del estado inicial
        Sj = new EstadosSi_1.Si(indexSi++, this.cerraduraEpsilon(this.edoIni));
        C.add(Sj);
        queueSi.enqueue(Sj); // Añadimos el estado inicial a la cola de análisis
        // Proceso principal
        while (queueSi.size() != 0) {
            //Inicializamos un arreglo de transiciones con -1
            const trans = new Array(257).fill(-1);
            // Sacamos el primer estado de la cola
            Sj = queueSi.dequeue();
            // Recorremos cada símbolo del alfabeto
            for (const c of this.alfabeto) {
                Sk = new EstadosSi_1.Si(indexSi, this.IrA(Sj.S, c)); // Creamos un nuevo estado Sk
                if (Sk.S.size === 0) // Si el conjunto está vacío, seguimos con el siguiente símbolo
                    continue;
                // Verificamos si el estado Sk ya existe en C
                const existe = [...C].find(x => x.Equals(Sk));
                if (existe === undefined) {
                    queueSi.enqueue(Sk);
                    C.add(Sk);
                    indexSi++;
                    trans[c.charCodeAt(0)] = Sk.id;
                }
                else {
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
    imprimirAFN() {
        var _a, _b;
        console.log(`\n\x1b[1m\x1b[31mAFN ${this.idAFN}\x1b[0m`);
        console.log(`Estado inicial: ${(_a = this.edoIni) === null || _a === void 0 ? void 0 : _a.GetIdEstado}`);
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
                console.log(`\tDestino: ${(_b = t.edoDestino) === null || _b === void 0 ? void 0 : _b.GetIdEstado}`);
            }
            console.log(`Es estado de aceptación: ${e.GetEdoAcept}`);
        }
    }
}
exports.AFN = AFN;
AFN.contIdAFN = 0;
