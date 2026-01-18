/**
 * Y-ary package entry point
 * Export your public API here
 */

export function hello(name: string): string {
    return `Hello, ${name}!`;
}

// Export formula interpreter
export { formulaInterpreter } from './formulas/formulaInterpreter';

// Export array generation
export { arrayWithBankNums, orderedArrayWithBankNums } from './algorithms/arrayGens';

// Export all array validation rules
export * from './algorithms/arrayRules';

// Export types
export type { };
