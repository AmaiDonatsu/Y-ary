/**
 * Y-ary package entry point
 * Export your public API here
 */

export function hello(name: string): string {
    return `Hello, ${name}!`;
}

// Export formula interpreter
export { formulaInterpreter } from './formulas/formulaInterpreter';

// Export types
export type { };
