# Y-ary - Documentación Básica

## Descripción General

**Y-ary** es un paquete de TypeScript que proporciona herramientas para interpretar y evaluar fórmulas matemáticas con variables dinámicas.

---

## Funciones Disponibles

### `formulaInterpreter`

Interpreta y evalúa una fórmula matemática reemplazando las variables con valores numéricos proporcionados.

#### **Objetivo**

Permitir la evaluación dinámica de expresiones matemáticas donde las variables son reemplazadas por valores específicos en tiempo de ejecución. Esto es útil para:
- Cálculos matemáticos configurables
- Evaluación de fórmulas definidas por el usuario
- Sistemas de reglas o validaciones basadas en expresiones

---

#### **Parámetros**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `formula` | `string` | Fórmula matemática que contiene variables. Las variables deben ser identificadores válidos (letras, números, guiones bajos). Ejemplo: `'x/1 + y'`, `'a * b - c'` |
| `where` | `{ [key: string]: number }` | Objeto que mapea nombres de variables a sus valores numéricos. Las claves deben coincidir con las variables en la fórmula. Ejemplo: `{x: 4, y: 6}` |

---

#### **Valor de Retorno**

| Tipo | Descripción |
|------|-------------|
| `number` | El resultado numérico de evaluar la fórmula después de reemplazar las variables con sus valores |

---

#### **Comportamiento**

1. **Reemplazo de variables**: La función busca cada variable en la fórmula y la reemplaza con su valor correspondiente del objeto `where`
2. **Evaluación**: La expresión matemática resultante se evalúa usando el constructor `Function` de JavaScript
3. **Manejo de errores**: Si la fórmula es inválida o contiene errores de sintaxis, se lanza un error descriptivo

---

#### **Ejemplos de Uso**

##### Ejemplo 1: Operaciones básicas
```typescript
import { formulaInterpreter } from 'y-ary';

const result = formulaInterpreter('x/1 + y', { x: 4, y: 6 });
console.log(result); // Output: 10
```

##### Ejemplo 2: Fórmulas más complejas
```typescript
const result = formulaInterpreter('(a + b) * c - d', { 
  a: 5, 
  b: 3, 
  c: 2, 
  d: 1 
});
console.log(result); // Output: 15
// Cálculo: (5 + 3) * 2 - 1 = 16 - 1 = 15
```

##### Ejemplo 3: Operaciones con decimales
```typescript
const result = formulaInterpreter('x * 0.5 + y / 2', { 
  x: 10, 
  y: 20 
});
console.log(result); // Output: 15
// Cálculo: 10 * 0.5 + 20 / 2 = 5 + 10 = 15
```

##### Ejemplo 4: Uso de funciones matemáticas
```typescript
const result = formulaInterpreter('Math.sqrt(x) + Math.pow(y, 2)', { 
  x: 16, 
  y: 3 
});
console.log(result); // Output: 13
// Cálculo: √16 + 3² = 4 + 9 = 13
```

---

#### **Consideraciones Importantes**

⚠️ **Seguridad**: Esta función usa el constructor `Function` para evaluar expresiones. Solo debe usarse con fórmulas de confianza. No evalúes fórmulas proporcionadas directamente por usuarios sin validación.

✅ **Variables válidas**: Los nombres de variables deben ser identificadores JavaScript válidos (letras, números, guiones bajos, sin espacios ni caracteres especiales).

✅ **Operadores soportados**: Todos los operadores matemáticos de JavaScript están disponibles:
- Aritméticos: `+`, `-`, `*`, `/`, `%`, `**` (potencia)
- Paréntesis para agrupar: `(`, `)`
- Funciones Math: `Math.sqrt()`, `Math.pow()`, `Math.sin()`, etc.

❌ **Errores comunes**:
- Variables no definidas en el objeto `where`
- Sintaxis matemática inválida
- División por cero

---

## Formato de Datos para LLMs

### Input Schema
```typescript
{
  formula: string,        // Expresión matemática con variables
  where: {
    [variableName: string]: number  // Mapeo variable -> valor
  }
}
```

### Output Schema
```typescript
number  // Resultado de la evaluación
```

### Ejemplo de Prompt para LLM
```
Usa la función formulaInterpreter para evaluar la fórmula "x + y * 2" 
con los valores x=5 y y=3.

Código:
formulaInterpreter('x + y * 2', { x: 5, y: 3 })

Resultado esperado: 11
```

---

## Instalación

Ver [README.md](../README.md) para instrucciones de instalación.
