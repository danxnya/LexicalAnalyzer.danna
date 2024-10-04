"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AFN = void 0;
const Estado_1 = require("./Estado");
const Transicion_1 = require("./Transicion");
const SimbolosEspeciales_1 = require("./SimbolosEspeciales");
class AFN {
    constructor() {
        this.edosAFN = new Set();
        this.edosAcept = new Set();
        this.alfabeto = new Set();
        this.idAFN = AFN.contIdAFN++;
        this.edoIni = null;
        // No es necesario limpiar los sets, ya que están vacíos.
    }
    creaAFNBasico(s) {
        let t;
        let e1, e2;
        e1 = new Estado_1.Estado();
        e2 = new Estado_1.Estado();
        t = new Transicion_1.Transicion(s, undefined, e2);
        // Set es una interfaz, por lo que no se puede asignar directamente
        e1.SetTrans = new Set([t]);
        e2.SetEdoAcept = true;
        this.alfabeto.add(s);
        this.edoIni = e1;
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);
        this.edosAcept.add(e2);
        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mAFN básico ${s}: OK\x1b[0m`);
        console.log(`Estado inicial: ${e1.GetIdEstado}`);
        console.log(`Estado de aceptación: ${e2.GetIdEstado}`);
        return this;
    }
    creaAFNBasicoNum(s) {
        return this.creaAFNBasico(String.fromCharCode(s));
    }
    creaAFNBasicoRango(s1, s2) {
        let t;
        let e1, e2;
        e1 = new Estado_1.Estado();
        e2 = new Estado_1.Estado();
        t = new Transicion_1.Transicion(s1, s2, e2);
        e1.SetTrans = new Set([t]);
        e2.SetEdoAcept = true;
        for (let i = s2.charCodeAt(0); i <= s1.charCodeAt(0); i++) {
            this.alfabeto.add(String.fromCharCode(i));
        }
        this.edoIni = e1;
        this.edosAFN.add(e1);
        this.edosAFN.add(e2);
        this.edosAcept.add(e2);
        return this;
    }
    unirAFN(f2) {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        // agregamos transiciones epsilon al estado inicial de cada AFN
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, this.edoIni)]);
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, f2.edoIni)]);
        // for (let e of this.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }
        // Recorremos el set de estados de aceptación de this para agregar transiciones epsilon y cambiar el estado de aceptación
        this.edosAcept.forEach(e => {
            e.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetEdoAcept = false;
        });
        // for (let e of f2.edosAcept) {
        //     e.SetTrans = new Set([new Transicion(SimbolosEspeciales.EPSILON, undefined, e2)]);
        //     e.SetEdoAcept = false;
        // }
        f2.edosAcept.forEach(e => {
            e.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, e2)]);
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
    concatenacionAFN(f2) {
        for (let t of f2.edoIni.GetTrans) {
            for (let e of this.edosAcept) {
                e.SetTrans = new Set([t]);
                e.SetEdoAcept = false;
            }
        }
        f2.edosAFN.delete(f2.edoIni);
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
    cerraduraPositiva() {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, this.edoIni)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, this.edoIni)]);
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
    cerraduraKleene() {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, this.edoIni)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, this.edoIni)]);
            e.SetEdoAcept = false;
        }
        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, e2)]);
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
    cerraduraOpcional() {
        let e1 = new Estado_1.Estado();
        let e2 = new Estado_1.Estado();
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, this.edoIni)]);
        for (let e of this.edosAcept) {
            e.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, e2)]);
            e.SetEdoAcept = false;
        }
        e2.SetEdoAcept = true;
        e1.SetTrans = new Set([new Transicion_1.Transicion(SimbolosEspeciales_1.SimbolosEspeciales.EPSILON, undefined, e2)]);
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
    cerraduraEpsilon(e) {
        let conjunto = new Set();
        let stackDeEstados = [e];
        conjunto.add(e);
        while (stackDeEstados.length > 0) {
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
        console.log(`\x1b[1m\x1b[31mCerradura epsilon de ${e.GetIdEstado}: ${conjunto.size} estados\x1b[0m`);
        return conjunto;
    }
    cerraduraEpsilonConjunto(C) {
        let R = new Set();
        // Definimos una pila de estados llamada P
        let P = [];
        let aux;
        for (let e of C) {
            R = new Set([...R, ...this.cerraduraEpsilon(e)]);
        }
        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mCerradura epsilon de conjunto: ${R.size} estados\x1b[0m`);
        return R;
    }
    moverA(e, item) {
        let SalidaEstados = new Set();
        let aux;
        for (let t of e.GetTrans) {
            aux = t.getEdoTrans(item);
            if (aux != null) {
                SalidaEstados.add(aux);
            }
            else {
                console.log("No hay transición con el símbolo " + item);
            }
        }
        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mMoverA de ${e.GetIdEstado} por ${item}: ${SalidaEstados.size} estados\x1b[0m`);
        return SalidaEstados; // Donde R es el conjunto de estados de salida
    }
    moverAConjunto(C, item) {
        let R = new Set();
        for (let e of C) {
            R = new Set([...R, ...this.moverA(e, item)]); // Union de conjuntos
        }
        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mMoverA de conjunto por ${item}: ${R.size} estados\x1b[0m`);
        return R;
    }
    IrA(e, simb) {
        // Impresiones para verificar el funcionamiento
        console.log(`IrA de ${e.GetIdEstado} por ${simb}`);
        return this.cerraduraEpsilonConjunto(this.moverA(e, simb));
    }
    IrAConjunto(C, simb) {
        let R = new Set();
        R = this.cerraduraEpsilonConjunto(this.moverAConjunto(C, simb));
        // Impresiones para verificar el funcionamiento
        console.log(`\x1b[1m\x1b[31mIrA de conjunto por ${simb}: ${R.size} estados\x1b[0m`);
        return R;
    }
}
exports.AFN = AFN;
AFN.contIdAFN = 0;
