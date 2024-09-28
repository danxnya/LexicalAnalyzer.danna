# Cosas a considerar basado en las diferencias de implementacion de C# y TypeScript

## 1. Uso de null
En C#, las variables de referencia pueden ser null, mientras que en TypeScript, las variables de referencia no pueden ser null. Esto significa que en TypeScript, todas las variables de referencia deben inicializarse con un valor válido, mientras que en C# puede haber variables de referencia que no apuntan a ningún objeto.

## 2. Uso de string fungiendo como char
Como no existe en TypeScript el tipo char, se usa el tipo string.

En la clase `Transicion` hay un posible problema:

Posible problema: En Java, el tipo char tiene un comportamiento bien definido para comparaciones. Sin embargo, en TypeScript, como estás usando string, la comparación se hace por el valor lexicográfico, lo que significa que la comparación de cadenas de más de un carácter puede no comportarse como esperas. Por ejemplo, "10" <= "2" es true en TypeScript, porque se compara lexicográficamente, no numéricamente.