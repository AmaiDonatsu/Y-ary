# Y-ary

<img src="./res/banner.webp" width="50%" alt="Y-ary Banner">

**Y-ary** is a powerful TypeScript utility for interpreting and evaluating mathematical formulas with dynamic variable injection. It allows you to evaluate complex expressions in real-time by providing a mapping of variable names to their numeric values.

## Features

- **Dynamic Evaluation**: Interpret mathematical formulas as strings at runtime.
- **Variable Injection**: Easily map variable names to numeric values using the `where` object.
- **Full JavaScript Math Support**: Use standard operators (`+`, `-`, `*`, `/`, `**`, etc.) and all `Math` functions (e.g., `Math.sqrt`, `Math.pow`).
- **Safety Focused**: Uses the `Function` constructor for evaluation, providing a more controlled environment than `eval`.
- **Word-Boundary Precision**: Replaces variables only when they match as whole words, avoiding accidental partial replacements.

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

The core function of the library is `formulaInterpreter`.

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

## Security Note

⚠️ **Warning**: This library uses dynamic code evaluation. Only use it with trusted or validated formulas. Avoid evaluating formulas directly from untrusted user input without proper sanitization.

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
