import { arrayWithBankNums } from '../src/algorithms/arrayGens';
import { and, type ArrayRule } from '../src/algorithms/arrayRules';
import * as fs from 'fs';

// Regla: No números consecutivos en la misma fila
const noConsecutiveInRow: ArrayRule = (num, arr) => {
    const rowSize = 3;
    const positionInRow = arr.length % rowSize;

    if (positionInRow === 0) return true;
    const lastNum = arr[arr.length - 1];

    return Math.abs(num - lastNum) !== 1;
};

// Regla: No más de 2 filas consecutivas con el mismo número
const noThreeRowsWithSameNumber: ArrayRule = (num, arr) => {
    const rowSize = 3;
    const totalRows = Math.floor(arr.length / rowSize);

    if (totalRows < 2) return true;

    const lastTwoRows = arr.slice(-rowSize * 2);
    let rowsWithNumber = 0;

    const firstRow = lastTwoRows.slice(0, rowSize);
    if (firstRow.includes(num)) rowsWithNumber++;

    const secondRow = lastTwoRows.slice(rowSize, rowSize * 2);
    if (secondRow.includes(num)) rowsWithNumber++;

    return rowsWithNumber < 2;
};

const complexRules = and([noConsecutiveInRow, noThreeRowsWithSameNumber]);

let output = '🧪 Test de Matriz 6x3 con Reglas Complejas\n';
output += '='.repeat(60) + '\n\n';

try {
    const matrix = arrayWithBankNums(
        { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
        [6, 3],
        complexRules
    );

    output += '✅ Matriz generada:\n\n';
    matrix.forEach((row, idx) => {
        output += `Fila ${idx + 1}: [${row.join(', ')}]\n`;
    });

    // Validaciones
    const flatArray = matrix.flat();
    const occurrences: { [key: number]: number } = {};
    flatArray.forEach(num => {
        occurrences[num] = (occurrences[num] || 0) + 1;
    });

    output += '\n📊 Ocurrencias:\n';
    for (let i = 1; i <= 6; i++) {
        output += `Número ${i}: ${occurrences[i] || 0} veces\n`;
    }

    output += '\n✓ Verificación de consecutivos en filas:\n';
    matrix.forEach((row, idx) => {
        let hasConsecutive = false;
        for (let i = 0; i < row.length - 1; i++) {
            if (Math.abs(row[i] - row[i + 1]) === 1) {
                hasConsecutive = true;
            }
        }
        output += `Fila ${idx + 1}: ${hasConsecutive ? '❌ Tiene consecutivos' : '✅ OK'}\n`;
    });

    output += '\n✓ Verificación de filas consecutivas con mismo número:\n';
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

        output += `Número ${num}: máximo ${maxConsecutive} filas consecutivas ${maxConsecutive < 3 ? '✅' : '❌'}\n`;
    }

    output += '\n' + '='.repeat(60) + '\n';
    output += '🎉 TEST COMPLETADO\n';

} catch (error) {
    output += '❌ Error: ' + (error instanceof Error ? error.message : String(error)) + '\n';
}

console.log(output);
fs.writeFileSync('test/test-results.txt', output);
console.log('\n📝 Resultados guardados en test/test-results.txt');
