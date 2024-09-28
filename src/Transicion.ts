import { Estado } from './Estado';

class Transicion {
    simboloInf: string;
    simboloSup: string;
    edoDestino: Estado | null; // null es para representar que no tiene un estado destino o que no se ha asignado


    // Por limitaciones de TypeScript, se debe usar un constructor con parámetros opcionales
    // En lugar de la sobrecarga de métodos de C#    
    constructor(simboloInf: string, simboloSup?: string, edoDestino?: Estado) {   
         
        if (simboloSup === undefined && edoDestino instanceof Estado) { // instanceof es para verificar si edoDestino es una instancia de Estado
            this.simboloInf = simboloInf;
            this.simboloSup = simboloInf; // Ambos símbolos son iguales
            this.edoDestino = edoDestino;
        }
        // Si se pasan dos símbolos y un estado, se asignan los valores normalmente
        else if (typeof simboloSup === 'string' && edoDestino instanceof Estado) {
            this.simboloInf = simboloInf;
            this.simboloSup = simboloSup;
            this.edoDestino = edoDestino;
        }
        else {
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
    

    public getEdoTrans(s: string): Estado | null {
        if (this.simboloInf <= s && s <= this.simboloSup) {
            return this.edoDestino;
        }
        return null;
    }

}

export { Transicion };
