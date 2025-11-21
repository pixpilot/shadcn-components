<!-- eslint-disable -->

# Spinner Component

A reusable Material Design circular progress spinner component with customizable size, speed, and colors.

## Features

- ✅ Smooth, continuous animation (never disappears)
- ✅ Customizable size, stroke width, and speed
- ✅ Single color or multi-color animation
- ✅ Based on Material Design principles
- ✅ TypeScript support with full prop types
- ✅ Lightweight and performant

## Usage

### Basic Usage (Inherits Text Color)

By default, the spinner uses `currentColor` which automatically inherits the text color from its parent. This makes it work seamlessly with dark/light mode:

```tsx
import { Spinner } from '@internal/ui';

function MyComponent() {
  return (
    <div className="text-gray-900 dark:text-gray-100">
      <Spinner /> {/* Will be gray-900 in light mode, gray-100 in dark mode */}
    </div>
  );
}

export default MyComponent;
```

### Tailwind Color Classes

Wrap the spinner in an element with Tailwind text color classes:

```tsx
import { Spinner } from '@internal/ui';

function ColorExamples() {
  return (
    <>
      {/* Light mode: blue, Dark mode: cyan */}
      <div className="text-blue-600 dark:text-cyan-400">
        <Spinner size={80} />
      </div>

      {/* Theme-aware primary color */}
      <div className="text-primary">
        <Spinner />
      </div>
    </>
  );
}

export default ColorExamples;
```

### Custom Color

```tsx
import { Spinner } from '@internal/ui';

function CustomColorExample() {
  return <Spinner size={80} color="#10b981" />;
}

export default CustomColorExample;
```

### Custom Speed

```tsx
import { Spinner } from '@internal/ui';

function SpeedExamples() {
  return (
    <>
      <Spinner speed={1.5} />
      <Spinner speed={3} />
    </>
  );
}

export default SpeedExamples;
```

### Multi-Color Animation

```tsx
import { Spinner } from '@internal/ui';

function MultiColorExample() {
  return <Spinner colors={['#ef4444', '#f59e0b', '#10b981', '#3b82f6']} />;
}

export default MultiColorExample;
```

### All Props

```tsx
import { Spinner } from '@internal/ui';

function AllPropsExample() {
  return (
    <Spinner
      size={120}
      strokeWidth={6}
      speed={2}
      color="#6366f1"
      colors={['#008744', '#0057e7', '#d62d20', '#ffa700']}
      className="my-custom-class"
    />
  );
}

export default AllPropsExample;
```

## Props

| Prop          | Type       | Default        | Description                                                                                         |
| ------------- | ---------- | -------------- | --------------------------------------------------------------------------------------------------- |
| `size`        | `number`   | `100`          | Size of the spinner in pixels                                                                       |
| `strokeWidth` | `number`   | `5`            | Width of the spinner stroke in pixels                                                               |
| `speed`       | `number`   | `2`            | Duration of rotation animation in seconds                                                           |
| `color`       | `string`   | `currentColor` | Single color for the spinner. Use `currentColor` to inherit text color (works with dark/light mode) |
| `colors`      | `string[]` | `undefined`    | Array of colors for color-changing animation (overrides `color`)                                    |
| `className`   | `string`   | `''`           | Additional CSS class name                                                                           |

## Examples

### Dark/Light Mode Support

The spinner automatically inherits text color, making it perfect for dark mode:

```tsx
import { Spinner } from '@internal/ui';

function DarkLightExamples() {
  return (
    <>
      {/* Automatically adapts to theme */}
      <div className="text-foreground">
        <Spinner />
      </div>

      {/* Different colors per theme */}
      <div className="text-blue-600 dark:text-blue-400">
        <Spinner size={60} />
      </div>

      {/* Using Tailwind's semantic colors */}
      <div className="text-primary">
        <Spinner />
      </div>
    </>
  );
}

export default DarkLightExamples;
```

### Loading State

```tsx
import { Spinner } from '@internal/ui';
import { useState } from 'react';

function AuthCallback() {
  const [isLoading, setIsLoading] = useState(true);

  return <div>{isLoading && <Spinner size={120} color="#6366f1" />}</div>;
}

export default AuthCallback;
```

### With Different Colors

```tsx
import { Spinner } from '@internal/ui';

function ColorVariations() {
  return (
    <>
      {/* Google colors */}
      <Spinner colors={['#008744', '#0057e7', '#d62d20', '#ffa700']} />

      {/* Gradient effect */}
      <Spinner colors={['#667eea', '#764ba2']} speed={1.5} />

      {/* Rainbow */}
      <Spinner
        colors={[
          '#ff0000',
          '#ff7f00',
          '#ffff00',
          '#00ff00',
          '#0000ff',
          '#4b0082',
          '#9400d3',
        ]}
      />
    </>
  );
}

export default ColorVariations;
```

## Animation Details

The spinner uses a Material Design circular progress pattern:

- **Rotation**: The entire circle rotates continuously
- **Dash Animation**: A portion of the circle (the "dash") grows and shrinks
- **Overlapping Timing**: The dash animation (1.5s) and rotation (customizable) overlap for smooth, continuous motion
- **No Gaps**: The circle never completely disappears, always showing part of the arc

This creates the familiar, professional loading animation seen in Google products and modern applications.
