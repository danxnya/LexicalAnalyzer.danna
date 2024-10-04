"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estado = void 0;
class Estado {
    constructor() {
        this.edoAcept1 = false;
        this.token1 = -1;
        this.idEstado1 = Estado.ContadorIdEstado++;
        this.trans1 = new Set();
        this.trans1.clear();
    }
    /*Getters y Setters
    Los getters y setters en TypeScript son métodos especiales que permiten
    acceder (get) y modificar (set) propiedades de una clase de manera controlada.
    
    Getters:
    - Se definen usando la palabra clave 'get'
    - No toman parámetros
    - Deben retornar un valor
    - Se acceden como si fueran propiedades, sin paréntesis

    Setters:
    - Se definen usando la palabra clave 'set'
    - Toman exactamente un parámetro
    - No retornan un valor
    - Se usan para asignar un valor a una propiedad

    Ejemplo:
      get nombre(): string {
        return this._nombre;
      }

      set nombre(nuevoNombre: string) {
        this._nombre = nuevoNombre;
      }

    Los getters y setters permiten:
    1. Encapsulación: controlar el acceso a las propiedades
    2. Validación: verificar valores antes de asignarlos
    3. Cálculos: realizar operaciones al obtener o establecer valores
    4. Notificaciones: ejecutar código adicional al cambiar una propiedad
    */
    // usamos get y set en IdEstado, EdoAcept, Token y Trans para obtener y establecer los valores de las propiedades
    get GetIdEstado() { return this.idEstado1; }
    set SetIdEstado(value) { this.idEstado1 = value; }
    get GetEdoAcept() { return this.edoAcept1; }
    set SetEdoAcept(value) { this.edoAcept1 = value; }
    get GetToken() { return this.token1; }
    set SetToken(value) { this.token1 = value; }
    get GetTrans() { return this.trans1; }
    set SetTrans(value) { this.trans1 = value; }
}
exports.Estado = Estado;
Estado.ContadorIdEstado = 0;
