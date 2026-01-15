/**
 * Interprets a mathematical formula by replacing variables with their values
 * @param formula - Mathematical formula as a string (e.g., 'x/1 + y')
 * @param where - Object mapping variable names to their numeric values (e.g., {x: 4, y: 6})
 * @returns The evaluated result of the formula
 */
export const formulaInterpreter = (formula: string, where: { [key: string]: number }): number => {
    // Replace each variable in the formula with its value from the where object
    let processedFormula = formula;

    for (const [variable, value] of Object.entries(where)) {
        // Use regex with word boundaries to replace only complete variable names
        const regex = new RegExp(`\\b${variable}\\b`, 'g');
        processedFormula = processedFormula.replace(regex, String(value));
    }

    // Evaluate the mathematical expression
    // Using Function constructor is safer than eval for mathematical expressions
    try {
        const result = new Function(`return ${processedFormula}`)();
        return result;
    } catch (error) {
        throw new Error(`Invalid formula or evaluation error: ${error instanceof Error ? error.message : String(error)}`);
    }
}