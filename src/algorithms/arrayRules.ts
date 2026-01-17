/**
 * Array Rules - Colección de funciones de validación para usar con arrayWithBankNums
 * 
 * Estas funciones pueden ser usadas como el parámetro `extraRules` en arrayWithBankNums
 * para aplicar restricciones adicionales durante la generación del array.
 */

/**
 * Type definition for array rule functions
 */
export type ArrayRule = (candidateNum: number, currentArray: number[]) => boolean;

// ============================================================================
// REGLAS BÁSICAS DE PARIDAD
// ============================================================================

/**
 * Solo permite números pares
 * @example arrayWithBankNums(bankNums, [5], onlyEven)
 */
export const onlyEven: ArrayRule = (num) => num % 2 === 0;

/**
 * Solo permite números impares
 * @example arrayWithBankNums(bankNums, [5], onlyOdd)
 */
export const onlyOdd: ArrayRule = (num) => num % 2 !== 0;

// ============================================================================
// REGLAS DE RANGO
// ============================================================================

/**
 * Crea una regla que solo permite números dentro de un rango específico
 * @param min - Valor mínimo (inclusivo)
 * @param max - Valor máximo (inclusivo)
 * @example arrayWithBankNums(bankNums, [5], inRange(1, 5))
 */
export const inRange = (min: number, max: number): ArrayRule => {
    return (num) => num >= min && num <= max;
};

/**
 * Crea una regla que excluye números dentro de un rango específico
 * @param min - Valor mínimo a excluir (inclusivo)
 * @param max - Valor máximo a excluir (inclusivo)
 * @example arrayWithBankNums(bankNums, [5], notInRange(3, 7))
 */
export const notInRange = (min: number, max: number): ArrayRule => {
    return (num) => num < min || num > max;
};

// ============================================================================
// REGLAS DE REPETICIÓN
// ============================================================================

/**
 * No permite números consecutivos repetidos
 * @example arrayWithBankNums(bankNums, [5], noConsecutiveRepeats)
 */
export const noConsecutiveRepeats: ArrayRule = (num, arr) => {
    if (arr.length === 0) return true;
    return arr[arr.length - 1] !== num;
};

/**
 * No permite que un número aparezca más de N veces en el array
 * @param maxCount - Número máximo de veces que puede aparecer
 * @example arrayWithBankNums(bankNums, [10], maxOccurrences(2))
 */
export const maxOccurrences = (maxCount: number): ArrayRule => {
    return (num, arr) => {
        const count = arr.filter(n => n === num).length;
        return count < maxCount;
    };
};

/**
 * No permite duplicados en el array (cada número solo puede aparecer una vez)
 * @example arrayWithBankNums(bankNums, [5], noDuplicates)
 */
export const noDuplicates: ArrayRule = (num, arr) => {
    return !arr.includes(num);
};

/**
 * No permite que el mismo número aparezca en las últimas N posiciones
 * @param positions - Número de posiciones a verificar
 * @example arrayWithBankNums(bankNums, [10], noRepeatInLast(3))
 */
export const noRepeatInLast = (positions: number): ArrayRule => {
    return (num, arr) => {
        const lastN = arr.slice(-positions);
        return !lastN.includes(num);
    };
};

// ============================================================================
// REGLAS DE SUMA Y PROMEDIO
// ============================================================================

/**
 * Solo permite números que mantengan la suma total por debajo de un límite
 * @param maxSum - Suma máxima permitida
 * @example arrayWithBankNums(bankNums, [5], sumLessThan(20))
 */
export const sumLessThan = (maxSum: number): ArrayRule => {
    return (num, arr) => {
        const currentSum = arr.reduce((sum, n) => sum + n, 0);
        return currentSum + num < maxSum;
    };
};

/**
 * Solo permite números que mantengan la suma total por encima de un límite
 * @param minSum - Suma mínima requerida
 * @example arrayWithBankNums(bankNums, [5], sumGreaterThan(10))
 */
export const sumGreaterThan = (minSum: number): ArrayRule => {
    return (num, arr) => {
        const currentSum = arr.reduce((sum, n) => sum + n, 0);
        return currentSum + num > minSum;
    };
};

/**
 * Solo permite números que mantengan el promedio dentro de un rango
 * @param min - Promedio mínimo
 * @param max - Promedio máximo
 * @example arrayWithBankNums(bankNums, [5], averageInRange(3, 7))
 */
export const averageInRange = (min: number, max: number): ArrayRule => {
    return (num, arr) => {
        if (arr.length === 0) return true;
        const newSum = arr.reduce((sum, n) => sum + n, 0) + num;
        const newAverage = newSum / (arr.length + 1);
        return newAverage >= min && newAverage <= max;
    };
};

// ============================================================================
// REGLAS DE SECUENCIA Y PATRÓN
// ============================================================================

/**
 * Solo permite números que sean mayores que el último número en el array (orden ascendente)
 * @example arrayWithBankNums(bankNums, [5], ascending)
 */
export const ascending: ArrayRule = (num, arr) => {
    if (arr.length === 0) return true;
    return num > arr[arr.length - 1];
};

/**
 * Solo permite números que sean menores que el último número en el array (orden descendente)
 * @example arrayWithBankNums(bankNums, [5], descending)
 */
export const descending: ArrayRule = (num, arr) => {
    if (arr.length === 0) return true;
    return num < arr[arr.length - 1];
};

/**
 * Solo permite números que sean diferentes del último número (no estrictamente ascendente/descendente)
 * @example arrayWithBankNums(bankNums, [5], different)
 */
export const different: ArrayRule = (num, arr) => {
    if (arr.length === 0) return true;
    return num !== arr[arr.length - 1];
};

/**
 * Alterna entre números pares e impares
 * @example arrayWithBankNums(bankNums, [6], alternateEvenOdd)
 */
export const alternateEvenOdd: ArrayRule = (num, arr) => {
    if (arr.length === 0) return true;
    const lastWasEven = arr[arr.length - 1] % 2 === 0;
    const currentIsEven = num % 2 === 0;
    return lastWasEven !== currentIsEven;
};

// ============================================================================
// REGLAS DE DIVISIBILIDAD
// ============================================================================

/**
 * Solo permite números divisibles por un divisor específico
 * @param divisor - El divisor
 * @example arrayWithBankNums(bankNums, [5], divisibleBy(3))
 */
export const divisibleBy = (divisor: number): ArrayRule => {
    return (num) => num % divisor === 0;
};

/**
 * Solo permite números que NO sean divisibles por un divisor específico
 * @param divisor - El divisor
 * @example arrayWithBankNums(bankNums, [5], notDivisibleBy(5))
 */
export const notDivisibleBy = (divisor: number): ArrayRule => {
    return (num) => num % divisor !== 0;
};

// ============================================================================
// REGLAS DE POSICIÓN
// ============================================================================

/**
 * Aplica diferentes reglas según la posición en el array
 * @param rules - Objeto que mapea índices a reglas
 * @example arrayWithBankNums(bankNums, [5], byPosition({ 0: onlyEven, 1: onlyOdd }))
 */
export const byPosition = (rules: { [index: number]: ArrayRule }): ArrayRule => {
    return (num, arr) => {
        const position = arr.length;
        const rule = rules[position];
        return rule ? rule(num, arr) : true;
    };
};

/**
 * Aplica una regla solo en posiciones pares (0, 2, 4, ...)
 * @param rule - La regla a aplicar
 * @example arrayWithBankNums(bankNums, [6], onEvenPositions(onlyEven))
 */
export const onEvenPositions = (rule: ArrayRule): ArrayRule => {
    return (num, arr) => {
        const position = arr.length;
        return position % 2 === 0 ? rule(num, arr) : true;
    };
};

/**
 * Aplica una regla solo en posiciones impares (1, 3, 5, ...)
 * @param rule - La regla a aplicar
 * @example arrayWithBankNums(bankNums, [6], onOddPositions(onlyOdd))
 */
export const onOddPositions = (rule: ArrayRule): ArrayRule => {
    return (num, arr) => {
        const position = arr.length;
        return position % 2 !== 0 ? rule(num, arr) : true;
    };
};

// ============================================================================
// COMBINADORES DE REGLAS
// ============================================================================

/**
 * Combina múltiples reglas con AND (todas deben cumplirse)
 * @param rules - Array de reglas a combinar
 * @example arrayWithBankNums(bankNums, [5], and([onlyEven, inRange(2, 8)]))
 */
export const and = (rules: ArrayRule[]): ArrayRule => {
    return (num, arr) => {
        return rules.every(rule => rule(num, arr));
    };
};

/**
 * Combina múltiples reglas con OR (al menos una debe cumplirse)
 * @param rules - Array de reglas a combinar
 * @example arrayWithBankNums(bankNums, [5], or([onlyEven, divisibleBy(3)]))
 */
export const or = (rules: ArrayRule[]): ArrayRule => {
    return (num, arr) => {
        return rules.some(rule => rule(num, arr));
    };
};

/**
 * Invierte una regla (NOT)
 * @param rule - La regla a invertir
 * @example arrayWithBankNums(bankNums, [5], not(onlyEven)) // Solo impares
 */
export const not = (rule: ArrayRule): ArrayRule => {
    return (num, arr) => {
        return !rule(num, arr);
    };
};

// ============================================================================
// REGLAS AVANZADAS
// ============================================================================

/**
 * Solo permite números primos
 * @example arrayWithBankNums(bankNums, [5], onlyPrimes)
 */
export const onlyPrimes: ArrayRule = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

/**
 * Solo permite números que sean cuadrados perfectos
 * @example arrayWithBankNums(bankNums, [5], onlySquares)
 */
export const onlySquares: ArrayRule = (num) => {
    const sqrt = Math.sqrt(num);
    return sqrt === Math.floor(sqrt);
};

/**
 * Asegura que la diferencia entre números consecutivos no exceda un límite
 * @param maxDiff - Diferencia máxima permitida
 * @example arrayWithBankNums(bankNums, [5], maxDifference(3))
 */
export const maxDifference = (maxDiff: number): ArrayRule => {
    return (num, arr) => {
        if (arr.length === 0) return true;
        const diff = Math.abs(num - arr[arr.length - 1]);
        return diff <= maxDiff;
    };
};

/**
 * Asegura que la diferencia entre números consecutivos sea al menos un mínimo
 * @param minDiff - Diferencia mínima requerida
 * @example arrayWithBankNums(bankNums, [5], minDifference(2))
 */
export const minDifference = (minDiff: number): ArrayRule => {
    return (num, arr) => {
        if (arr.length === 0) return true;
        const diff = Math.abs(num - arr[arr.length - 1]);
        return diff >= minDiff;
    };
};

/**
 * Mantiene un balance entre números pares e impares
 * @param maxImbalance - Diferencia máxima permitida entre cantidad de pares e impares
 * @example arrayWithBankNums(bankNums, [10], balanceEvenOdd(2))
 */
export const balanceEvenOdd = (maxImbalance: number = 1): ArrayRule => {
    return (num, arr) => {
        const evenCount = arr.filter(n => n % 2 === 0).length;
        const oddCount = arr.length - evenCount;
        const isEven = num % 2 === 0;

        if (isEven) {
            return (evenCount + 1) - oddCount <= maxImbalance;
        } else {
            return (oddCount + 1) - evenCount <= maxImbalance;
        }
    };
};

/**
 * Solo permite números en posiciones específicas del array
 * @param allowedPositions - Array de posiciones permitidas (0-indexed)
 * @param value - El valor que solo puede aparecer en esas posiciones
 * @example arrayWithBankNums(bankNums, [5], valueAtPositions([0, 2, 4], 7))
 */
export const valueAtPositions = (allowedPositions: number[], value: number): ArrayRule => {
    return (num, arr) => {
        const currentPosition = arr.length;
        if (num === value) {
            return allowedPositions.includes(currentPosition);
        }
        return true;
    };
};
