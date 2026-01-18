# Array Generation Examples

Esta guía muestra ejemplos prácticos de cómo usar `arrayWithBankNums` con reglas de validación personalizadas para generar arrays y matrices con restricciones complejas.

---

## Ejemplo Básico: Array 1D Simple

```typescript
import { arrayWithBankNums } from 'y-ary';

// Generar array de 5 números del 1 al 10
// Cada número puede aparecer hasta 2 veces
const simpleArray = arrayWithBankNums(
    { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2 },
    [5]
);

console.log(simpleArray);
// Posible resultado: [3, 7, 1, 9, 2]
```

---

## Ejemplo con Reglas Pre-construidas

```typescript
import { arrayWithBankNums, onlyEven, inRange, and } from 'y-ary';

// Solo números pares entre 2 y 10
const evenArray = arrayWithBankNums(
    { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 },
    [6],
    and([onlyEven, inRange(2, 10)])
);

console.log(evenArray);
// Posible resultado: [2, 4, 6, 8, 2, 4]
```

---

## Ejemplo Avanzado: Matriz con Restricciones Complejas

Este ejemplo muestra cómo crear una matriz 6x3 (6 filas, 3 columnas) con múltiples restricciones:

### Requisitos:
- ✅ Matriz de 6 filas x 3 columnas
- ✅ Números del 1 al 6
- ✅ Cada número aparece exactamente 3 veces en toda la matriz
- ✅ **No pueden haber números consecutivos en la misma fila** (ej: 1,2 o 5,6)
- ✅ **No pueden haber 3 o más filas consecutivas que compartan el mismo número**

### Implementación:

```typescript
import { arrayWithBankNums, and, type ArrayRule } from 'y-ary';

// Regla 1: No números consecutivos en la misma fila
const noConsecutiveInRow: ArrayRule = (num, arr) => {
    const rowSize = 3;
    const positionInRow = arr.length % rowSize;
    
    // Si es la primera posición de la fila, permitir cualquier número
    if (positionInRow === 0) return true;
    
    // Obtener el último número agregado
    const lastNum = arr[arr.length - 1];
    
    // Rechazar si son consecutivos (diferencia de 1)
    return Math.abs(num - lastNum) !== 1;
};

// Regla 2: No más de 2 filas consecutivas con el mismo número
const noThreeRowsWithSameNumber: ArrayRule = (num, arr) => {
    const rowSize = 3;
    const totalRows = Math.floor(arr.length / rowSize);
    
    // Si tenemos menos de 2 filas completas, no hay problema
    if (totalRows < 2) return true;
    
    // Obtener las últimas 2 filas completas
    const lastTwoRows = arr.slice(-rowSize * 2);
    let rowsWithNumber = 0;
    
    // Verificar primera fila de las últimas 2
    const firstRow = lastTwoRows.slice(0, rowSize);
    if (firstRow.includes(num)) rowsWithNumber++;
    
    // Verificar segunda fila de las últimas 2
    const secondRow = lastTwoRows.slice(rowSize, rowSize * 2);
    if (secondRow.includes(num)) rowsWithNumber++;
    
    // Si ambas filas ya tienen este número, rechazar
    return rowsWithNumber < 2;
};

// Combinar ambas reglas
const complexRules = and([
    noConsecutiveInRow,
    noThreeRowsWithSameNumber
]);

// Generar la matriz
const matrix = arrayWithBankNums(
    { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
    [6, 3], // 6 filas x 3 columnas
    complexRules
);

console.log('Matriz generada:');
matrix.forEach((row, idx) => {
    console.log(`Fila ${idx + 1}: [${row.join(', ')}]`);
});
```

### Resultado Ejemplo:

```
Matriz generada:
Fila 1: [3, 5, 5]
Fila 2: [3, 6, 6]
Fila 3: [6, 4, 1]
Fila 4: [1, 3, 5]
Fila 5: [2, 2, 4]
Fila 6: [2, 4, 1]
```

### Validación del Resultado:

```typescript
// Verificar ocurrencias
const flatArray = matrix.flat();
const occurrences: { [key: number]: number } = {};
flatArray.forEach(num => {
    occurrences[num] = (occurrences[num] || 0) + 1;
});

console.log('\n📊 Ocurrencias:');
for (let i = 1; i <= 6; i++) {
    console.log(`Número ${i}: ${occurrences[i]} veces`);
}

// Verificar no consecutivos en filas
console.log('\n✓ Verificación de consecutivos:');
matrix.forEach((row, idx) => {
    let hasConsecutive = false;
    for (let i = 0; i < row.length - 1; i++) {
        if (Math.abs(row[i] - row[i + 1]) === 1) {
            hasConsecutive = true;
        }
    }
    console.log(`Fila ${idx + 1}: ${hasConsecutive ? '❌ Tiene consecutivos' : '✅ OK'}`);
});

// Verificar filas consecutivas con mismo número
console.log('\n✓ Verificación de filas consecutivas:');
for (let num = 1; num <= 6; num++) {
    let consecutiveCount = 0;
    let maxConsecutive = 0;
    
    matrix.forEach(row => {
        if (row.includes(num)) {
            consecutiveCount++;
            maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
        } else {
            consecutiveCount = 0;
        }
    });
    
    console.log(`Número ${num}: máximo ${maxConsecutive} filas consecutivas ${maxConsecutive < 3 ? '✅' : '❌'}`);
}
```

---

## Casos de Uso Comunes

### 1. Sudoku-like Constraints

```typescript
const sudokuRow: ArrayRule = (num, arr) => {
    const rowSize = 9;
    const currentRowStart = Math.floor(arr.length / rowSize) * rowSize;
    const currentRow = arr.slice(currentRowStart);
    return !currentRow.includes(num);
};
```

### 2. Balanced Distribution

```typescript
import { balanceEvenOdd } from 'y-ary';

const balanced = arrayWithBankNums(
    { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5 },
    [10],
    balanceEvenOdd(1) // Máximo 1 de diferencia entre pares e impares
);
```

### 3. Ascending Sequence

```typescript
import { ascending } from 'y-ary';

const ascendingArray = arrayWithBankNums(
    { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
    [5],
    ascending
);
// Posible resultado: [1, 2, 3, 4, 5]
```

### 4. No Duplicates

```typescript
import { noDuplicates } from 'y-ary';

const uniqueArray = arrayWithBankNums(
    { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1 },
    [6],
    noDuplicates
);
// Resultado: [3, 1, 5, 2, 6, 4] (todos diferentes)
```

---

## Tips y Mejores Prácticas

### 1. **Debugging de Reglas**

Si tu regla es muy restrictiva y no puede generar el array:

```typescript
const debugRule: ArrayRule = (num, arr) => {
    const result = yourComplexRule(num, arr);
    if (!result) {
        console.log(`Rechazado: ${num} en posición ${arr.length}`);
    }
    return result;
};
```

### 2. **Combinar Múltiples Reglas**

```typescript
import { and, or, not } from 'y-ary';

// Todas deben cumplirse
const allRules = and([rule1, rule2, rule3]);

// Al menos una debe cumplirse
const anyRule = or([rule1, rule2, rule3]);

// Invertir una regla
const notEven = not(onlyEven); // Solo impares
```

### 3. **Límite de Intentos**

La función tiene un límite de 1000 intentos por posición. Si tus reglas son muy restrictivas, considera:

- Aumentar los límites de ocurrencia en `bankNums`
- Simplificar las reglas
- Reducir el tamaño del array/matriz

---

## Recursos Adicionales

- [Lista completa de reglas pre-construidas](../array-docs.md)
- [Documentación de API](../basic-docs.md)
- [Tests de ejemplo](../../test/arrayTest.ts)


## orderedArrayWithBankNums
### Arrays Descomprimibles y Descompresión

Esta sección explica cómo generar **arrays comprimidos** con `orderedArrayWithBankNums` y descomprimirlos con `decompressRow` y `decompressMatrix`.

---

### ¿Qué es un Array Comprimido?

Un array comprimido almacena **índices** (1-based) que representan posiciones con valor `true` en un array binario. Esto reduce significativamente el espacio de almacenamiento.

**Ejemplo:**
```
Comprimido:   [1, 3, 5]     (3 números)
Descomprimido: [true, false, true, false, true, false]  (6 booleanos)
```

---

### Funciones Disponibles

```typescript
import { 
    orderedArrayWithBankNums,  // Genera arrays comprimidos
    decompressRow,             // Descomprime una fila
    decompressMatrix           // Descomprime matriz completa
} from 'y-ary';
```

---

### Ejemplo Completo: Matriz de Índices Binary

**Objetivo:** Crear una matriz 6x3 donde cada fila representa índices de un array binario de tamaño 6.

#### Paso 1: Definir las Reglas

```typescript
import { orderedArrayWithBankNums, decompressMatrix, and, type ArrayRule } from 'y-ary';

const ROW_SIZE = 3;

// Helpers
const getRow = (len: number) => Math.floor(len / ROW_SIZE);
const getPosInRow = (len: number) => len % ROW_SIZE;

// Regla: No repetir números en la misma fila
const noRepeatInRow: ArrayRule = (num, arr) => {
    const pos = getPosInRow(arr.length);
    if (pos === 0) return true;
    const rowStart = getRow(arr.length) * ROW_SIZE;
    return !arr.slice(rowStart).includes(num);
};

// Regla: No 3 números consecutivos (ej: 1,2,3)
const noThreeConsecutive: ArrayRule = (num, arr) => {
    const pos = getPosInRow(arr.length);
    if (pos < 2) return true;
    const start = getRow(arr.length) * ROW_SIZE;
    return !(arr[start + 1] === arr[start] + 1 && num === arr[start + 1] + 1);
};

// Regla: Diferencia máxima de 4 entre consecutivos
const maxDiff4: ArrayRule = (num, arr) => {
    const pos = getPosInRow(arr.length);
    if (pos === 0) return true;
    return Math.abs(num - arr[arr.length - 1]) <= 4;
};

// Combinar reglas
const rules = and([noRepeatInRow, noThreeConsecutive, maxDiff4]);
```

#### Paso 2: Generar la Matriz Comprimida

```typescript
const compressedMatrix = orderedArrayWithBankNums(
    { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 }, // Cada número máximo 3 veces
    [6, 3],                                  // 6 filas x 3 columnas
    rules
);

console.log('Matriz Comprimida:', compressedMatrix);
// Resultado ejemplo:
// [[3, 4, 6], [3, 5, 6], [1, 2, 5], [2, 4, 6], [1, 3, 5], [1, 2, 4]]
```

#### Paso 3: Descomprimir la Matriz

```typescript
// Descomprimir toda la matriz
const booleanMatrix = decompressMatrix(compressedMatrix, 6);

console.log('Matriz Descomprimida:');
booleanMatrix.forEach((row, i) => {
    console.log(`Fila ${i + 1}:`, row);
});
// Resultado:
// Fila 1: [false, false, true, true, false, true]
// Fila 2: [false, false, true, false, true, true]
// ...
```

---

### API de Descompresión

#### `decompressRow(compressedRow, size)`

Descomprime una sola fila de índices a array de booleanos.

```typescript
import { decompressRow } from 'y-ary';

const compressed = [1, 3, 6];
const decompressed = decompressRow(compressed, 6);
// → [true, false, true, false, false, true]

// Índice 1 → posición 0 = true
// Índice 3 → posición 2 = true  
// Índice 6 → posición 5 = true
```

#### `decompressMatrix(compressedMatrix, rowSize)`

Descomprime una matriz completa.

```typescript
import { decompressMatrix } from 'y-ary';

const compressed = [
    [1, 3, 5],
    [2, 4, 6],
    [1, 4, 5]
];

const decompressed = decompressMatrix(compressed, 6);
// [
//   [true, false, true, false, true, false],
//   [false, true, false, true, false, true],
//   [true, false, false, true, true, false]
// ]
```

---

### Diferencia con `arrayWithBankNums`

| Característica | `arrayWithBankNums` | `orderedArrayWithBankNums` |
|----------------|---------------------|---------------------------|
| Selección | Aleatoria | Ordenada + Backtracking |
| Orden en fila | No garantizado | **Ascendente garantizado** |
| Para arrays binarios | ❌ | ✅ |
| Reglas complejas | Limitado | ✅ Soporta todas |

---

### Casos de Uso

1. **Almacenamiento eficiente**: Guardar 3 índices en lugar de 6 booleanos
2. **Compresión de datos binarios**: Matrices de presencia/ausencia
3. **Generación de patrones**: Crear patrones únicos con restricciones
4. **Ejercicios de memoria**: Generar secuencias para juegos cognitivos

---

### Notas Importantes

> **⚠️ Los índices son 1-based**
> - `[1, 3, 5]` se refiere a posiciones 1, 3 y 5 (no 0, 2, 4)
> - Al descomprimir, índice 1 → posición 0, índice 2 → posición 1, etc.

> **💡 Backtracking Automático**
> - `orderedArrayWithBankNums` usa backtracking para encontrar soluciones válidas
> - Si las restricciones son muy estrictas, puede intentar hasta 50 combinaciones diferentes