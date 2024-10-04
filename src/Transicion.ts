import { Estado } from './Estado';

class Transicion {
    simboloInf: string;
    simboloSup: string;
    edoDestino?: Estado; // null es para representar que no tiene un estado destino o que no se ha asignado


    // Por limitaciones de TypeScript, se debe usar un constructor con parámetros opcionales
    // En lugar de la sobrecarga de métodos de C#    
    constructor(simboloInf: string);
    constructor(simboloInf: string, simboloSup: string);
    constructor(simboloInf: string, simboloSup: string, edoDestino: Estado);
    constructor(simboloInf: string, edoDestino: Estado);
    constructor(simboloInf: string, SimboloSupOredoDestino?: any, edoDestino?: Estado) {
        this.simboloInf = simboloInf;
        this.simboloSup = '';
        if (typeof SimboloSupOredoDestino === 'string' && edoDestino instanceof Estado) {
            this.simboloSup = SimboloSupOredoDestino;
            this.edoDestino = edoDestino;
        } else if (typeof SimboloSupOredoDestino === 'string' && edoDestino === undefined) {
            this.simboloSup = simboloInf;
            this.edoDestino = undefined;
        } else if (SimboloSupOredoDestino instanceof Estado) {
            this.simboloSup = simboloInf;
            this.edoDestino = SimboloSupOredoDestino;
        } else if (SimboloSupOredoDestino === undefined && edoDestino === undefined) {
            this.simboloSup = simboloInf;
        } else {
            throw new Error("Argumentos inválidos");
        }
    }


    public setTransicion(s1: string, s2?: string, e?: Estado): void {
        if (s2 === undefined && e instanceof Estado) {
            this.simboloInf = s1;
            this.simboloSup = s1;
            this.edoDestino = e;
        } else if (typeof s2 === 'string' && e instanceof Estado) {
            this.simboloInf = s1;
            this.simboloSup = s2;
            this.edoDestino = e;
        } else {
            throw new Error("Argumentos inválidos");
        }
    }


    // Getters y Setters
    public getSimboloInf(): string { return this.simboloInf; }

    public getSimboloSup(): string { return this.simboloSup; }


    public getEdoTrans(s: string): Estado | undefined {
        if (this.simboloInf <= s && s <= this.simboloSup) {
            return this.edoDestino;
        }
        return undefined;
    }

}

export { Transicion };
