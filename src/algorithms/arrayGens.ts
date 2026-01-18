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
    const is2D = dims.length === 2;
    const totalElements = is2D ? dims[0] * dims[1] : dims[0];

    const flatArray: number[] = [];
    const usageCount: { [n: number]: number } = {};
    const availableNumbers = Object.keys(bankNums).map(Number);

    for (let i = 0; i < totalElements; i++) {
        let candidateNum: number | null = null;
        let attempts = 0;
        const maxAttempts = 1000;

        while (candidateNum === null && attempts < maxAttempts) {
            attempts++;
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const selectedNum = availableNumbers[randomIndex];
            const currentUsage = usageCount[selectedNum] || 0;
            const maxUsage = bankNums[selectedNum];

            if (currentUsage >= maxUsage) {
                continue;
            }

            const passesExtraRules = extraRules ? extraRules(selectedNum, flatArray) : true;
            if (passesExtraRules) {
                candidateNum = selectedNum;
            }
        }

        if (candidateNum !== null) {
            flatArray.push(candidateNum);
            usageCount[candidateNum] = (usageCount[candidateNum] || 0) + 1;
        } else {
            console.warn(`Could not find valid number at position ${i} after ${maxAttempts} attempts`);
            break;
        }
    }

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

    return flatArray;
};

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Generates an array or matrix with ORDERED selection from a bank of numbers.
 * Unlike arrayWithBankNums (which selects randomly), this function uses backtracking
 * to ensure ascending order within each row while respecting all constraints.
 * 
 * Key difference: Each row starts fresh for ordering purposes, allowing patterns like:
 * - Row 1: [1, 4, 5]
 * - Row 2: [1, 2, 5]  (starts from 1 again, not continuation)
 * 
 * @param bankNums - Object where keys are the numbers to use and values are the maximum 
 *                   number of times each number can appear in the array.
 * 
 * @param dims - Array dimensions:
 *   - [length]: Creates a 1D array with the specified length
 *   - [rows, cols]: Creates a 2D array (matrix) with the specified rows and columns
 * 
 * @param extraRules - Optional validation callback that receives:
 *   - candidateNum: The number being considered for addition
 *   - currentArray: The flattened array built so far
 *   - rowSize: The size of each row (for 2D arrays) or total length (for 1D)
 *   Returns true to allow the number, false to reject it.
 * 
 * @returns A 1D array or 2D array (matrix) with ascending numbers per row.
 * 
 * @example
 * // Generate 2D array with ascending order per row
 * const result = orderedArrayWithBankNums(
 *   { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
 *   [6, 3]
 * );
 * // Possible result: [[1,3,5], [2,4,6], [1,4,5], ...]
 */
const orderedArrayWithBankNums = (
    bankNums: { [n: number]: number },
    dims: number[],
    extraRules?: (candidateNum: number, currentArray: number[], rowSize: number) => boolean
): number[] | number[][] => {
    const is2D = dims.length === 2;
    const rowSize = is2D ? dims[1] : dims[0];
    const totalElements = is2D ? dims[0] * dims[1] : dims[0];

    const sortedNumbers = Object.keys(bankNums).map(Number).sort((a, b) => a - b);

    // Recursive backtracking solver
    function solve(
        flatArray: number[],
        usageCount: { [n: number]: number }
    ): number[] | null {
        if (flatArray.length === totalElements) {
            return flatArray;
        }

        const posInRow = flatArray.length % rowSize;
        const minValue = posInRow === 0 ? -Infinity : flatArray[flatArray.length - 1];

        const candidates = sortedNumbers.filter(num => {
            const usage = usageCount[num] || 0;
            return usage < bankNums[num] && num > minValue;
        });

        const shuffled = shuffleArray([...candidates]);

        for (const num of shuffled) {
            if (extraRules && !extraRules(num, flatArray, rowSize)) {
                continue;
            }

            const newArray = [...flatArray, num];
            const newUsage = { ...usageCount, [num]: (usageCount[num] || 0) + 1 };

            const result = solve(newArray, newUsage);
            if (result !== null) {
                return result;
            }
        }

        return null;
    }

    let result: number[] | null = null;
    for (let attempt = 0; attempt < 50 && result === null; attempt++) {
        result = solve([], {});
    }

    if (result === null) {
        console.warn('Could not generate valid array with given constraints');
        result = [];
    }

    if (is2D && result.length > 0) {
        const matrix: number[][] = [];
        const cols = dims[1];

        for (let row = 0; row < dims[0]; row++) {
            const rowArray: number[] = [];
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                if (index < result.length) {
                    rowArray.push(result[index]);
                }
            }
            if (rowArray.length > 0) {
                matrix.push(rowArray);
            }
        }
        return matrix;
    }

    return result;
};

export { arrayWithBankNums, orderedArrayWithBankNums };