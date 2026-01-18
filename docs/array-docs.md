# Array Generators

## arrayWithBankNums

el objetivo de esta función, es generar un array basandose en un banco de números.

### Estructura de bankNums

```javascript
// example
bankNums: {
    1:3,
    2:3,
    3:3,
    4:3,
    5:3,
    6:3,
    7:3,
    8:3,
    9:3,
    10:3,
}
```

lo que nos dice el bankNums es que, en la construcción del array, se añadirá al azar alguno de los números, pero cada número solo puede estar la cantidad de veces que se indique en el bankNums.

por ejemplo, en el bankNums anterior, el número 1 puede estar 3 veces en el array, el número 2 puede estar 3 veces en el array, y así sucesivamente.

### Arrays 1D (una dimensión)

Para crear un array de una sola dimensión, se pasa un array con un solo valor en `dims`:

```typescript
const result = arrayWithBankNums(
    { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3 },
    [10] // Array de longitud 10
);
// Resultado posible: [2, 5, 1, 3, 4, 2, 5, 1, 3, 4]
```

### Arrays 2D (matrices)

Para crear un array de dos dimensiones (matriz), se pasan dos valores en `dims`: `[filas, columnas]`

```typescript
const matrix = arrayWithBankNums(
    { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
    [3, 4] // 3 filas x 4 columnas
);
// Resultado posible:
// [
//   [1, 3, 2, 5],
//   [4, 1, 6, 3],
//   [2, 5, 4, 6]
// ]
```

### Extra Rules

La función también acepta un tercer parámetro opcional `extraRules`, que es un callback para validaciones adicionales:

```typescript
// Solo permitir números pares
const evenOnly = arrayWithBankNums(
    { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
    [5],
    (num, arr) => num % 2 === 0
);
// Resultado posible: [2, 4, 6, 2, 4]

// No permitir números consecutivos repetidos
const noConsecutive = arrayWithBankNums(
    { 1: 2, 2: 2, 3: 2, 4: 2 },
    [6],
    (num, arr) => arr.length === 0 || arr[arr.length - 1] !== num
);
// Resultado posible: [1, 3, 2, 4, 1, 3]
```

### Ejemplo de array binario descombrimible creado con arrayWithBankNums
los esta función también se puede usar para crear arrays descomprimibles usando sus reglas y el sistema de banco de números.
un array binario descomrimible tendría como valor no valores si no, indices en donde se ubica uno de los valores del array en binario final.

* ejemplo de lógica:
para un array descomprimible tendríamos que conseguir las siguientes reglas:
~ 1- su banco de números deben ser por ejemplo del 1 al 6, y cada uno puede repetirse solamente 3 veces (para un array de 18 elementos)
~ 2- en una misma fila NO pueden repetirse un mismo número.
~ 3- en una fila no se pueden repetir números consecutivos en fila de 3, pero si en 2 (ej: [1,2,4,], [2,5,6], [1,3,5],) <-por ejemplo, pero no se podria tener [1,2,3,], [4,5,6], [2,3,4] <- así no
~ 4- no pueden haber 3 filas consecutivas que tengan el mismo número en la misma posición (ej: [1,3,5], [2,3,6], [2,3,6], aquí está incorrecto, pues el 3 está en una vez en cada una de las 3 filas consecutivas)
~ 5- la diferencia entre un número y el siguiente consecutivo en su fila no puede ser mayor a 4, ejemplo, de 1 no puede saltarse a 5 haciendo array como 1 0 0 0 1. esto solo se cuenta con su valor siguiente, es decir, el primer valor si puede ser 1 y el ultimo valor 6, siempre y cuando el número de en medio no tenga una diferencia de 4 entre ambos, por ejemplo, 1, 4, 6, ahí si se podría, pero no estaría permitido por ejemplo 1, 5, 6 o 1, 2, 6 ya que entre 1 y 5 hay 4 y entre 2 y 6 también hay 4.

~ 6- las secuencias de números dentro de las filas tiene que ir en un orden de menor a mayor, como por ejemplo, 1,3,5 o 2,4,6 
pero no 5, 1, 6, para que el punto anterior se pueda cumplor 

la razón de que un mimso número no puede estar más de una vez en una misma fila, es porque, el valor en la fila, reprsenta un úndice dentro de esa fila descomprimida si tenemos [1,2,2] en la fila 0, entonces al momento de buscar los indices de la fila 0 en el array descomprimido apuntaríamos 2 veces al mimso index, intentando añadir uno de los valores binarios al mismo lugar, lo que si sería posible sería [1,3,6] <- por ejemplo, ya que si se  le descomprimiera obtendríamos [1,0,1,0,0,1], asumiendo que los indices se empiezan a contar desde 1, en lugar desde 0.
