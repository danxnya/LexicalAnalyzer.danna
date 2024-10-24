//import { AFN } from './AFN';
import { Estado } from '../Estado';

class Si {
    id: number;                // Identificador
    S: Set<Estado>;           // Conjunto de estados

    constructor(i: number = 0, S: Set<Estado> = new Set()) {
        this.id = i;
        this.S = S;
    }
    Equals(obj: Si): boolean {
        if (this.S.size !== obj.S.size) return false;

        const inObj = new Set((this.S.size < obj.S.size) ?
            [...this.S].filter(x => !obj.S.has(x)) : [...obj.S].filter(x => !this.S.has(x))
        );
        return inObj.size === 0;
    }
}
/*
// Función IndiceCaracter para obtener el índice del carácter en el alfabeto
function IndiceCaracter(alfabeto: string[], c: string): number {
    return alfabeto.indexOf(c);
}

// Implementación de la función EstadosSi
function EstadosSi(): void {

}*/
export { Si };