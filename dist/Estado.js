"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Estado = void 0;
class Estado {
    constructor() {
        this.edoAcept = false;
        this.token = -1;
        this.idEstado = Estado.ContadorIdEstado++;
        this.trans = new Set();
        this.trans.clear();
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
    get GetIdEstado() { return this.idEstado; }
    set SetIdEstado(value) { this.idEstado = value; }
    get GetEdoAcept() { return this.edoAcept; }
    set SetEdoAcept(value) { this.edoAcept = value; }
    get GetToken() { return this.token; }
    set SetToken(value) { this.token = value; }
    get GetTrans() { return this.trans; }
    set SetTrans(value) { this.trans = value; }
}
exports.Estado = Estado;
Estado.ContadorIdEstado = 0;
