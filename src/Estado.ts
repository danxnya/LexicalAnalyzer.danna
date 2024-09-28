import { Transicion } from "./Transicion";

class Estado {
    private static ContadorIdEstado: number = 0;
    private idEstado1: number;
    private edoAcept1: boolean;
    private token1: number;
    private trans1: Set<Transicion>;

    constructor() {
        this.edoAcept1 = false;
        this.token1 = -1;
        this.idEstado1 = Estado.ContadorIdEstado++;
        this.trans1 = new Set<Transicion>();
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
    public get GetIdEstado(): number { return this.idEstado1; }
    public set SetIdEstado(value: number) { this.idEstado1 = value; }

    public get GetEdoAcept(): boolean { return this.edoAcept1; }
    public set SetEdoAcept(value: boolean) { this.edoAcept1 = value; }

    public get GetToken(): number { return this.token1; }
    public set SetToken(value: number) { this.token1 = value; }

    public get GetTrans(): Set<Transicion> { return this.trans1; }
    public set SetTrans(value: Set<Transicion>) { this.trans1 = value; }

}

export { Estado };
