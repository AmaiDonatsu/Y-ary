/**
 * Generates an array or matrix by randomly selecting numbers from a bank with occurrence limits.
 * 
 * @param bankNums - Object where keys are the numbers to use and values are the maximum 
 *                   number of times each number can appear in the array.
 *                   Example: { 1: 3, 2: 3, 3: 3 } means number 1 can appear up to 3 times,
 *                   number 2 can appear up to 3 times, etc.
 * 
 * @param dims - Array dimensions:
 *   - [length]: Creates a 1D array with the specified length
 *   - [rows, cols]: Creates a 2D array (matrix) with the specified rows and columns
 * 
 * @param extraRules - Optional validation callback that receives:
 *   - candidateNum: The number being considered for addition
 *   - currentArray: The flattened array built so far (for 2D arrays, this is all elements)
 *   Returns true to allow the number, false to reject it and try another.
 * 
 * @returns A 1D array or 2D array (matrix) of numbers randomly selected from bankNums,
 *          respecting occurrence limits and any extra validation rules.
 * 
 * @example
 * // Generate 1D array of length 5
 * const result1D = arrayWithBankNums(
 *   { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 },
 *   [5]
 * );
 * // Possible result: [3, 7, 1, 9, 2]
 * 
 * @example
 * // Generate 2D array (matrix) of 3 rows x 4 columns
 * const result2D = arrayWithBankNums(
 *   { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
 *   [3, 4]
 * );
 * // Possible result: [[1, 3, 2, 5], [4, 1, 6, 3], [2, 5, 4, 6]]
 * 
 * @example
 * // With extraRules: only allow even numbers
 * const result = arrayWithBankNums(
 *   { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
 *   [4],
 *   (num, arr) => num % 2 === 0
 * );
 * // Possible result: [2, 4, 6, 2]
 */
const arrayWithBankNums = (
    bankNums: { [n: number]: number },
    dims: number[],
    extraRules?: (candidateNum: number, currentArray: number[]) => boolean
): number[] | number[][] => {
    // Determine if we're creating a 1D or 2D array
    const is2D = dims.length === 2;
    const totalElements = is2D ? dims[0] * dims[1] : dims[0];

    const flatArray: number[] = [];

    // Track how many times each number has been used
    const usageCount: { [n: number]: number } = {};

    // Get available numbers from bankNums
    const availableNumbers = Object.keys(bankNums).map(Number);

    // Build flat array up to the total number of elements needed
    for (let i = 0; i < totalElements; i++) {
        let candidateNum: number | null = null;
        let attempts = 0;
        const maxAttempts = 1000; // Prevent infinite loops

        // Try to find a valid number
        while (candidateNum === null && attempts < maxAttempts) {
            attempts++;

            // Select a random number from available numbers
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const selectedNum = availableNumbers[randomIndex];

            // Check if this number hasn't exceeded its limit
            const currentUsage = usageCount[selectedNum] || 0;
            const maxUsage = bankNums[selectedNum];

            if (currentUsage >= maxUsage) {
                continue; // This number is exhausted, try another
            }

            // Apply extra rules if provided
            const passesExtraRules = extraRules ? extraRules(selectedNum, flatArray) : true;

            if (passesExtraRules) {
                candidateNum = selectedNum;
            }
        }

        // If we found a valid number, add it to the array
        if (candidateNum !== null) {
            flatArray.push(candidateNum);
            usageCount[candidateNum] = (usageCount[candidateNum] || 0) + 1;
        } else {
            // Could not find a valid number after max attempts
            console.warn(`Could not find valid number at position ${i} after ${maxAttempts} attempts`);
            break;
        }
    }

    // If 2D array requested, reshape the flat array into a matrix
    if (is2D) {
        const rows = dims[0];
        const cols = dims[1];
        const matrix: number[][] = [];

        for (let row = 0; row < rows; row++) {
            const rowArray: number[] = [];
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                if (index < flatArray.length) {
                    rowArray.push(flatArray[index]);
                }
            }
            matrix.push(rowArray);
        }

        return matrix;
    }

    // Return 1D array
    return flatArray;
};

export { arrayWithBankNums };