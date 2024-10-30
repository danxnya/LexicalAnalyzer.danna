"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AFN_1 = require("./AFN");
const AnalizadorLexico_1 = require("./AnalizadorLexico");
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
        this.setER(sigma);
        this.AL.SetSigma(sigma);
    }
    setER(sigma) {
        this.ER = sigma;
        this.AL.SetSigma(sigma);
    }
    Parse() {
        const f = new AFN_1.AFN();
        let token;
        console.log("Entre a parse");
        if (this.E(f)) {
            token = this.AL.yylex();
            console.log("\tToken: ", token);
            if (token === TOKEN.END) {
                this.result = f;
                return true;
            }
        }
        return false;
    }
    E(f) {
        console.log("Entre a E");
        if (this.T(f)) {
            if (this.Ep(f)) {
                return true;
            }
        }
        return false;
    }
    Ep(f) {
        console.log("Entre a Ep");
        const token = this.AL.yylex();
        console.log("\tToken: ", token);
        if (token === TOKEN.OR) {
            if (this.T(f)) {
                const f1 = new AFN_1.AFN();
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
    T(f) {
        console.log("Entre a T");
        if (this.C(f)) {
            if (this.Tp(f)) {
                return true;
            }
        }
        return false;
    }
    Tp(f) {
        console.log("Entre a Tp");
        const token = this.AL.yylex();
        console.log("\tToken: ", token);
        if (token === TOKEN.CONCAT) {
            if (this.C(f)) {
                const f1 = new AFN_1.AFN();
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
    C(f) {
        console.log("Entre a C");
        if (this.F(f)) {
            if (this.Cp(f)) {
                return true;
            }
        }
        return false;
    }
    Cp(f) {
        console.log("Entre a Cp");
        const token = this.AL.yylex();
        console.log("\tToken: ", token);
        switch (token) {
            case TOKEN.CERRPOS:
                if (this.Cp(f)) {
                    f.cerraduraPositiva();
                    return true;
                }
                return false;
                break;
            case TOKEN.CERRKLEEN:
                if (this.Cp(f)) {
                    f.cerraduraKleene();
                    return true;
                }
                return false;
                break;
            case TOKEN.CERROPC:
                if (this.Cp(f)) {
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
    F(f) {
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
    test() {
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
const ER = new ExpresionRegular();
ER.test();
