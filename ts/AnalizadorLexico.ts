import { SimbolosEspeciales } from './SimbolosEspeciales';
import { Stack } from './tools/Stack';

class AnalizadorLexico {
    private CadenaSigma: string = "";
    private PasoPorEdoAcept: boolean = false;
    private IniLexema: number = 0;
    private FinLexema: number = -1;
    private IndiceCaracterActual: number = 0;
    private token: number = -1;
    private Pila: Stack<number> = new Stack<number>(); // Pila para almacenar los índices
    private ultimolexema: string = "";
    private tablaAFD: any;

    constructor(tablaAFD: any, sigma?: string) {
        sigma = sigma || "";
        this.SetSigma(sigma);
        this.setTablaAFD(tablaAFD);
        console.log(this.tablaAFD);
    }

    setTablaAFD(tablaAFD: any) {
        this.tablaAFD = tablaAFD;
    }

    // Implementación de SetSigma
    public SetSigma(sigma: string): void {
        this.CadenaSigma = sigma;
        this.PasoPorEdoAcept = false;
        this.IniLexema = 0;
        this.FinLexema = -1;
        this.IndiceCaracterActual = 0;
        this.token = -1;
        this.Pila.clear();                  // Limpia la pila cuando se establece una nueva cadena
        this.ultimolexema = "";
    }

    // Función principal yylex que procesa la cadena
    public yylex(): number | string {
        let lexema = "";

        this.Pila.push(this.IndiceCaracterActual);  // Guarda el índice actual en la pila

        if (this.IndiceCaracterActual >= this.CadenaSigma.length) {
            lexema = "FIN";
            this.ultimolexema = lexema;
            return SimbolosEspeciales.FIN;
        }

        this.IniLexema = this.IndiceCaracterActual;
        let edoActual = 0;
        this.PasoPorEdoAcept = false;
        this.FinLexema = -1;
        this.token = -1;

        while (this.IndiceCaracterActual < this.CadenaSigma.length) {
            const caracterActual = this.CadenaSigma.charCodeAt(this.IndiceCaracterActual);

            const edoTransicion = this.tablaAFD[edoActual][caracterActual];

            if (edoTransicion !== undefined && edoTransicion !== -1) {
                if (this.tablaAFD[edoTransicion][256] !== undefined && this.tablaAFD[edoTransicion][256] !== -1) {
                    this.PasoPorEdoAcept = true;
                    this.token = this.tablaAFD[edoTransicion][256];
                    this.FinLexema = this.IndiceCaracterActual;
                }

                this.IndiceCaracterActual++;
                edoActual = edoTransicion;
                continue;
            }

            break;
        }

        if (!this.PasoPorEdoAcept) {
            this.IndiceCaracterActual = this.IniLexema + 1;
            lexema = this.CadenaSigma.substring(this.IniLexema, this.IniLexema + 1);
            this.token = SimbolosEspeciales.TOKENERROR;
            this.ultimolexema = lexema;
            return this.token;
        } else {
            lexema = this.CadenaSigma.substring(this.IniLexema, this.FinLexema + 1);
            this.IndiceCaracterActual = this.FinLexema + 1;
            this.ultimolexema = lexema;

            if (this.token === SimbolosEspeciales.OMITIR)
                return this.yylex();  // Salta los tokens omitidos
            else
                return this.token;
        }
    }

    getLexema(): string {
        return this.ultimolexema;
    }

    // Implementación de undoToken
    public undoToken(): boolean {
        if (this.Pila.size() > 0) {
            const ultimoIndice = this.Pila.pop();
            if (ultimoIndice !== undefined) {
                this.IndiceCaracterActual = ultimoIndice;
                return true;
            }
        }
        return false;
    }
}

export { AnalizadorLexico };
