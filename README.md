# Y-ary

<img src="./res/banner.webp" width="50%" alt="Y-ary Banner">

Y-ary is an experimental TypeScript library for mathematical operations and data generation. 
It provides tools to evaluate mathematical formulas from strings with dynamic variables, 
and generate controlled random arrays/matrices with sophisticated validation rules.

Perfect for: games, testing, simulations, educational tools, and mathematical experimentation.

## Features

### 🧮 Formula Interpreter
- **Dynamic Evaluation**: Interpret mathematical formulas as strings at runtime.
- **Variable Injection**: Easily map variable names to numeric values using the `where` object.
- **Full JavaScript Math Support**: Use standard operators (`+`, `-`, `*`, `/`, `**`, etc.) and all `Math` functions (e.g., `Math.sqrt`, `Math.pow`).
- **Safety Focused**: Uses the `Function` constructor for evaluation, providing a more controlled environment than `eval`.
- **Word-Boundary Precision**: Replaces variables only when they match as whole words, avoiding accidental partial replacements.

### 🎲 Smart Array Generation
- **Random Array Generation**: Create 1D arrays or 2D matrices with controlled randomization.
- **Occurrence Limits**: Define how many times each number can appear using a bank system.
- **30+ Validation Rules**: Pre-built rules for common patterns (parity, ranges, sequences, etc.).
- **Custom Rules**: Create your own validation functions for specific requirements.
- **Rule Combinators**: Combine rules with AND, OR, and NOT logic.


## Installation

### From npm registry

```bash
pnpm add y-ary
```

### From GitHub repository

Using **pnpm**:
```bash
pnpm add https://github.com/AmaiDonatsu/Y-ary.git
```

Using **npm**:
```bash
npm install https://github.com/AmaiDonatsu/Y-ary.git
```

## Usage

### Formula Interpreter

The `formulaInterpreter` function evaluates mathematical formulas with dynamic variables.

```typescript
import { formulaInterpreter } from 'y-ary';

// Basic usage
const result = formulaInterpreter('x / 1 + y', { x: 4, y: 6 });
console.log(result); // Output: 10

// Complex formulas with Math functions
const complexResult = formulaInterpreter('Math.sqrt(a) + Math.pow(b, 2) - c', {
  a: 16,
  b: 3,
  c: 5
});
console.log(complexResult); // Output: 8 (4 + 9 - 5)
```

### Array Generation

Generate random arrays or matrices with controlled distribution and validation rules.

#### Basic 1D Array
```typescript
import { arrayWithBankNums } from 'y-ary';

// Generate array of length 5
// Each number (1-10) can appear up to 3 times
const array = arrayWithBankNums(
  { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 },
  [5]
);
// Possible result: [3, 7, 1, 9, 2]
```

#### 2D Matrix
```typescript
// Generate 3x4 matrix (3 rows, 4 columns)
const matrix = arrayWithBankNums(
  { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
  [3, 4]
);
// Possible result:
// [
//   [1, 3, 2, 5],
//   [4, 1, 6, 3],
//   [2, 5, 4, 6]
// ]
```

#### Using Validation Rules
```typescript
import { arrayWithBankNums, onlyEven, inRange, and, noConsecutiveRepeats } from 'y-ary';

// Only even numbers
const evenArray = arrayWithBankNums(
  { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3 },
  [5],
  onlyEven
);
// Possible result: [2, 4, 6, 2, 4]

// Combine multiple rules: even AND in range 2-8
const filtered = arrayWithBankNums(
  { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3 },
  [5],
  and([onlyEven, inRange(2, 8)])
);
// Possible result: [2, 4, 6, 8, 2]

// No consecutive repeats
const noRepeats = arrayWithBankNums(
  { 1: 5, 2: 5, 3: 5 },
  [10],
  noConsecutiveRepeats
);
// Possible result: [1, 2, 3, 1, 2, 3, 2, 1, 3, 2]
```

#### Custom Validation Rules
```typescript
// Create your own rule
const customRule = (num: number, arr: number[]) => {
  // Only allow numbers greater than the last element
  if (arr.length === 0) return true;
  return num > arr[arr.length - 1];
};

const ascending = arrayWithBankNums(
  { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2 },
  [5],
  customRule
);
// Possible result: [1, 2, 3, 4, 5]
```

### Available Validation Rules

Y-ary includes 30+ pre-built validation rules:

**Parity**: `onlyEven`, `onlyOdd`  
**Range**: `inRange(min, max)`, `notInRange(min, max)`  
**Repetition**: `noConsecutiveRepeats`, `noDuplicates`, `maxOccurrences(n)`, `noRepeatInLast(n)`  
**Sum/Average**: `sumLessThan(max)`, `averageInRange(min, max)`  
**Sequence**: `ascending`, `descending`, `alternateEvenOdd`  
**Divisibility**: `divisibleBy(n)`, `notDivisibleBy(n)`  
**Advanced**: `onlyPrimes`, `onlySquares`, `maxDifference(n)`, `balanceEvenOdd(n)`  
**Combinators**: `and([rules])`, `or([rules])`, `not(rule)`  

See [docs/array-docs.md](./docs/array-docs.md) for complete documentation.


## Security Note

⚠️ **Formula Interpreter**: This library uses dynamic code evaluation. Only use it with trusted or validated formulas. Avoid evaluating formulas directly from untrusted user input without proper sanitization.

⚠️ **Array Generation**: Custom validation rules execute user-provided functions. Ensure that custom rules are from trusted sources and don't perform expensive operations that could impact performance.


## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Watch mode during development
pnpm dev
```

## License

MIT
