import { AFN } from './AFN';
import { AnalizadorLexico } from "./AnalizadorLexico";
import JSON from "./ExpresionRegular.json"

//! Refactorizar si hay tiempo
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

type nodo = { name: string, children?: nodo[] };

class ExpresionRegular {
    private AL: AnalizadorLexico = new AnalizadorLexico(JSON);
    private result: AFN = new AFN();
    private ER: string = "";
    private tree: nodo;

    constructor(sigma?: string) {
        sigma = sigma || "";
        this.tree = { name: "" };
        this.setER(sigma);
        this.AL.SetSigma(sigma);
    }

    getTree(): nodo {
        return this.tree;
    }

    getResult(): AFN {
        return this.result;
    }

    getER(): string {
        return this.ER;
    }

    setER(sigma: string): void {
        this.ER = sigma;
        this.AL.SetSigma(sigma);
    }

    Parse(): boolean {
        const f: AFN = new AFN();
        console.log("Entre a parse");
        const child: nodo[] = [];
        if (this.E(f, child)) {
            this.tree.name = "E";
            this.tree.children = child;
            const token = this.AL.yylex();
            if (token === TOKEN.END) {
                this.result = f;
                return true;
            }
        }
        return false
    }

    E(f: AFN, father: nodo[]): boolean {
        console.log("Entre a E");
        const childT: nodo[] = [];
        if (this.T(f, childT)) {
            father.push({ name: "T", children: childT });
            const childEp: nodo[] = [];
            if (this.Ep(f, childEp)) {
                father.push({ name: "Ep", children: childEp });
                return true;
            }
        }
        return false;
    }

    Ep(f: AFN, father: nodo[]): boolean {
        console.log("Entre a Ep");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        if (token === TOKEN.OR) {
            father.push({ name: "OR" });
            const childT: nodo[] = [];
            if (this.T(f, childT)) {
                father.push({ name: "T", children: childT });
                const f1 = new AFN();
                const childEP: nodo[] = [];
                if (this.Ep(f1, childEP)) {
                    father.push({ name: "Ep", children: childEP });
                    f.unirAFN(f1);
                    return true;
                }
            }
            return false;
        }
        this.AL.undoToken();
        return true;
    }

    T(f: AFN, father: nodo[]): boolean {
        console.log("Entre a T");
        const childF: nodo[] = [];
        if (this.C(f, childF)) {
            father.push({ name: "C", children: childF });
            const childTp: nodo[] = [];
            if (this.Tp(f, childTp)) {
                father.push({ name: "Tp", children: childTp });
                return true;
            }
        }
        return false;
    }

    Tp(f: AFN, father: nodo[]): boolean {
        console.log("Entre a Tp");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        if (token === TOKEN.CONCAT) {
            father.push({ name: "&" });
            const childC: nodo[] = [];
            if (this.C(f, childC)) {
                father.push({ name: "C", children: childC });
                const f1 = new AFN();
                const childTp: nodo[] = [];
                if (this.Tp(f1, childTp)) {
                    father.push({ name: "Tp", children: childTp });
                    f.concatenacionAFN(f1);
                    return true;
                }
            }
            return false;
        }
        this.AL.undoToken();
        return true;
    }

    C(f: AFN, father: nodo[]): boolean {
        console.log("Entre a C");
        const childF: nodo[] = [];
        if (this.F(f, childF)) {
            father.push({ name: "F", children: childF });
            const childCp: nodo[] = [];
            if (this.Cp(f, childCp)) {
                father.push({ name: "Cp", children: childCp });
                return true;
            }
        }
        return false;
    }

    Cp(f: AFN, father: nodo[]): boolean {
        console.log("Entre a Cp");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        switch (token) {
            case TOKEN.CERRPOS:
                father.push({ name: "+" });
                const childCpPos: nodo[] = [];
                if (this.Cp(f, childCpPos)) {
                    father.push({ name: "Cp", children: childCpPos });
                    f.cerraduraPositiva();
                    return true;
                } return false;
                break;
            case TOKEN.CERRKLEEN:
                father.push({ name: "*" });
                const childCpKleen: nodo[] = [];
                if (this.Cp(f, childCpKleen)) {
                    father.push({ name: "Cp", children: childCpKleen });
                    f.cerraduraKleene();
                    return true;
                } return false;
                break;
            case TOKEN.CERROPC:
                father.push({ name: "?" });
                const childCpOpc: nodo[] = [];
                if (this.Cp(f, childCpOpc)) {
                    father.push({ name: "Cp", children: childCpOpc });
                    f.cerraduraOpcional();
                    return true;
                } return false;
                break
            default:
                this.AL.undoToken();
                return true;
        }
    }

    F(f: AFN, father: nodo[]): boolean {
        console.log("Entre a F");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        switch (token) {
            case TOKEN.LPAREN:
                father.push({ name: "(" });
                const childE: nodo[] = [];
                if (this.E(f, childE)) {
                    father.push({ name: "E", children: childE });
                    const token1 = this.AL.yylex();
                    //console.log("\tToken: ", token1);
                    if (token1 === TOKEN.RPAREN) {
                        father.push({ name: ")" });
                        return true;
                    }
                }
                return false;
            case TOKEN.LCORCH:
                const token1 = this.AL.yylex();
                father.push({ name: "[" });
                //console.log("\tToken: ", token1);
                if (token1 === TOKEN.SIMB) {
                    const lexema = this.AL.getLexema();
                    const simb = (lexema[0] == '\\') ? lexema[1] : lexema[0];
                    father.push({ name: simb });
                    const token2 = this.AL.yylex();
                    //console.log("\tToken: ", token2);
                    if (token2 === TOKEN.DASH) {
                        father.push({ name: "-" });
                        const token3 = this.AL.yylex();
                        //console.log("\tToken: ", token3);
                        if (token3 === TOKEN.SIMB) {
                            const lexema2 = this.AL.getLexema();
                            const simb2 = (lexema2[0] == '\\') ? lexema2[1] : lexema2[0];
                            father.push({ name: simb2 });
                            if (this.AL.yylex() === TOKEN.RCORCH) {
                                father.push({ name: "]" });
                                f.creaAFNBasico(simb, simb2);
                                return true;
                            }
                        }
                    }
                }
                return false;
            case TOKEN.SIMB:
                const lexema = this.AL.getLexema();
                const simb = (lexema[0] == '\\') ? lexema[1] : lexema[0];
                father.push({ name: simb });
                f.creaAFNBasico(simb);
                //f.imprimirAFN();
                return true;
            default:
                return false;
        }

    }
}

export { ExpresionRegular };