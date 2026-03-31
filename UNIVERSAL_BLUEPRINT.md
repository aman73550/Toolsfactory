# 🎯 Universal Blueprint: Premium AI Tool Factory Website

**Master System Instructions for AI Agents**

Use this document as system instructions when building/maintaining the Toolsfactory website. Every rule here is tested, measurable, and non-negotiable.

---

## 📋 Quick Reference Checklist

- [ ] Color scheme: 60% White, 30% Slate, 10% Indigo
- [ ] All spacing in 8px multiples
- [ ] SVG icons only (Lucide/HeroIcons)
- [ ] Dynamic routing with `/tools/[slug]`
- [ ] Real-time previews on all tools
- [ ] Mobile-first responsive design
- [ ] SEO metadata auto-generated
- [ ] Rate limiting implemented
- [ ] Admin panel with AI tool-maker
- [ ] Zero-storage policy enforced

---

## 🎨 Section 1: Visual & Design Rules

### 1.1 Color System (60-30-10 Rule)

```
┌─────────────────────────────────────────────────┐
│ 60% Background (Primary)                        │
│ #FFFFFF - Pure White                            │
│─────────────────────────────────────────────────│
│ 30% Text/Borders (Secondary)                    │
│ #1E293B - Slate-900                             │
│─────────────────────────────────────────────────│
│ 10% Actions (Accent)                            │
│ #4F46E5 - Indigo-600                            │
└─────────────────────────────────────────────────┘
```

**Extended Palette:**
- Slate: #1E293B (text), #64748B (secondary), #E2E8F0 (borders)
- Indigo: #4F46E5 (primary), #4338CA (hover), #3730A3 (active)
- Danger: #EF4444 (errors)
- Success: #10B981 (confirmations)

**Implementation (Tailwind):**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#F8FAFC',
          900: '#0F172A',
          950: '#020617',
        },
      },
    },
  },
};
```

---

### 1.2 Icon System (No-AI, SVG Only)

**Approved Libraries:**
- ✅ Lucide-React
- ✅ HeroIcons
- ✅ Custom-drawn SVGs

**Banned:**
- ❌ AI-generated glossy icons
- ❌ 3D emoji-style icons
- ❌ Gradient-heavy icons
- ❌ Stock photo masks

**Implementation:**
```jsx
import { FileText, Download, Copy, AlertCircle } from 'lucide-react';

export function ToolIcon({ type }) {
  const icons = {
    file: <FileText size={20} className="text-slate-700" />,
    download: <Download size={20} className="text-indigo-600" />,
    copy: <Copy size={20} className="text-slate-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
  };
  return icons[type];
}
```

---

### 1.3 Spacing Grid (8px Multiples)

```
Token    Value    Usage
─────────────────────────────────────
xs       8px      Micro gaps
sm       16px     Component padding
md       24px     Section spacing
lg       32px     Large sections
xl       40px     Full-page gaps
2xl      48px     Massive gaps
3xl      64px     Hero sections
```

**Tailwind Classes:**
```
p-1  = 4px  ❌ BANNED
p-2  = 8px  ✅
p-4  = 16px ✅
p-6  = 24px ✅
p-8  = 32px ✅
```

**CSS Example:**
```css
/* ❌ Wrong */
padding: 12px;
margin-bottom: 20px;

/* ✅ Correct */
padding: 16px; /* p-4 or spacing-4 */
margin-bottom: 24px; /* mb-6 */
```

---

### 1.4 Ambient Shadow System

**Replace:** Heavy drop-shadows with multi-layered, subtle shadows

```css
/* ❌ Wrong - Too harsh */
box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

/* ✅ Correct - Ambient style */
box-shadow:
  0 1px 3px rgba(30, 41, 59, 0.04),
  0 4px 6px rgba(30, 41, 59, 0.06);

/* ✅ Hover state (subtle lift) */
box-shadow:
  0 4px 12px rgba(30, 41, 59, 0.08),
  0 12px 24px rgba(30, 41, 59, 0.06);
```

**Tailwind Configuration:**
```js
shadow: {
  ambient: '0 1px 3px rgba(30, 41, 59, 0.04), 0 4px 6px rgba(30, 41, 59, 0.06)',
  'ambient-lg': '0 4px 12px rgba(30, 41, 59, 0.08), 0 12px 24px rgba(30, 41, 59, 0.06)',
}
```

---

### 1.5 Card Styling (Flat Modern)

```jsx
// ✅ Correct card component
export function Card({ children, interactive = false }) {
  return (
    <div
      className={`
        bg-white
        border border-slate-200
        rounded-8px
        ${interactive ? 'hover:shadow-ambient-lg hover:-translate-y-1 transition-all' : 'shadow-ambient'}
      `}
    >
      {children}
    </div>
  );
}

// ❌ Wrong - Too many effects
// gradient overlays, heavy shadows, glass effects on cards
```

**Card Parts:**
```jsx
<Card>
  {/* Header with 1px border-bottom */}
  <div className="px-6 py-4 border-b border-slate-200">
    <h3 className="text-slate-900">Card Title</h3>
  </div>

  {/* Body */}
  <div className="px-6 py-4">Content</div>

  {/* Footer - optional */}
  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
    Actions
  </div>
</Card>
```

---

### 1.6 Amorphous Backgrounds (Soft Depth)

**Use Case:** Hero sections, empty states, highlights

```css
/* ✅ Radial gradient blob (light pink/red) */
background: radial-gradient(
  circle at 30% 60%,
  rgba(252, 165, 165, 0.15) 0%,
  transparent 50%
),
radial-gradient(
  circle at 70% 40%,
  rgba(254, 202, 202, 0.1) 0%,
  transparent 50%
);

/* ✅ Blurred SVG blob */
<svg className="absolute inset-0 w-full opacity-20" preserveAspectRatio="none">
  <filter id="blur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
  </filter>
  <path filter="url(#blur)" d="..." fill="#FCA5A5" />
</svg>
```

**Implementation:**
```jsx
export function HeroSection() {
  return (
    <div className="relative bg-white overflow-hidden">
      {/* Amorphous background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-white opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        {/* Hero content */}
      </div>
    </div>
  );
}
```

---

### 1.7 Backdrop Blur (Glassmorphism)

**Use Case:** Headers, modals, overlays

```css
/* ✅ Subtle glass effect */
background: rgba(255, 255, 255, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(226, 232, 240, 0.5);

/* ✅ For overlays */
background: rgba(15, 23, 42, 0.5);
backdrop-filter: blur(8px);
```

**React Component:**
```jsx
export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white/80 backdrop-blur-[12px] border-b border-slate-200/50">
        {/* Header content */}
      </div>
    </header>
  );
}
```

---

### 1.8 Typography (System Fonts Only)

**Font Stack:**
```css
/* Inter or Geist (Web) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter';

/* SF Pro (Apple) */
font-family: system-ui, -apple-system, sans-serif;

/* ❌ Banned */
/* Google Fonts decorative fonts, Script fonts, Shadows */
```

**Text Hierarchy:**
```
Hero Title      → 48px, bold (600), -1px tracking
Page Title      → 32px, bold (600), 0px tracking
Section Title   → 24px, semi-bold (600), 0px tracking
Paragraph       → 16px, regular (400), 0.5px tracking
Small           → 14px, regular (400), 0px tracking
Micro           → 12px, medium (500), 0.5px tracking
```

---

## ⚙️ Section 2: Technical Architecture Rules

### 2.1 Dynamic Routing (Zero Clutter)

**File Structure:**
```
app/
├── tools/
│   ├── [slug]/
│   │   └── page.jsx            # Single dynamic route handles all tools
│   ├── layout.jsx
│   └── not-found.jsx
├── admin/
│   ├── dashboard/
│   ├── tools/
│   └── layout.jsx
└── api/
    ├── tools/
    ├── rate-limit/
    └── admin/
```

**URL Pattern:**
```
/tools/image-compressor
/tools/pdf-merger
/tools/video-converter
/tools/code-formatter
```

**Implementation (Next.js):**
```jsx
// app/tools/[slug]/page.jsx
import { getTool } from '@/lib/tools';
import ToolComponent from '@/components/ToolContainer';

export async function generateStaticParams() {
  const tools = await getTool.all();
  return tools.map(tool => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }) {
  const tool = await getTool.bySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return <ToolComponent tool={tool} />;
}
```

**Tools Database (JSON):**
```json
{
  "tools": [
    {
      "id": "img-compress",
      "slug": "image-compressor",
      "name": "Image Compressor",
      "description": "Compress images without quality loss",
      "category": "image",
      "component": "ImageCompressor",
      "icon": "ImageIcon",
      "supported_formats": ["jpg", "png", "webp"],
      "max_file_size_mb": 50
    }
  ]
}
```

---

### 2.2 Code-First Priority (System Libraries)

**Use This Stack:**
```
Image Processing   → Sharp.js (server) or Canvas API (client)
Video/Audio        → FFmpeg.wasm (client-side)
PDF Handling       → PDF-lib (client-side)
Code Formatting    → Prettier (client-side)
File Compression   → Pako (client-side)
```

**Only Use AI APIs When:**
- ❌ Task is impossible with libraries
- ✅ Text generation (GPT, Claude)
- ✅ Image generation (DALL-E)
- ✅ OCR (Vision models)

**Implementation Example (Sharp):**
```js
// api/compress-image
import sharp from 'sharp';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  const buffer = await file.arrayBuffer();
  const compressed = await sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return new Response(compressed, {
    headers: { 'Content-Type': 'image/webp' },
  });
}
```

---

### 2.3 Zero-Storage Policy

**Rule:** No files stored on server permanently

**Implementation:**
```js
// Auto-delete files after 2 hours
const FILE_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

export async function cleanupOldFiles() {
  const files = await getUploadedFiles();
  const now = Date.now();

  for (const file of files) {
    if (now - file.createdAt > FILE_EXPIRY_MS) {
      await deleteFile(file.path);
      await deleteFileRecord(file.id);
    }
  }
}

// Run every 10 minutes
setInterval(cleanupOldFiles, 10 * 60 * 1000);
```

**User Flow:**
1. Upload file → Processed immediately in memory/client
2. Download result → Temporary URL (2-hour expiry)
3. Auto-deleted → No permanent storage

---

### 2.4 System-Side Processing (Client > Server)

**Priority Order:**
1. **Client-side first** (best UX, zero server cost)
2. **Server-side if needed** (when >50MB or complex)
3. **Streaming** (for large files)

**Client-Side Example (Image Compression):**
```jsx
const ImageCompressor = () => {
  const [processing, setProcessing] = useState(false);

  const handleCompress = async (file) => {
    setProcessing(true);

    // All processing happens in browser
    const canvas = await createCanvas();
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1920, 1080);
      const compressed = canvas.toBlob(blob => {
        triggerDownload(blob, 'compressed.jpg');
        setProcessing(false);
      });
    };

    img.src = URL.createObjectURL(file);
  };

  return <DropZone onDrop={handleCompress} />;
};
```

---

### 2.5 Intl API (Regional Intelligence)

**Auto-detect user location & preferences:**

```js
export function getLocaleConfig() {
  const locale = navigator.language; // 'en-US', 'hi-IN', etc.

  return {
    locale,
    // Date format based on locale
    dateFormat: new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    // Currency based on locale
    currency: getCurrencyByLocale(locale),
    // Time format (12-hour vs 24-hour)
    timeFormat: locale.startsWith('en-US') ? '12-hour' : '24-hour',
  };
}
```

**Implementation:**
```jsx
export function FileSize({ bytes }) {
  const { locale } = getLocaleConfig();
  const size = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 2,
  }).format(bytes / 1024 / 1024);

  return <span>{size}</span>;
}

export function Timestamp({ date }) {
  const { dateFormat, timeFormat } = getLocaleConfig();
  return <time>{dateFormat.format(date)}</time>;
}
```

---

### 2.6 Lazy Loading (Tool-Specific Logic)

**Goal:** Keep homepage <50KB

```jsx
// app/page.jsx (Hero + Search only)
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SearchTools />
      {/* No tool cards on homepage */}
    </main>
  );
}

// Each tool loads separately
// app/tools/[slug]/page.jsx
export default async function ToolPage({ params }) {
  // This component only loads when user visits /tools/[slug]
  const tool = await getTool.bySlug(params.slug);
  const ToolComponent = dynamic(() =>
    import(`@/tools/${tool.component}`),
    { loading: () => <ToolSkeleton /> }
  );

  return <ToolComponent tool={tool} />;
}
```

---

## 🔍 Section 3: SEO & Content Rules

### 3.1 Standalone Tool Pages

**Structure per tool page:**
```
/tools/[slug]/
├── Hero Section (Tool title + quick description)
├── Live Preview (Before/After slider)
├── Feature Highlights (3-4 key features)
├── Deep Dive Blog (500-800 words, educational)
├── FAQ Section (5-8 questions, JSON-LD wrapped)
├── CTA Section (Primary action)
└── Related Tools (2-3 links to similar tools)
```

**Example URL:** `/tools/image-compressor`

---

### 3.2 No-AI Copywriting

**Banned Phrases:**
```
❌ Transform
❌ Unleash
❌ Seamless
❌ Next-generation
❌ Cutting-edge
❌ Powerful
❌ Revolutionary
❌ Empower
❌ Streamline
❌ Effortless
```

**Replacement (Human, Direct):**
```
❌ "Transform your images with our powerful tool"
✅ "Reduce image file size by 60% without losing quality"

❌ "Unleash the full potential of PDF editing"
✅ "Merge, split, and rotate PDF pages in seconds"

❌ "Streamline your workflow"
✅ "Convert 50 files at once; done in 30 seconds"
```

**Writing Tone:**
- Direct & functional
- Benefit-focused (not feature-focused)
- Numbers & specifics (avoid vague claims)
- Active voice
- Short sentences

---

### 3.3 Schema-Ready FAQs

**Implementation:**
```jsx
export function ToolFAQ({ tool }) {
  const faqs = [
    {
      question: "What file formats do you support?",
      answer: "We support JPG, PNG, WebP, and TIFF."
    },
    // ... 4-7 more FAQs
  ];

  return (
    <>
      {/* Visual FAQ component */}
      <div className="space-y-4">
        {faqs.map(faq => (
          <FAQItem key={faq.question} {...faq} />
        ))}
      </div>

      {/* Hidden JSON-LD for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>
    </>
  );
}
```

---

### 3.4 Deep-Dive Blog Content

**Per tool: 500-800 words, includes:**

1. **Problem statement** (Why users need this)
2. **Technical explanation** (How it works at 10,000 ft)
3. **Use cases** (Real-world scenarios)
4. **Best practices** (Tips for best results)
5. **Comparison** (vs alternatives, if any)

**Example Structure:**
```
# Image Compression: The Complete Guide

## What is Image Compression?
Explanation of lossy vs lossless...

## When Do You Need to Compress Images?
- Large photo collections
- Website optimization
- Email attachments
- Social media uploading

## How This Tool Works
Our compressor uses WASM-powered optimization...

## Best Practices
1. Always keep originals
2. Use WebP for modern browsers
3. Balance quality vs size

## Quality vs File Size: Finding the Sweet Spot
Comparison table with examples...
```

---

### 3.5 Automated Metadata

```jsx
// lib/seo.js
export function generateToolMetadata(tool) {
  return {
    title: `${tool.name} - Free Online Tool`,
    description: tool.shortDescription,
    openGraph: {
      title: tool.name,
      description: tool.shortDescription,
      image: tool.previewImage,
      url: `https://toolsfactory.io/tools/${tool.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.name,
      description: tool.shortDescription,
    },
  };
}

// app/tools/[slug]/layout.jsx
export async function generateMetadata({ params }) {
  const tool = await getTool.bySlug(params.slug);
  return generateToolMetadata(tool);
}
```

---

## 🛡️ Section 4: UX & Security Rules

### 4.1 Real-Time Preview Engine

**Before/After Slider:**
```jsx
export function PreviewSlider({ before, after }) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative overflow-hidden rounded-lg bg-white border border-slate-200">
      {/* Before image */}
      <img src={before} alt="Before" className="w-full" />

      {/* After image with reveal */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img src={after} alt="After" className="w-full" />
      </div>

      {/* Draggable divider */}
      <div
        className="absolute top-0 w-1 h-full bg-white cursor-col-resize shadow-lg"
        style={{ left: `${sliderPos}%` }}
        onMouseMove={e => {
          const rect = e.currentTarget.parentElement.getBoundingClientRect();
          setSliderPos((e.clientX - rect.left) / rect.width * 100);
        }}
      />
    </div>
  );
}
```

**Live Rendering (Real-time as user uploads):**
```jsx
const LivePreview = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!file) return;

    // Process in real-time
    processFile(file).then(result => {
      setPreview(result.preview);
      setStats({
        originalSize: file.size,
        compressedSize: result.size,
        reduction: ((1 - result.size / file.size) * 100).toFixed(1) + '%',
      });
    });
  }, [file]);

  return (
    <div className="space-y-4">
      <PreviewSlider before={file} after={preview} />
      <StatsCard stats={stats} />
    </div>
  );
};
```

---

### 4.2 IP-Based Rate Limiting

```js
// middleware.js
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 files per minute
});

export async function middleware(request) {
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 });
  }

  // Add rate limit info to response headers
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit);
  response.headers.set('X-RateLimit-Remaining', remaining);
  response.headers.set('X-RateLimit-Reset', reset);
  return response;
}

export const config = {
  matcher: ['/api/tools/:path*'],
};
```

---

### 4.3 Skeleton Loaders

**Instead of "Loading..." text, show layout skeleton:**

```jsx
export function ToolSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-12 bg-slate-200 rounded-lg w-1/2" />
      <div className="h-4 bg-slate-200 rounded-lg w-2/3" />

      {/* Upload area skeleton */}
      <div className="h-64 bg-slate-100 border-2 border-dashed rounded-lg" />

      {/* Preview area skeleton */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-40 bg-slate-200 rounded-lg" />
        <div className="h-40 bg-slate-200 rounded-lg" />
      </div>

      {/* Button skeleton */}
      <div className="h-10 bg-indigo-200 rounded-lg w-1/4" />
    </div>
  );
}

// CSS animation
export const skeleton = css`
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  animation: shimmer 2s infinite;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
`;
```

---

### 4.4 Toast Notifications

```jsx
// hooks/useToast.js
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, add };
}

// Component
export function Toast({ message, type = 'info' }) {
  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <AlertCircle size={20} />,
  };

  const colors = {
    success: 'bg-green-50 text-green-900 border-green-200',
    error: 'bg-red-50 text-red-900 border-red-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
  };

  return (
    <div className={`
      ${colors[type]}
      border rounded-lg px-4 py-3 flex items-center gap-3
      shadow-sm animate-slide-in
    `}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

// Usage
const { add: toast } = useToast();
toast('Image copied to clipboard!', 'success');
toast('File too large. Max 50MB.', 'error');
```

---

### 4.5 Micro-Interactions

```css
/* Hover lift on interactive elements */
.interactive-element {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(30, 41, 59, 0.08);
}

.interactive-element:active {
  transform: scale(0.98);
}

/* Button states */
.btn {
  @apply transition-all duration-200 ease-out;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.btn:active {
  transform: scale(0.98) translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
```

**React Example:**
```jsx
export function Button({ children, onClick, disabled }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`
        px-4 py-2 bg-indigo-600 text-white rounded-lg
        transition-all duration-200
        ${isPressed ? 'scale-98' : 'hover:-translate-y-1'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
}
```

---

### 4.6 Invisible Security

**Honeypot Fields:**
```jsx
export function ContactForm() {
  const [website, setWebsite] = useState(''); // Honeypot

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If honeypot is filled, it's a bot
    if (website) {
      console.warn('Bot detected');
      return;
    }

    // Legitimate submission
    await submitForm(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        required
      />

      {/* Hidden honeypot */}
      <input
        name="website"
        value={website}
        onChange={e => setWebsite(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

**WAF Rules (Cloudflare/Vercel):**
```json
{
  "rules": [
    {
      "match": "http.request.headers[\"user-agent\"] == \"\"",
      "action": "block"
    },
    {
      "match": "cf.bot_management.score < 30",
      "action": "challenge"
    },
    {
      "match": "http.request.uri.query_string contains \"<script\"",
      "action": "block"
    }
  ]
}
```

---

## 🏗️ Section 5: Admin Panel Control

### 5.1 AI Tool-Maker Agent

**Purpose:** Admin provides prompt → AI generates tool code + SEO + route

```jsx
// Admin interface
export function ToolMakerGPT() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedTool, setGeneratedTool] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);

    const response = await fetch('/api/admin/generate-tool', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    const tool = await response.json();
    setGeneratedTool(tool);
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <label>Tool Concept (describe what this tool does)</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g., A tool that converts Markdown to HTML with live preview"
          rows={4}
        />
      </div>

      <button onClick={handleGenerate} disabled={generating}>
        {generating ? 'Generating...' : 'Generate Tool'}
      </button>

      {generatedTool && (
        <ToolPreview tool={generatedTool} />
      )}
    </div>
  );
}
```

**Backend (AI Agent Call):**
```js
// api/admin/generate-tool
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request) {
  const { prompt } = await request.json();

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    system: `You are an expert React/Next.js developer. Generate complete tool code based on user prompts.

    Output JSON with this structure:
    {
      "name": "Tool name",
      "slug": "kebab-case-slug",
      "description": "Short description",
      "component": "import React...",
      "seoTitle": "SEO title",
      "seoDescription": "SEO description",
      "blogContent": "500+ words of educational content",
      "faqs": [{"q": "...", "a": "..."}]
    }`,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const tool = JSON.parse(response.content[0].text);

  // Save to database
  await saveTool(tool);

  return Response.json(tool);
}
```

---

### 5.2 Responsive Dashboard

**Structure:**
```
Desktop Layout:
┌─────────────────────────────────────┐
│ ☰ Sidebar (240px)  │ Main Content  │
│                    │               │
│ • Dashboard        │   ┌─────────┐ │
│ • Tools            │   │ Charts  │ │
│ • Users            │   └─────────┘ │
│ • Analytics        │               │
│ • Settings         │   ┌─────────┐ │
└─────────────────────────────────────┘

Mobile Layout:
┌─────────────┐
│ ☰ Dashboard │
├─────────────┤
│ Main        │
│ Content     │
│             │
│ ┌─────────┐ │
│ │ Charts  │ │
│ └─────────┘ │
└─────────────┘
```

**Implementation:**
```jsx
export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'w-60' : 'w-0'}
        bg-white border-r border-slate-200
        transition-all duration-300
        fixed md:relative z-50 md:z-auto
        h-full
      `}>
        <AdminNav />
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-4"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="p-6">
          {/* Page content */}
        </div>
      </main>
    </div>
  );
}
```

---

### 5.3 Live Monitor Dashboard

```jsx
export function AdminMonitor() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('/api/admin/monitor');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(data);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Active Users */}
      <Card>
        <div className="text-3xl font-bold text-indigo-600">
          {stats?.activeUsers}
        </div>
        <div className="text-sm text-slate-600">Active Users Now</div>
      </Card>

      {/* Server Health */}
      <Card>
        <div className={`text-3xl font-bold ${
          stats?.cpuUsage < 70 ? 'text-green-600' : 'text-red-600'
        }`}>
          {stats?.cpuUsage}%
        </div>
        <div className="text-sm text-slate-600">CPU Usage</div>
      </Card>

      {/* Rate Limited IPs */}
      <Card>
        <div className="text-3xl font-bold text-slate-900">
          {stats?.rateLimitedIPs}
        </div>
        <div className="text-sm text-slate-600">Rate Limited Today</div>
        <button className="text-indigo-600 text-sm mt-2">View List</button>
      </Card>

      {/* Uptime */}
      <Card>
        <div className="text-3xl font-bold text-green-600">
          {stats?.uptime}%
        </div>
        <div className="text-sm text-slate-600">30-Day Uptime</div>
      </Card>
    </div>
  );
}
```

---

## 📋 Implementation Checklist

Use this to verify every aspect is implemented:

```
DESIGN
☐ Color scheme matches 60-30-10
☐ All icons are from Lucide/HeroIcons
☐ Spacing uses 8px grid
☐ Shadows are ambient style
☐ Cards are flat with 1px borders
☐ Backgrounds use subtle gradients
☐ Headers have backdrop blur
☐ Typography uses system fonts

TECHNICAL
☐ Dynamic routing in place
☐ Database of tools created
☐ Code-first libraries configured (Sharp, FFmpeg, PDF-lib)
☐ Zero-storage policy implemented
☐ Client-side processing prioritized
☐ Intl API integrated for localization
☐ Lazy loading on tool pages
☐ Tool pages are under /tools/[slug]

SEO
☐ Standalone pages for each tool
☐ No AI cliches in copy
☐ FAQ sections with JSON-LD schema
☐ Blog content (500-800 words) per tool
☐ Metadata auto-generated
☐ Proper Open Graph tags

UX & SECURITY
☐ Before/After preview slider
☐ Real-time preview engine
☐ Rate limiting (10 files/min)
☐ Skeleton loaders instead of spinners
☐ Toast notifications working
☐ Hover lift & active states
☐ Honeypot fields implemented
☐ WAF rules in place

ADMIN
☐ AI tool-maker agent works
☐ Dashboard responsive (mobile/desktop)
☐ Live monitoring active
☐ Admin can generate new tools via prompt
```

---

## 🚀 Quick Start for AI Agents

**When implementing this blueprint:**

1. **First 15 minutes:** Read Sections 1-2 thoroughly
2. **Color & Spacing:** Copy CSS variables from Section 1.1 & 1.3
3. **Architecture:** Set up `/tools/[slug]` routing (Section 2.1)
4. **Add one tool:** Image Compressor (test the blueprint)
5. **SEO & Content:** Write tool pages following Section 3
6. **UX Polish:** Implement preview engines + micro-interactions
7. **Security:** Rate limiting + honeypot fields
8. **Admin:** Connect Anthropic API for tool generation

**Key Files to Create:**
```
tailwind.config.js          # Color & spacing tokens
lib/seo.js                  # Metadata generation
lib/tools.db.json           # Tools database
components/Card.jsx         # Base card component
components/ToolContainer.jsx # Dynamic container
api/tools/[slug]/route.js   # Processing endpoints
middleware.js               # Rate limiting
admin/ToolMaker.jsx         # AI agent UI
```

---

## 📞 Questions & Clarifications

**If unclear on any rule:**
1. Check the "Quick Reference" at top
2. Look for "Implementation" subsections with code
3. Review the checklist to verify compliance

**This document is your source of truth.** Every pixel, every interaction, every word follows these rules.

---

**Last Updated:** March 2026 | **Version:** 1.0
