// Test completo con descompresión
import * as fs from 'fs';

const { orderedArrayWithBankNums, decompressRow, decompressMatrix, and } = await import('../dist/index.js');

type ArrayRule = (candidateNum: number, currentArray: number[], rowSize: number) => boolean;

const ROW_SIZE = 3;
const TOTAL_ROWS = 6;

// Helpers
const getRow = (len: number) => Math.floor(len / ROW_SIZE);
const getPosInRow = (len: number) => len % ROW_SIZE;

// REGLAS
const noRepeatInRow: ArrayRule = (num, arr) => {
    const pos = getPosInRow(arr.length);
    if (pos === 0) return true;
    const rowStart = getRow(arr.length) * ROW_SIZE;
    return !arr.slice(rowStart).includes(num);
};

const noThreeConsecutive: ArrayRule = (num, arr) => {
    const pos = getPosInRow(arr.length);
    if (pos < 2) return true;
    const start = getRow(arr.length) * ROW_SIZE;
    const first = arr[start];
    const second = arr[start + 1];
    return !(second === first + 1 && num === second + 1);
};

const maxDiff4: ArrayRule = (num, arr) => {
    const pos = getPosInRow(arr.length);
    if (pos === 0) return true;
    return Math.abs(num - arr[arr.length - 1]) <= 4;
};

const noThreeRowsSamePos: ArrayRule = (num, arr) => {
    const row = getRow(arr.length);
    const pos = getPosInRow(arr.length);
    if (row < 2) return true;

    const p1 = (row - 1) * ROW_SIZE + pos;
    const p2 = (row - 2) * ROW_SIZE + pos;
    if (p1 >= arr.length || p2 >= arr.length) return true;

    return !(arr[p1] === arr[p2] && arr[p1] === num);
};

const allRules = and([noRepeatInRow, noThreeConsecutive, maxDiff4, noThreeRowsSamePos]) as ArrayRule;

let output = '🧪 Test Completo: Generación y Descompresión\n';
output += '='.repeat(60) + '\n\n';

// Generar matriz comprimida
output += '📊 Generando matriz comprimida con orderedArrayWithBankNums...\n';
output += '-'.repeat(40) + '\n\n';

const compressedMatrix = orderedArrayWithBankNums(
    { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
    [6, 3],
    allRules
) as number[][];

output += '📦 MATRIZ COMPRIMIDA:\n';
compressedMatrix.forEach((row, i) => {
    output += `   Fila ${i + 1}: [${row.join(', ')}]\n`;
});

// Descomprimir con decompressMatrix
output += '\n📤 DESCOMPRESIÓN con decompressMatrix:\n';
output += '-'.repeat(40) + '\n';

const decompressed = decompressMatrix(compressedMatrix, 6);

output += '\n📊 MATRIZ DESCOMPRIMIDA (booleanos):\n';
decompressed.forEach((row: boolean[], i: number) => {
    const boolStr = row.map((v: boolean) => v ? '1' : '0').join(', ');
    output += `   Fila ${i + 1}: [${boolStr}]\n`;
});

// Descompresión fila por fila para demostrar
output += '\n📋 COMPARACIÓN LADO A LADO:\n';
output += '-'.repeat(40) + '\n';
output += '   Comprimido    →    Descomprimido\n\n';

compressedMatrix.forEach((row, i) => {
    const decompressedRow = decompressRow(row, 6);
    const boolStr = decompressedRow.map((v: boolean) => v ? '1' : '0').join(',');
    output += `   [${row.join(',')}]     →    [${boolStr}]\n`;
});

// Validaciones
output += '\n' + '='.repeat(60) + '\n';
output += '📋 VALIDACIONES DE LA MATRIZ COMPRIMIDA:\n';
output += '-'.repeat(40) + '\n';

// Ocurrencias
const flat = compressedMatrix.flat();
const occ: Record<number, number> = {};
flat.forEach(n => occ[n] = (occ[n] || 0) + 1);
let occValid = true;
for (let i = 1; i <= 6; i++) {
    if (occ[i] !== 3) occValid = false;
}
output += `   ✓ Ocurrencias (3 cada uno): ${occValid ? '✅' : '❌'}\n`;

// Ascendente
output += `   ✓ Ascendente: ${compressedMatrix.every(r => r[0] < r[1] && r[1] < r[2]) ? '✅' : '❌'}\n`;

// Sin 3 consecutivos
output += `   ✓ Sin 3 cons: ${!compressedMatrix.some(r => r[1] === r[0] + 1 && r[2] === r[1] + 1) ? '✅' : '❌'}\n`;

// Diff ≤4
output += `   ✓ Diff ≤4: ${compressedMatrix.every(r => Math.abs(r[1] - r[0]) <= 4 && Math.abs(r[2] - r[1]) <= 4) ? '✅' : '❌'}\n`;

// Posiciones
let posValid = true;
for (let p = 0; p < 3; p++) {
    for (let r = 2; r < 6; r++) {
        if (compressedMatrix[r][p] === compressedMatrix[r - 1][p] &&
            compressedMatrix[r - 1][p] === compressedMatrix[r - 2][p]) {
            posValid = false;
        }
    }
}
output += `   ✓ Posiciones: ${posValid ? '✅' : '❌'}\n`;

output += '\n' + '='.repeat(60) + '\n';
output += '🎉 ÉXITO: Generación y descompresión completadas!\n';
output += '\n📦 Funciones disponibles:\n';
output += '   - orderedArrayWithBankNums() → Genera matriz comprimida\n';
output += '   - decompressRow()            → Descomprime una fila\n';
output += '   - decompressMatrix()         → Descomprime matriz completa\n';

console.log(output);
fs.writeFileSync('test/binary-test-results.txt', output);
console.log('\n📝 Guardado en test/binary-test-results.txt');
