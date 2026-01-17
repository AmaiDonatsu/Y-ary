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
