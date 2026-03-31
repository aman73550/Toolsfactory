# ⚡ Quick Start: Blueprint Implementation

**5-Minute Setup Guide**

---

## 🎯 What You Have

✅ **Complete Design System** - 15 professional rules
✅ **Dark Mode** - System sync + manual toggle  
✅ **Components** - 12 reusable UI components
✅ **Accessibility** - WCAG AA compliance
✅ **Documentation** - 6000+ lines of guidance

---

## 🔧 3-Step Integration

### Step 1: Add Theme Wrapper (2 min)
```jsx
// src/App.tsx - Already done! ✅
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        {/* Rest of app */}
      </ToastProvider>
    </ThemeProvider>
  );
}
```

### Step 2: Add Breadcrumb to tool pages (2 min)
```jsx
// In your tool page component
import { Breadcrumb } from '../components/Breadcrumb';

export function MyTool() {
  return (
    <>
      <Breadcrumb />  {/* Automatically generates navigation */}
      {/* Your tool content */}
    </>
  );
}
```

### Step 3: Add Theme Toggle to header (1 min)
```jsx
// In your header/layout
import { ThemeToggleIcon } from '../components/ThemeToggle';

export function Header() {
  return (
    <header>
      {/* Other header content */}
      <ThemeToggleIcon />  {/* Compact toggle */}
    </header>
  );
}
```

---

## 🎨 Test Dark Mode

**Browser DevTools Method:**
1. Open DevTools (F12)
2. Ctrl+Shift+P → "rendering"
3. Look for "Emulate CSS media feature prefers-color-scheme"
4. Toggle light/dark
5. Website auto-switches! ✅

---

## 📁 Key Files to Know

| File | Purpose | Read Time |
|------|---------|-----------|
| README_BLUEPRINT.md | Executive summary | 5 min |
| UNIVERSAL_BLUEPRINT.md | Master guide (all rules) | 30 min |
| ADVANCED_BLUEPRINT_RULES.md | Professional polish | 20 min |
| DARK_MODE_SYSTEM.md | Dark mode deep dive | 15 min |
| BLUEPRINT_COMPONENTS_GUIDE.md | How to use each component | 15 min |

---

## 🚀 Common Tasks

### Use Dark Mode Hook
```tsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { isDark, theme, setTheme } = useTheme();
  
  return <div>{isDark ? '🌙 Dark' : '☀️ Light'}</div>;
}
```

### Show Notification
```tsx
import { useToast } from '../context/ToastContext';

function MyComponent() {
  const { add: toast } = useToast();
  
  return (
    <button onClick={() => toast('Success!', 'success')}>
      Click me
    </button>
  );
}
```

### Handle Errors
```tsx
import { ErrorState } from '../components/ErrorState';

function MyComponent() {
  if (error) {
    return (
      <ErrorState
        title="Oops!"
        description="Something went wrong. Try again or use another tool."
        suggestedToolSlug="image-compressor"
        suggestedToolName="Image Compressor"
      />
    );
  }
  return <div>Success!</div>;
}
```

### Format by User's Locale
```tsx
import { useLocaleFormat } from '../lib/intl';

function MyComponent() {
  const { formatCurrency, formatDate } = useLocaleFormat();
  
  return (
    <div>
      Price: {formatCurrency(99.99)}
      Date: {formatDate(new Date())}
    </div>
  );
}
```

---

## ✅ Integration Checklist

**This Week:**
- [ ] Read README_BLUEPRINT.md
- [ ] Test dark mode toggle in browser
- [ ] Add Breadcrumb to 1-2 tool pages
- [ ] Verify focus states with Tab key

**Next Week:**
- [ ] Add Breadcrumb to all tool pages
- [ ] Replace raw errors with ErrorState
- [ ] Add Theme Toggle to header
- [ ] Test accessibility (WAVE extension)

**Later:**
- [ ] Audit micro-copy (remove AI clichés)
- [ ] Add "Share Result" buttons
- [ ] Set up Sentry error tracking
- [ ] Generate dynamic OG images

---

## 🎨 Colors You Have

**All CSS variables (auto-theme):**
```css
--bg-primary       /* Background */
--text-primary     /* Text */
--accent           /* Primary action color */
--success          /* Success messages */
--error            /* Error messages */
--warning          /* Warnings */
--border-primary   /* Borders */
```

Use in any component:
```jsx
<div style={{ 
  backgroundColor: 'var(--bg-primary)',
  color: 'var(--text-primary)'
}}>
  Auto-respects dark mode! 🎨
</div>
```

---

## 📊 What's Included

| Category | Items | Status |
|----------|-------|--------|
| **Components** | 12 | ✅ Ready |
| **Context Providers** | 2 | ✅ Ready |
| **Utilities Hooks** | 4 | ✅ Ready |
| **Documentation** | 6 | ✅ Ready |
| **CSS Variables** | 30+ | ✅ Ready |
| **Colors** | Light + Dark | ✅ Ready |
| **Examples** | Code everywhere | ✅ Ready |

---

## 🆘 Troubleshooting

**Dark mode not working?**
- Clear localStorage: `localStorage.clear()`
- Verify ThemeProvider wraps app
- Check DevTools for CSS variable values

**Components not styled?**
- Verify index.css is imported
- Check CSS variables are set
- Inspect element in DevTools

**Accessibility not working?**
- Test with Tab key throughout page
- Should see indigo outline
- Run WAVE accessibility checker

---

## 📞 Documentation Map

```
START HERE → README_BLUEPRINT.md (5 min overview)
    ↓
LEARN BASICS → UNIVERSAL_BLUEPRINT.md (30 min)
    ↓
GET ADVANCED → ADVANCED_BLUEPRINT_RULES.md (20 min)
    ↓
DARK MODE → DARK_MODE_SYSTEM.md (15 min)
    ↓
USE COMPONENTS → BLUEPRINT_COMPONENTS_GUIDE.md (15 min)
    ↓
IMPLEMENT → Add components to your pages
```

---

## 🎯 Next Action

1. **Now:** Read README_BLUEPRINT.md
2. **Today:** Test dark mode in browser
3. **This week:** Add Breadcrumb + Theme Toggle
4. **Next week:** Replace errors + full integration

---

**Time to professional website: 1-2 weeks integration + testing**

🚀 **You're ready to build!**
