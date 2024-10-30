import { Console } from 'console';
import { AFN } from './AFN';
import { AnalizadorLexico } from "./AnalizadorLexico";

enum TOKEN {
    OR = 10,
    CONCAT = 20,
    CERRPOS = 30,
    CERRKLEEN = 40,
    CERROPC = 50,
    LPAREN = 60,
    SPACE = 70,
    RPAREN = 80,
    LCORCH = 90,
    RCORCH = 100,
    DASH = 110,
    SIMB = 120,
    END = 0,
}

class ExpresionRegular {
    private AL: AnalizadorLexico = new AnalizadorLexico('./afd.json');
    private result: AFN = new AFN();
    private ER: string = "";

    constructor(sigma?: string) {
        sigma = sigma || "";
        this.setER(sigma);
        this.AL.SetSigma(sigma);
    }
    setER(sigma: string): void {
        this.ER = sigma;
        this.AL.SetSigma(sigma);
    }
    Parse(): boolean {
        const f: AFN = new AFN();
        let token: string | number;
        console.log("Entre a parse");
        if (this.E(f)) {
            token = this.AL.yylex();
            console.log("\tToken: ", token);
            if (token === TOKEN.END) {
                this.result = f;
                return true;
            }
        }
        return false
    }
    E(f: AFN): boolean {
        console.log("Entre a E");
        if (this.T(f)) {
            if (this.Ep(f)) {
                return true;
            }
        }
        return false;
    }
    Ep(f: AFN): boolean {
        console.log("Entre a Ep");
        const token = this.AL.yylex();
        console.log("\tToken: ", token);
        if (token === TOKEN.OR) {
            if (this.T(f)) {
                const f1 = new AFN();
                if (this.Ep(f1)) {
                    f.unirAFN(f1);
                    return true;
                }
            }
            return false;
        }
        this.AL.undoToken();
        return true;
    }
    T(f: AFN): boolean {
        console.log("Entre a T");
        if (this.C(f)) {
            if (this.Tp(f)) {
                return true;
            }
        }
        return false;
    }
    Tp(f: AFN): boolean {
        console.log("Entre a Tp");
        const token = this.AL.yylex();
        console.log("\tToken: ", token);
        if (token === TOKEN.CONCAT) {
            if (this.C(f)) {
                const f1 = new AFN();
                if (this.Tp(f1)) {
                    f.concatenacionAFN(f1);
                    return true;
                }
            }
            return false;
        }
        this.AL.undoToken();
        return true;
    }
    C(f: AFN): boolean {
        console.log("Entre a C");
        if (this.F(f)) {
            if (this.Cp(f)) {
                return true;
            }
        }
        return false;
    }
    Cp(f: AFN): boolean {
        console.log("Entre a Cp");
        const token = this.AL.yylex();
        console.log("\tToken: ", token);
        switch (token) {
            case TOKEN.CERRPOS:
                if (this.Cp(f)) {
                    f.cerraduraPositiva();
                    return true;
                } return false;
                break;
            case TOKEN.CERRKLEEN:
                if (this.Cp(f)) {
                    f.cerraduraKleene();
                    return true;
                } return false;
                break;
            case TOKEN.CERROPC:
                if (this.Cp(f)) {
                    f.cerraduraOpcional();
                    return true;
                } return false;
                break
            default:
                this.AL.undoToken();
                return true;
        }
    }
    F(f: AFN): boolean {
        console.log("Entre a F");
        const token = this.AL.yylex();
        console.log("\tToken: ", token);
        switch (token) {
            case TOKEN.LPAREN:
                if (this.E(f)) {
                    const token1 = this.AL.yylex();
                    console.log("\tToken: ", token1);
                    if (token1 === TOKEN.RPAREN) {
                        return true;
                    }
                }
                return false;
            case TOKEN.LCORCH:
                const token1 = this.AL.yylex();
                console.log("\tToken: ", token1);
                if (token1 === TOKEN.SIMB) {
                    const simb = this.AL.getLexema();
                    const token2 = this.AL.yylex();
                    console.log("\tToken: ", token2);
                    if (token2 === TOKEN.DASH) {
                        const token3 = this.AL.yylex();
                        console.log("\tToken: ", token3);
                        if (token3 === TOKEN.SIMB) {
                            const simb2 = this.AL.getLexema();
                            if (this.AL.yylex() === TOKEN.RCORCH) {
                                f.creaAFNBasico(simb, simb2);
                                return true;
                            }
                        }
                    }
                }
                return false;
            case TOKEN.SIMB:
                f.creaAFNBasico(this.AL.getLexema());
                //f.imprimirAFN();
                return true;
            default:
                return false;
        }

    }
    test(): void {
        console.log("Test1--------------------------------------------------");
        this.setER('[ -%]OR\'OR[,->]OR[@-Z]OR[^-■]');
        if (this.Parse()) {
            console.log("AFN generado");
            this.result.imprimirAFN();
        }
        console.log("Test2--------------------------------------------------");
        this.setER('(]');
        if (this.Parse()) {
            console.log("AFN generado");
            this.result.imprimirAFN();
        }
    }
}

const ER: ExpresionRegular = new ExpresionRegular();
ER.test();