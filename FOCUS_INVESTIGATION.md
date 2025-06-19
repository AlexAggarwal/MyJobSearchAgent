# React Form Focus Loss Investigation

This project demonstrates common patterns that cause input focus loss in React applications and provides solutions to prevent them.

## 🚨 Common Focus Loss Causes

### 1. **Component Re-creation on Every Render**

**Problem:**
```tsx
// ❌ BAD: Component defined inside render function
const MyForm = () => {
  const InputComponent = () => (
    <input type="text" />
  );
  
  return <InputComponent />;
};
```

**Solution:**
```tsx
// ✅ GOOD: Component defined outside or memoized
const InputComponent = React.memo(() => (
  <input type="text" />
));

const MyForm = () => {
  return <InputComponent />;
};
```

### 2. **Non-Memoized Event Handlers**

**Problem:**
```tsx
// ❌ BAD: New function created on every render
const MyForm = () => {
  const [value, setValue] = useState('');
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)} // New function each render
    />
  );
};
```

**Solution:**
```tsx
// ✅ GOOD: Memoized callback
const MyForm = () => {
  const [value, setValue] = useState('');
  
  const handleChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  
  return <input value={value} onChange={handleChange} />;
};
```

### 3. **Improper Key Usage in Lists**

**Problem:**
```tsx
// ❌ BAD: Using array index as key
{items.map((item, index) => (
  <input key={index} defaultValue={item} />
))}
```

**Solution:**
```tsx
// ✅ GOOD: Using stable, unique keys
{items.map((item) => (
  <input key={item.id} defaultValue={item.value} />
))}
```

### 4. **Frequent Parent Re-renders**

**Problem:**
```tsx
// ❌ BAD: Parent re-renders cause child re-creation
const Parent = () => {
  const [count, setCount] = useState(0);
  
  // This object is recreated on every render
  const inputProps = {
    className: 'input',
    placeholder: 'Enter text'
  };
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <input {...inputProps} />
    </div>
  );
};
```

**Solution:**
```tsx
// ✅ GOOD: Memoized props and stable references
const Parent = () => {
  const [count, setCount] = useState(0);
  
  const inputProps = useMemo(() => ({
    className: 'input',
    placeholder: 'Enter text'
  }), []);
  
  const MemoizedInput = React.memo(() => <input {...inputProps} />);
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <MemoizedInput />
    </div>
  );
};
```

### 5. **Conditional Rendering Issues**

**Problem:**
```tsx
// ❌ BAD: Component unmounts/remounts
const MyForm = () => {
  const [showField, setShowField] = useState(false);
  
  return (
    <div>
      {showField && <input type="text" />}
    </div>
  );
};
```

**Solution:**
```tsx
// ✅ GOOD: Keep component mounted, control visibility
const MyForm = () => {
  const [showField, setShowField] = useState(false);
  
  return (
    <div>
      <input 
        type="text" 
        style={{ display: showField ? 'block' : 'none' }}
      />
    </div>
  );
};
```

## 🛠️ Best Practices

### 1. Use React.memo Wisely
```tsx
const StableInput = React.memo(({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
));
```

### 2. Memoize Callbacks
```tsx
const MyForm = () => {
  const [formData, setFormData] = useState({});
  
  const handleFieldChange = useCallback((field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  
  return (
    <StableInput
      value={formData.name}
      onChange={handleFieldChange('name')}
    />
  );
};
```

### 3. Stable Keys for Dynamic Lists
```tsx
// Generate stable IDs for dynamic items
const [items, setItems] = useState(() => 
  initialItems.map(item => ({ ...item, id: nanoid() }))
);

return (
  <div>
    {items.map(item => (
      <input key={item.id} defaultValue={item.value} />
    ))}
  </div>
);
```

### 4. Use useRef for Imperative Focus Control
```tsx
const MyForm = () => {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current?.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
};
```

## 🔍 Debugging Focus Issues

### 1. Use React DevTools Profiler
- Look for unnecessary re-renders
- Check component mount/unmount cycles
- Identify expensive computations

### 2. Add Debug Logging
```tsx
const MyInput = React.memo(({ value, onChange }) => {
  console.log('MyInput rendered with value:', value);
  
  useEffect(() => {
    console.log('MyInput mounted');
    return () => console.log('MyInput unmounted');
  }, []);
  
  return <input value={value} onChange={onChange} />;
});
```

### 3. Check for Anti-patterns
- Components defined inside render functions
- Non-memoized objects/arrays as props
- Inline event handlers
- Missing or incorrect key props

## 🧪 Testing Focus Behavior

### Manual Testing
1. Type in an input field
2. Trigger actions that cause re-renders
3. Observe if the input loses focus
4. Check if the typed content is preserved

### Automated Testing
```tsx
import { render, fireEvent, screen } from '@testing-library/react';

test('input maintains focus during re-renders', () => {
  render(<MyForm />);
  
  const input = screen.getByPlaceholderText('Enter text');
  input.focus();
  
  // Trigger re-render
  fireEvent.click(screen.getByText('Trigger Re-render'));
  
  // Check if input still has focus
  expect(input).toHaveFocus();
});
```

## 📊 Performance Impact

Focus loss issues often correlate with performance problems:

1. **Unnecessary Re-renders**: Cause UI stuttering
2. **Component Recreation**: Expensive reconciliation
3. **Event Handler Recreation**: Memory allocation overhead
4. **Props Object Recreation**: React comparison failures

## 🎯 Quick Checklist

Before shipping forms, verify:

- [ ] No components defined inside render functions
- [ ] Event handlers are memoized with `useCallback`
- [ ] Complex objects are memoized with `useMemo`
- [ ] List items have stable, unique keys
- [ ] Conditional rendering doesn't unmount/remount unnecessarily
- [ ] Parent components don't cause excessive child re-renders
- [ ] Form validation doesn't trigger component recreation

## 🔗 Related Resources

- [React Docs: Reconciliation](https://react.dev/learn/preserving-and-resetting-state)
- [React Docs: useCallback](https://react.dev/reference/react/useCallback)
- [React Docs: useMemo](https://react.dev/reference/react/useMemo)
- [React Docs: React.memo](https://react.dev/reference/react/memo)
