# Cosas a considerar basado en las diferencias de implementacion de C# y TypeScript

## 1. Uso de null
En C#, las variables de referencia pueden ser null, mientras que en TypeScript, las variables de referencia no pueden ser null. Esto significa que en TypeScript, todas las variables de referencia deben inicializarse con un valor válido, mientras que en C# puede haber variables de referencia que no apuntan a ningún objeto.

## 2. Uso de string fungiendo como char
Como no existe en TypeScript el tipo char, se usa el tipo string.

En la clase `Transicion` hay un posible problema:

Posible problema: En Java, el tipo char tiene un comportamiento bien definido para comparaciones. Sin embargo, en TypeScript, como estás usando string, la comparación se hace por el valor lexicográfico, lo que significa que la comparación de cadenas de más de un carácter puede no comportarse como esperas. Por ejemplo, "10" <= "2" es true en TypeScript, porque se compara lexicográficamente, no numéricamente.

## 3. Uso de sobrecarga de métodos

En C# se puede sobrecargar un método para que tenga diferentes implementaciones dependiendo del número y tipo de parámetros que se le pasen. En TypeScript no se puede sobrecargar un método, pero se puede simular la sobrecarga usando sobrecarga de funciones.

Posible problema: Al usar el método `transicion` se debe dejar como indefinida la funcion de en medio, **¿Eso causara problemas a futuro?** 

## 4. Metodo para unir Expresiones regulares y no perder los tokens

## 5. Clase Si interseccion para comparar y quitar las transición y en su lugar colocar el arreglo bidimensional

## 6. Analizador léxico



## 7. Verificar SimbolosEspeciales, omitir y fin
#### lilberia
npm install --save-dev @types/node
