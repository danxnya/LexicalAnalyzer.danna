"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const AFN_1 = require("./AFN");
const AnalizadorLexico_1 = require("./AnalizadorLexico");
const fs = __importStar(require("fs"));
//! Refactorizar si hay tiempo
var TOKEN;
(function (TOKEN) {
    TOKEN[TOKEN["OR"] = 10] = "OR";
    TOKEN[TOKEN["CONCAT"] = 20] = "CONCAT";
    TOKEN[TOKEN["CERRPOS"] = 30] = "CERRPOS";
    TOKEN[TOKEN["CERRKLEEN"] = 40] = "CERRKLEEN";
    TOKEN[TOKEN["CERROPC"] = 50] = "CERROPC";
    TOKEN[TOKEN["LPAREN"] = 60] = "LPAREN";
    TOKEN[TOKEN["SPACE"] = 70] = "SPACE";
    TOKEN[TOKEN["RPAREN"] = 80] = "RPAREN";
    TOKEN[TOKEN["LCORCH"] = 90] = "LCORCH";
    TOKEN[TOKEN["RCORCH"] = 100] = "RCORCH";
    TOKEN[TOKEN["DASH"] = 110] = "DASH";
    TOKEN[TOKEN["SIMB"] = 120] = "SIMB";
    TOKEN[TOKEN["END"] = 0] = "END";
})(TOKEN || (TOKEN = {}));
class ExpresionRegular {
    constructor(sigma) {
        this.AL = new AnalizadorLexico_1.AnalizadorLexico('./afd.json');
        this.result = new AFN_1.AFN();
        this.ER = "";
        sigma = sigma || "";
        this.tree = { name: "" };
        this.setER(sigma);
        this.AL.SetSigma(sigma);
    }
    getTree() {
        return this.tree;
    }
    getResult() {
        return this.result;
    }
    getER() {
        return this.ER;
    }
    setER(sigma) {
        this.ER = sigma;
        this.AL.SetSigma(sigma);
    }
    Parse() {
        const f = new AFN_1.AFN();
        //console.log("Entre a parse");
        const child = [];
        if (this.E(f, child)) {
            this.tree.name = "E";
            this.tree.children = child;
            const token = this.AL.yylex();
            if (token === TOKEN.END) {
                this.result = f;
                return true;
            }
        }
        return false;
    }
    E(f, father) {
        console.log("Entre a E");
        const childT = [];
        if (this.T(f, childT)) {
            father.push({ name: "T", children: childT });
            const childEp = [];
            if (this.Ep(f, childEp)) {
                father.push({ name: "Ep", children: childEp });
                return true;
            }
        }
        return false;
    }
    Ep(f, father) {
        //console.log("Entre a Ep");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        if (token === TOKEN.OR) {
            father.push({ name: "OR" });
            const childT = [];
            if (this.T(f, childT)) {
                father.push({ name: "T", children: childT });
                const f1 = new AFN_1.AFN();
                const childEP = [];
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
    T(f, father) {
        //console.log("Entre a T");
        const childF = [];
        if (this.C(f, childF)) {
            father.push({ name: "C", children: childF });
            const childTp = [];
            if (this.Tp(f, childTp)) {
                father.push({ name: "Tp", children: childTp });
                return true;
            }
        }
        return false;
    }
    Tp(f, father) {
        //console.log("Entre a Tp");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        if (token === TOKEN.CONCAT) {
            father.push({ name: "&" });
            const childC = [];
            if (this.C(f, childC)) {
                father.push({ name: "C", children: childC });
                const f1 = new AFN_1.AFN();
                const childTp = [];
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
    C(f, father) {
        //console.log("Entre a C");
        const childF = [];
        if (this.F(f, childF)) {
            father.push({ name: "F", children: childF });
            const childCp = [];
            if (this.Cp(f, childCp)) {
                father.push({ name: "Cp", children: childCp });
                return true;
            }
        }
        return false;
    }
    Cp(f, father) {
        //console.log("Entre a Cp");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        switch (token) {
            case TOKEN.CERRPOS:
                father.push({ name: "+" });
                const childCpPos = [];
                if (this.Cp(f, childCpPos)) {
                    father.push({ name: "Cp", children: childCpPos });
                    f.cerraduraPositiva();
                    return true;
                }
                return false;
                break;
            case TOKEN.CERRKLEEN:
                father.push({ name: "*" });
                const childCpKleen = [];
                if (this.Cp(f, childCpKleen)) {
                    father.push({ name: "Cp", children: childCpKleen });
                    f.cerraduraKleene();
                    return true;
                }
                return false;
                break;
            case TOKEN.CERROPC:
                father.push({ name: "?" });
                const childCpOpc = [];
                if (this.Cp(f, childCpOpc)) {
                    father.push({ name: "Cp", children: childCpOpc });
                    f.cerraduraOpcional();
                    return true;
                }
                return false;
                break;
            default:
                this.AL.undoToken();
                return true;
        }
    }
    F(f, father) {
        //console.log("Entre a F");
        const token = this.AL.yylex();
        //console.log("\tToken: ", token);
        switch (token) {
            case TOKEN.LPAREN:
                father.push({ name: "(" });
                const childE = [];
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
    test() {
        console.log("Test1--------------------------------------------------");
        this.setER('[ -%]OR\'                OR[,->]OR[@-Z]OR[^-■]');
        if (this.Parse()) {
            console.log("AFN generado");
            this.result.imprimirAFN();
        }
        guardarArbolConResultado(this.getTree(), "test1.json");
        console.log("Test2--------------------------------------------------");
        this.setER('(]');
        if (this.Parse()) {
            console.log("AFN generado");
            this.result.imprimirAFN();
        }
        console.log(this.getTree());
    }
}
const data = [];
function guardarArbolConResultado(tree, nombreArchivo) {
    const nuevoArbol = { tree };
    data.push(nuevoArbol); // Agregar el nuevo árbol al arreglo en memoria
    fs.writeFileSync(nombreArchivo, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Árbol y resultado guardados en ${nombreArchivo}`);
}
const ER = new ExpresionRegular();
ER.test();
