import { AnalizadorLexico } from "./AnalizadorLexico";
import JSON from '@/ts/Calculadora.json';

enum TOKEN {
    PLUS = 10,
    MINUS = 20,
    PROD = 30,
    DIV = 40,
    LPAREN = 50,
    RPAREN = 60,
    SPACE = 70,
    NUM = 80,
    END = 0,
}

type Nodo = { name: string, children?: Nodo[] };

export class Calculadora {
    private AL = new AnalizadorLexico(JSON);

    parseConPostfijo(input: string): { valid: boolean, postfijo: string, resultado: number } {
        this.AL.SetSigma(input);
        const resultado = { val: 0 };
        const eResult = this.E(resultado);

        if (eResult.val && this.AL.yylex() === TOKEN.END) {
            const postfijo = this.recorrerPostorden(eResult.tree).trim();
            return { valid: true, postfijo: postfijo, resultado: resultado.val };
        }
        return { valid: false, postfijo: "", resultado: 0 };
    }

    private E(resultado: { val: number }): { val: boolean, tree: Nodo } {
        const temp = { val: 0 };
        const tree: Nodo = { name: "E", children: [] };

        const tResult = this.T(temp);
        if (tResult.val) {
            resultado.val = temp.val;
            tree.children?.push(tResult.tree);
            const epResult = this.Ep(resultado);
            if (epResult.val) {
                tree.children?.push(epResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }

    private Ep(resultado: { val: number }): { val: boolean, tree: Nodo } {
        const token = this.AL.yylex();
        const tree: Nodo = { name: "E'", children: [] };
        const temp = { val: 0 };

        if (token === TOKEN.PLUS || token === TOKEN.MINUS) {
            const tResult = this.T(temp);
            if (tResult.val) {
                resultado.val += (token === TOKEN.PLUS ? temp.val : -temp.val);
                tree.children?.push(tResult.tree, { name: token === TOKEN.PLUS ? "+" : "-" });
                const epResult = this.Ep(resultado);
                if (epResult.val) {
                    tree.children?.push(epResult.tree);
                }
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        }
        this.AL.undoToken();
        tree.children?.push({ name: "ε" });
        return { val: true, tree: tree };
    }

    private T(resultado: { val: number }): { val: boolean, tree: Nodo } {
        const temp = { val: 0 };
        const tree: Nodo = { name: "T", children: [] };

        const fResult = this.F(temp);
        if (fResult.val) {
            resultado.val = temp.val;
            tree.children?.push(fResult.tree);
            const tpResult = this.Tp(resultado);
            if (tpResult.val) {
                tree.children?.push(tpResult.tree);
            }
            return { val: true, tree: tree };
        }
        return { val: false, tree: tree };
    }

    private Tp(resultado: { val: number }): { val: boolean, tree: Nodo } {
        const token = this.AL.yylex();
        const tree: Nodo = { name: "T'", children: [] };
        const temp = { val: 0 };

        if (token === TOKEN.PROD || token === TOKEN.DIV) {
            const fResult = this.F(temp);
            if (fResult.val) {
                resultado.val = token === TOKEN.PROD ? resultado.val * temp.val : resultado.val / temp.val;
                tree.children?.push(fResult.tree, { name: token === TOKEN.PROD ? "*" : "/" });
                const tpResult = this.Tp(resultado);
                if (tpResult.val) {
                    tree.children?.push(tpResult.tree);
                }
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        }
        this.AL.undoToken();
        tree.children?.push({ name: "ε" });
        return { val: true, tree: tree };
    }

    private F(resultado: { val: number }): { val: boolean, tree: Nodo } {
        const token = this.AL.yylex();
        const tree: Nodo = { name: "F", children: [] };

        if (token === TOKEN.LPAREN) {
            const eResult = this.E(resultado);
            if (eResult.val && this.AL.yylex() === TOKEN.RPAREN) {
                tree.children?.push({ name: "(" }, eResult.tree, { name: ")" });
                return { val: true, tree: tree };
            }
            return { val: false, tree: tree };
        } else if (token === TOKEN.NUM) {
            resultado.val = parseFloat(this.AL.getLexema());
            tree.children?.push({ name: "num", children: [{ name: `${resultado.val}` }] });
            return { val: true, tree: tree };
        }
        this.AL.undoToken();
        return { val: false, tree: tree };
    }

    private recorrerPostorden(nodo: Nodo): string {
        let resultado = "";

        if (nodo.children) {
            for (const child of nodo.children) {
                resultado += this.recorrerPostorden(child) + " ";
            }
        }

        if (nodo.name !== "E" && nodo.name !== "E'" && nodo.name !== "T" && nodo.name !== "T'" && nodo.name !== "F" && nodo.name !== "ε" && nodo.name !== "num" && nodo.name !== "(" && nodo.name !== ")") {
            resultado += nodo.name + " ";
        }

        return resultado.trim();
    }
}
