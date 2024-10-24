"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ER = void 0;
const Stack_1 = require("./tools/Stack");
const AFN_1 = require("./AFN");
/*
/   Operadores {
/       | : Union
/       . : Concatenacion
/       * : Cerradura de Kleene
/       + : Cerradura Positiva
/       ? : Cerradura Opcional
/       \ : Caracter para asegurar que el siguiente elemento es un caracter
/       [ : Inicio de rango de caracteres
/       ] : Fin de rango de caracteres
/       - : Separador de rango de caracteres
/       ( : Inicio de agrupacion
/       ) : Fin de agrupacion
/   }
/
/   Reglas {
/       1. Concatenacion implicita de caracteres => ab = a.b | abcd = a.b.c.d
/       2. Concatenacion implicita con el ultimo caracter con cerradura Kleene => ab* = a.b* | abcd* = a.b.c.d*
/       3. Concatenacion implicita con el ultimo caracter con cerradura positiva => ab+ = a.b+ | abcd+ = a.b.c.d+
/       4. Concatenacion implicita con el ultimo caracter con cerradura opcional => ab? = a.b? | abcd? = a.b.c.d?
/       5. Rango de caracteres => [a-z] = a|b|c|...|z
/       6. El rango de caracteres se considera una literal => D = [0-9]
/       7. Caracteres especiales => | . * + ? ( ) [ ] \
/       8. Prioridad de operadores => | > . > * = + = ?
/   }
/
*/
class ER {
    constructor(expression) {
        this.postFix = "";
        this.expression = expression;
        this.toPostFix();
    }
    priority(op) {
        switch (op) {
            case '|':
                return 1;
            case '.':
                return 2;
            default:
                return 0;
        }
    }
    greaterThan(op1, op2) {
        return this.priority(op1) <= this.priority(op2);
    }
    toPostFix() {
        //Pilas 
        const Symbol = new Stack_1.Stack();
        const Operator = new Stack_1.Stack();
        //Banderas
        let escaped = false;
        let PrevLiteral = false;
        let Range = false;
        //Solucion
        let solution = "";
        for (let c of this.expression) {
            if (Range) { //Rango de caracteres
                Symbol.push(c);
                if (c == ']') {
                    Range = false;
                }
                continue;
            }
            if (escaped) { //Caracteres especiales (.,|,*,+,?,(,),[,],\)
                Symbol.push(c);
                Symbol.push('\\');
                escaped = false;
                continue;
            }
            switch (c) { //Algoritmo para convertir a postfijo
                case '(':
                    PrevLiteral = false;
                    Operator.push(c);
                    break;
                case ')':
                    PrevLiteral = false;
                    while (Operator.size() != 0 && Operator.peek() != '(')
                        Symbol.push(Operator.pop());
                    Operator.pop();
                    break;
                case '.':
                case '|':
                    PrevLiteral = false;
                    if (this.greaterThan(Operator.peek(), c))
                        Operator.push(c);
                    else {
                        let aux = Operator.pop();
                        Operator.push(c);
                        Operator.push(aux);
                    }
                    break;
                case '\\':
                    escaped = true;
                    (!PrevLiteral) ? PrevLiteral = true : Operator.push('.');
                    break;
                case '[': //Rango de caracteres
                    Range = true;
                    Symbol.push(c);
                    (!PrevLiteral) ? PrevLiteral = true : Operator.push('.');
                    break;
                case '*':
                case '+':
                case '?':
                    PrevLiteral = false;
                    Symbol.push(c);
                    break;
                default:
                    (!PrevLiteral) ? PrevLiteral = true : Operator.push('.');
                    Symbol.push(c);
                    break;
            }
            /*console.log("with" + c)
            console.log(Symbol)
            console.log(Operator)*/
        }
        while (Operator.size() != 0) { //Vaciar pila de operadores
            if (Operator.peek() == '(')
                throw ("Parenthesis not match");
            Symbol.push(Operator.pop());
        }
        /*console.log("Final")
        console.log(Symbol)
        console.log(Operator)*/
        while (Symbol.size() != 0) //Construir solucion
            solution += (Symbol.pop());
        //console.log("PostOrder => " + postOrder);
        this.postFix = solution.split('').reverse().join(''); //Invertir la cadena
    }
    generateAFN(str) {
        if (str === undefined) { //Llamada inicial
            //Pila de caracteres
            const stPostFix = new Stack_1.Stack();
            for (let c of this.postFix)
                stPostFix.push(c);
            //Primer llamada
            return this.generateAFN(stPostFix);
        }
        else {
            //Variables auxiliares
            let x, y;
            let c = str.pop();
            //console.log("Caracter: " + c)
            switch (c) {
                case '.':
                    y = this.generateAFN(str);
                    x = this.generateAFN(str);
                    //console.log("Concatenacion IdAFN : " + x.idAFN + " con " + y.idAFN)
                    x.concatenacionAFN(y);
                    break;
                case '|':
                    x = this.generateAFN(str);
                    y = this.generateAFN(str);
                    //console.log("Unir IdAFN : " + x.idAFN + " con " + y.idAFN)
                    x.unirAFN(y);
                    break;
                case '*':
                    x = this.generateAFN(str);
                    x.cerraduraKleene();
                    //console.log("Cerradura Kleene idAFN : " + x.idAFN)
                    break;
                case '+':
                    x = this.generateAFN(str);
                    x.cerraduraPositiva();
                    //console.log("Cerradura Positiva idAFN : " + x.idAFN)
                    break;
                case '?':
                    x = this.generateAFN(str);
                    x.cerraduraOpcional();
                    //console.log("Cerradura Opcional idAFN : " + x.idAFN)
                    break;
                case '\\':
                    c = str.pop();
                    x = new AFN_1.AFN().creaAFNBasico(c);
                    //console.log("BasicoID =>" + x.idAFN + " con " + c)
                    break;
                case ']':
                    let fin = str.pop();
                    if (str.pop() != '-')
                        throw ('Invalid range');
                    let ini = str.pop();
                    if (str.pop() != '[')
                        throw ('Invalid range');
                    if (ini > fin)
                        throw ("Invalid range");
                    x = new AFN_1.AFN().creaAFNBasico(ini, fin);
                    break;
                default:
                    x = new AFN_1.AFN().creaAFNBasico(c);
                    //console.log("BasicoID =>" + x.idAFN + " con " + c)
                    break;
            }
            return x;
        }
    }
}
exports.ER = ER;
