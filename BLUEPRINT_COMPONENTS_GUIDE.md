# 📖 Implementation Guide: Using the New Blueprint Components

This guide explains how to use the new components and utilities created for the Universal Blueprint implementation.

---

## 🎯 1. Toast Notifications

### Setup
The `ToastProvider` is already integrated in `src/App.tsx`.

### Usage in Components
```tsx
import { useToast } from '../context/ToastContext';

export function MyComponent() {
  const { add: toast } = useToast();

  const handleSuccess = () => {
    toast('File uploaded successfully!', 'success', 3000);
  };

  const handleError = () => {
    toast('Failed to process file', 'error');
  };

  const handleWarning = () => {
    toast('Please check your settings', 'warning');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleWarning}>Warning</button>
    </div>
  );
}
```

### Toast Types
- `'success'` - Green with checkmark icon
- `'error'` - Red with X icon
- `'warning'` - Amber with alert icon
- `'info'` - Blue with info icon

---

## 🏗️ 2. Skeleton Loaders

### Setup
Import from `src/components/Skeleton.tsx`

### Usage Examples

#### Generic Skeleton
```tsx
import { Skeleton } from '../components/Skeleton';

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton width="w-2/3" height="h-6" />
      <Skeleton width="w-full" height="h-4" count={3} />
    </div>
  );
}
```

#### Pre-built Skeletons
```tsx
import { ToolSkeleton, CardSkeleton, GridSkeleton, TableSkeleton } from '../components/Skeleton';

// For tool pages
<Suspense fallback={<ToolSkeleton />}>
  <ToolContent />
</Suspense>

// For card layouts
<Suspense fallback={<CardSkeleton />}>
  <Card />
</Suspense>

// For grids
<GridSkeleton items={6} />

// For tables
<TableSkeleton rows={5} cols={4} />
```

---

## 🔍 3. SEO System

### Setup
Import from `src/lib/seo.ts`

### Automatic Metadata on Tool Pages
```tsx
import { useToolMetadata, generateToolMetadata } from '../lib/seo';

export function ToolPage({ toolSlug }: { toolSlug: string }) {
  const tool = {...}; // Load tool data

  // Auto-set all meta tags
  useToolMetadata(tool);

  return (
    <div>
      {/* Tool content */}
    </div>
  );
}
```

### Manual Control
```tsx
import { setMetaTags, generateToolMetadata } from '../lib/seo';

const metadata = generateToolMetadata({
  name: 'Image Compressor',
  slug: 'image-compressor',
  description: 'Compress images without quality loss',
  category: 'image',
});

setMetaTags(metadata);
```

### FAQ Schemas
```tsx
import { generateFAQSchema } from '../lib/seo';

const faqs = [
  { question: 'How does it work?', answer: 'We use...' },
  { question: 'Is it free?', answer: 'Yes, completely...' },
];

const schema = generateFAQSchema(faqs);
// This can be added to your head or used in JSON-LD
```

---

## 🌐 4. Internationalization (Intl API)

### Setup
Import from `src/lib/intl.ts`

### Usage Examples

#### Formatting Dates
```tsx
import { formatDate, formatDateTime, useLocaleFormat } from '../lib/intl';

function LastUpdated() {
  return <p>Updated: {formatDate(new Date())}</p>;
  // Output: "Mar 31, 2026" (varies by locale)
}
```

#### Formatting Currency
```tsx
import { formatCurrency } from '../lib/intl';

function Price({ amount }: { amount: number }) {
  return <p>{formatCurrency(amount)}</p>;
  // Output: "$99.99" or "₹8,499" depending on locale
}
```

#### Formatting File Size
```tsx
import { formatFileSize } from '../lib/intl';

function FileInfo({ bytes }: { bytes: number }) {
  return <p>Size: {formatFileSize(bytes)}</p>;
  // Output: "2.5 MB" or "2,5 MB" depending on locale
}
```

#### Using React Hook
```tsx
import { useLocaleFormat } from '../lib/intl';

function LocaleAwareComponent() {
  const { locale, currency, formatCurrency, formatDate } = useLocaleFormat();

  return (
    <div>
      <p>Locale: {locale}</p>
      <p>Currency: {currency}</p>
      <p>Price: {formatCurrency(100)}</p>
      <p>Date: {formatDate(new Date())}</p>
    </div>
  );
}
```

#### All Available Functions
```
- formatDate(date)
- formatTime(date)
- formatDateTime(date)
- formatCurrency(amount)
- formatNumber(number, options?)
- formatFileSize(bytes)
- formatDuration(milliseconds)
- getCurrencySymbol()
- FormattedDate (component)
- FormattedCurrency (component)
- FormattedFileSize (component)
```

---

## 🛡️ 5. Bot Protection (Honeypot)

### Setup
Import from `src/components/Honeypot.tsx`

### Usage in Forms
```tsx
import { HoneypotField, useHoneypotCheck } from '../components/Honeypot';

export function SampleForm() {
  const [formData, setFormData] = useState({});
  const checkHoneypot = useHoneypotCheck('website');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if honeypot was filled (bot)
    if (checkHoneypot(e.currentTarget)) {
      console.warn('Bot detected');
      return;
    }

    // Normal form submission
    submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />

      {/* Honeypot field (hidden from real users) */}
      <HoneypotField fieldName="website" />

      <button type="submit">Submit</button>
    </form>
  );
}
```

### Complete Example
```tsx
import { ContactFormWithHoneypot } from '../components/Honeypot';

// Full working form with honeypot
export default function Contact() {
  return <ContactFormWithHoneypot />;
}
```

### Bot Detection Utilities
```tsx
import { BotDetection } from '../components/Honeypot';

const data = { name: 'John', email: 'john@example.com', message: 'Hello' };
const { suspicious, reason } = BotDetection.isSuspicious(data);

if (suspicious) {
  console.log('Suspicious activity:', reason);
  // Could reject form, show CAPTCHA, etc.
}
```

---

## 🤖 6. AI Tool-Maker (Admin Panel)

### Setup
1. Add API endpoints to `server.ts`:
```typescript
import { handleGenerateTool, handleSaveTool } from './api/admin-tools';

app.post('/api/admin/generate-tool', handleGenerateTool);
app.post('/api/admin/save-tool', handleSaveTool);
```

2. Update admin page:
```tsx
// src/pages/Admin.tsx
import { AdminDashboard } from '../components/AdminDashboard';

export default function Admin() {
  return <AdminDashboard />;
}
```

### How It Works
1. Admin enters tool description
2. Claude API generates complete tool:
   - React component code
   - SEO metadata
   - Blog content
   - FAQ entries
3. Admin reviews generated content
4. Admin saves to platform
5. Tool appears at `/tools/[slug]`

### Example Prompts
```
"A tool that converts Markdown to HTML with real-time preview,
syntax highlighting, and supports GitHub Flavored Markdown"

"Image watermark tool that lets users add text or image watermarks,
with position, opacity, and rotation controls"

"PDF splitter that lets users select which pages to keep and download
the result as a new PDF"
```

---

## 📊 7. Admin Dashboard

### Features
- **Dashboard Tab:** Server stats, active users, CPU usage, uptime
- **Tool Maker Tab:** Generate new tools with AI
- **Monitoring Tab:** Real-time server monitoring
- **Responsive:** Mobile hamburger menu, desktop sidebar

### Accessing Admin Panel
```
/admin (protected route - needs authentication)
```

### Getting Stats
```typescript
// Endpoint returns:
{
  activeUsers: 42,
  cpuUsage: 35,
  rateLimitedIPs: 3,
  uptime: 99.9,
  totalRequests: 150000,
  apiRequests: 50000,
}
```

---

## 🔗 8. Rate Limiting

Already implemented in `server.ts`:
- **Limit:** 10 requests per 60 seconds per IP
- **Response:** 429 status code with retry info
- **Tracking:** Metrics on admin dashboard

### Usage in Components
```tsx
try {
  const response = await fetch('/api/some-endpoint', {
    method: 'POST',
    body: formData,
  });

  if (response.status === 429) {
    const data = await response.json();
    toast(`Rate limited. Retry in ${data.retryAfterMs / 1000}s`, 'warning');
  }
} catch (error) {
  // Handle error
}
```

---

## 🎨 9. Before/After Slider

Already exists in `src/components/image/BeforeAfterSlider.tsx`

### Usage
```tsx
import BeforeAfterSlider from '../components/image/BeforeAfterSlider';

export function ImageComparison() {
  return (
    <BeforeAfterSlider
      beforeSrc="/original-image.jpg"
      afterSrc="/compressed-image.jpg"
      alt="compression-result"
    />
  );
}
```

### Features
- Drag to compare before/after
- Mobile-friendly with range input
- Labeled Before/After tags
- Rounded corners with shadow
- Auto-adjusts to container width

---

## ✅ Integration Checklist

Use this to ensure all components are properly integrated:

- [ ] Toast provider in `App.tsx` (done)
- [ ] Toast used in tool pages for feedback
- [ ] Skeleton loaders replace spinners
- [ ] SEO metadata auto-set on tool pages
- [ ] Intl API used for dates/currency/sizes
- [ ] Honeypot in contact form
- [ ] Rate limiting responses handled
- [ ] Admin dashboard accessible at `/admin`
- [ ] Tool-maker API endpoints in `server.ts`
- [ ] Tools database includes SEO fields

---

## 🧪 Testing

### Test Toast System
1. Navigate to any tool
2. Perform an action (upload, copy, etc.)
3. Verify toast appears correctly
4. Check all 4 types work (success, error, warning, info)

### Test Skeleton Loaders
1. Simulate slow network (DevTools)
2. Navigate to tool page
3. Verify skeleton shows instead of spinner
4. Check animation is smooth

### Test SEO Metadata
1. View page source (Cmd+U on Mac, Ctrl+U on Windows)
2. Search for `<meta name="description"`
3. Verify og:image, og:title are set
4. Check JSON-LD schema in page

### Test Intl API
1. Change browser locale in DevTools
2. Reload page showing formatted data
3. Verify currency, date formats change

### Test Honeypot
1. Open form in DevTools
2. Fill hidden honeypot field
3. Submit form
4. Check console warns "Bot detected"

---

## 📚 Quick Reference

| Component | Import | Purpose |
|-----------|--------|---------|
| useToast | `context/ToastContext` | Show notifications |
| Skeleton | `components/Skeleton` | Loading placeholder |
| setMetaTags | `lib/seo` | Set page metadata |
| useToolMetadata | `lib/seo` | Auto-set metadata |
| useLocaleFormat | `lib/intl` | Format by locale |
| HoneypotField | `components/Honeypot` | Bot detection |
| AdminDashboard | `components/AdminDashboard` | Admin panel |
| ToolMaker | `components/ToolMaker` | AI tool generator |
| BeforeAfterSlider | `components/image/BeforeAfterSlider` | Image comparison |
| useToast | `context/ToastContext` | Toast notifications |

---

## 🚀 Next Steps

1. Add API endpoints to server for tool generation
2. Test all components thoroughly
3. Add TypeScript types for missing any
4. Write unit tests for utilities
5. Update tools-config.json with SEO fields
6. Deploy and monitor metrics
7. Iterate based on user feedback

---

**Last Updated:** March 31, 2026
**Blueprint Version:** 1.0
