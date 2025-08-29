# TASK: UI Component — <ComponentName>

## Component Specification
**Type**: Atom | Molecule | Organism | Template | Page  
**Purpose**: <Brief description of component purpose>  
**Complexity**: Simple | Medium | Complex | Enterprise  

## Design Requirements
### Visual Design
- **Variants**: List all visual variants (primary, secondary, etc.)
- **Sizes**: List all size options (xs, sm, md, lg, xl)
- **States**: List all interaction states (default, hover, active, disabled, loading)
- **Theme Support**: Light mode, dark mode, system preference

### Accessibility Requirements
- [ ] Semantic HTML structure
- [ ] ARIA labels and descriptions
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Focus management
- [ ] Color contrast compliance (4.5:1 minimum)

## Technical Implementation
### Props Interface
```typescript
interface <ComponentName>Props {
  // Define all props with types
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  // Event handlers
  onClick?: () => void;
}
```

### Component Structure
```typescript
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva(
  // Base classes
  "base-classes-here",
  {
    variants: {
      variant: {
        primary: "primary-classes",
        secondary: "secondary-classes"
      },
      size: {
        sm: "small-classes",
        md: "medium-classes", 
        lg: "large-classes"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

const <ComponentName> = forwardRef<HTMLElement, <ComponentName>Props>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

<ComponentName>.displayName = "<ComponentName>";
export { <ComponentName> };
```

## Animation Requirements
### Framer Motion Integration
```typescript
// Animation variants
const animationVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  exit: { opacity: 0, scale: 0.95 }
};

// Usage in component
<motion.div variants={animationVariants} />
```

### Performance Considerations
- [ ] Animations run at 60fps
- [ ] Respect `prefers-reduced-motion`
- [ ] Use `transform` and `opacity` for GPU acceleration
- [ ] Minimize layout thrashing

## Testing Requirements
### Unit Tests
```typescript
describe('<ComponentName>', () => {
  it('renders with default props', () => {
    render(<<ComponentName> />);
    // Test default rendering
  });

  it('handles all variants correctly', () => {
    // Test all variant combinations
  });

  it('supports accessibility features', () => {
    // Test keyboard navigation, ARIA labels, etc.
  });

  it('handles interactions properly', () => {
    // Test click handlers, hover states, etc.
  });
});
```

### Accessibility Tests
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<<ComponentName> />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Storybook Documentation
### Story Structure
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { <ComponentName> } from './<component-name>';

const meta: Meta<typeof <ComponentName>> = {
  title: 'Components/<ComponentName>',
  component: <ComponentName>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Component description here'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary']
    }
  }
};

export default meta;
type Story = StoryObj<typeof <ComponentName>>;

export const Default: Story = {
  args: {
    // Default props
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      {/* Render all variants */}
    </div>
  )
};
```

## Performance Validation
### Bundle Impact
- [ ] Component bundle size < 10KB
- [ ] No unnecessary dependencies
- [ ] Tree-shakeable exports
- [ ] Lazy loading for heavy components

### Runtime Performance
- [ ] No unnecessary re-renders
- [ ] Efficient event handlers
- [ ] Minimal DOM updates
- [ ] Memory leak prevention

## Integration Checklist
### Design System Integration
- [ ] Uses design tokens from theme
- [ ] Follows spacing and typography scales
- [ ] Consistent with other components
- [ ] Supports theme switching

### API Integration (if applicable)
- [ ] Proper loading states
- [ ] Error boundary handling
- [ ] Optimistic updates
- [ ] Cache invalidation

## Documentation Requirements
### Component Documentation
- [ ] Props API documentation
- [ ] Usage examples
- [ ] Best practices guide
- [ ] Common patterns

### Design Documentation  
- [ ] Visual specifications
- [ ] Interaction guidelines
- [ ] Accessibility notes
- [ ] Browser support matrix

---

**Implementation Notes**: Follow FRONTEND_UX_ARCHITECTURE.md for all design decisions and optimization requirements.
