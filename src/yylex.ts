import { SimbolosEspeciales } from './SimbolosEspeciales';

export class AnalizadorLexico {
    EdoAceptacion: boolean;
    iniLexema: number;
    finLexema: number;
    caracterActual: number;
    afd: string[][];
    lexema: string;
    sigma: string;
    tamString: number;
    indicesDeCaracteres: number[]; // Definido para un Stack de enteros

    constructor(afd: string[][], sigma: string) {
        this.EdoAceptacion = false;
        this.iniLexema = 0;
        this.finLexema = 0;
        this.lexema = '';
        this.sigma = sigma;
        this.afd = afd;
        this.caracterActual = 0;
        this.tamString = sigma.length;
        this.indicesDeCaracteres = [];
    }

    public yylex(): number | string{
        this.indicesDeCaracteres.push(this.caracterActual);
        if (this.caracterActual >= this.sigma.length) {
            this.lexema = '';
            return SimbolosEspeciales.FIN;
        }
        this.iniLexema = this.caracterActual;
        let estadoActual = 0;
        this.EdoAceptacion = false;
        this.finLexema = -1;
        let token = SimbolosEspeciales.TOKENERROR;
        this.lexema = '';
        let ultimoPosicionEstadoDeAceptacionVisto = -1;

        while (this.caracterActual < this.sigma.length) {
            let transicion = parseInt(this.afd[estadoActual][this.sigma.charCodeAt(this.caracterActual)]);
            if (transicion >= 0) {
                estadoActual = transicion;
                this.caracterActual++;

                if (parseInt(this.afd[estadoActual][255]) >= 0) {
                    ultimoPosicionEstadoDeAceptacionVisto = this.caracterActual - 1;
                    this.EdoAceptacion = true;
                    token = parseInt(this.afd[estadoActual][255]);
                }
            } else {
                if (!this.EdoAceptacion) {
                    this.lexema = this.sigma.charAt(this.caracterActual) + '';
                    token = SimbolosEspeciales.TOKENERROR;
                    this.caracterActual = this.iniLexema + 1;
                    estadoActual = 0;
                    return token;
                } else {
                    this.finLexema = ultimoPosicionEstadoDeAceptacionVisto;
                    this.lexema = this.sigma.substring(this.iniLexema, this.finLexema + 1);
                    this.caracterActual = this.finLexema + 1;
                    estadoActual = 0;
                    return token;
                }
            }
        }
        if (!this.EdoAceptacion) {
            this.lexema = this.sigma.charAt(this.caracterActual) + '';
            token = SimbolosEspeciales.TOKENERROR;
            this.caracterActual = this.iniLexema + 1;
            estadoActual = 0;
            return token;
        } else {
            this.finLexema = ultimoPosicionEstadoDeAceptacionVisto;
            this.lexema = this.sigma.substring(this.iniLexema, this.finLexema + 1);
            this.caracterActual = this.finLexema + 1;
            estadoActual = 0;
            return token;
        }
    }

    public getLexema(): string {
        return this.lexema;
    }

    public undoToken(): boolean {
        if (this.indicesDeCaracteres.length === 0) return false;
        this.caracterActual = this.indicesDeCaracteres.pop()!;
        return true;
    }

    public printIndices(): void {
        this.indicesDeCaracteres.forEach(i => {
            console.log(i);
        });
    }
}
