import { SimbolosEspeciales } from './SimbolosEspeciales';
import { Stack } from './tools/Stack';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';



class AnalizadorLexico {
    private CadenaSigma: string = "";
    private PasoPorEdoAcept: boolean = false;
    private IniLexema: number = 0;
    private FinLexema: number = -1;
    private IndiceCaracterActual: number = 0;
    private token: number = -1;
    private Pila: Stack<number> = new Stack<number>();  // Pila para almacenar los índices
    private ultimolexema: string = "";
    private tablaAFD: any;

    constructor(filename: string, sigma?: string) {
        if (sigma === undefined)
            this.SetSigma("");
        else
            this.SetSigma(sigma);
        this.setTablaAFD(filename);
    }
    setTablaAFD(filename: string) {
        this.SetSigma(this.CadenaSigma);
        this.tablaAFD = JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf-8'));
    }

    // Implementación de SetSigma
    public SetSigma(sigma: string): void {
        this.CadenaSigma = sigma;
        this.PasoPorEdoAcept = false;
        this.IniLexema = 0;
        this.FinLexema = -1;
        this.IndiceCaracterActual = 0;
        this.token = -1;
        this.Pila.clear();  // Limpia la pila cuando se establece una nueva cadena
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
            const ultimoIndice = this.Pila.pop();  // Restaura el índice del último token leído
            if (ultimoIndice !== undefined) {
                this.IndiceCaracterActual = ultimoIndice;  // Restablecemos la posición
                return true;
            }
        }
        return false;
    }


    // Función para leer un archivo y procesarlo línea por línea con yylex
    public LineaPorLinea(filename: string): void {
        const filePath = path.join(__dirname, filename);

        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false,
        });

        rl.on('line', (line: string) => {
            this.SetSigma(line);
            let result;
            do {
                result = this.yylex();
                console.log(`${this.ultimolexema},${result}`);
            } while (result !== SimbolosEspeciales.FIN);
        });

        rl.on('close', () => {
            // console.log('Fin de archivo');
        });
    }
}
function test() {
    let sigma = "A OR B & C"
    const analizador = new AnalizadorLexico("afd.json", sigma);
    console.log("::::::::::::::::::::::::Test 1::::::::::::::::::::::::\n\t" + sigma);
    let token = analizador.yylex();
    let result: string = "{ ";
    while (token !== SimbolosEspeciales.FIN) {
        if (typeof token === 'number')
            result += String(token) + ", ";
        else if (typeof token === 'string') {
            result += token + ",  ";
        }
        token = analizador.yylex();
    }
    result += String(token) + " }";
    console.log(result);
    //////////////////////////////////////////
    sigma = "([0-9]+)&(.&([0-9]+))*";
    analizador.SetSigma(sigma);
    console.log("::::::::::::::::::::::::Test 2::::::::::::::::::::::::\n\t" + sigma);
    token = analizador.yylex();
    result = "{ ";
    while (token !== SimbolosEspeciales.FIN) {
        if (typeof token === 'number')
            result += String(token) + ", ";
        else if (typeof token === 'string') {
            result += token + ",  ";
        }
        token = analizador.yylex();
    }
    result += String(token) + " }";
    console.log(result);
    ///////////////////////////////////////////////
    sigma = "\\b\\c   \\a\\";
    analizador.SetSigma(sigma);
    console.log("::::::::::::::::::::::::Test 3::::::::::::::::::::::::\n\t" + sigma);
    token = analizador.yylex();
    result = "{ ";
    while (token !== SimbolosEspeciales.FIN) {
        if (typeof token === 'number')
            result += String(token) + ", ";
        else if (typeof token === 'string') {
            result += token + ",  ";
        }
        token = analizador.yylex();
    }
    result += String(token) + " }";
    console.log(result);
    //analizador.LineaPorLinea('../dump/test.txt');*/
}
test();
export { AnalizadorLexico };
