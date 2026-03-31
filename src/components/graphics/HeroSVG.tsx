import React from 'react';

/**
 * MinimalistHeroSVG - Performance-Optimized Hero Illustration
 *
 * Features:
 * - Inline SVG (0 HTTP requests)
 * - Zero gradient complexity (2 linear gradients only)
 * - Flat 2D design (Apple/Stripe aesthetic)
 * - Instant rendering + scalable
 * - Drop shadow: 0 1px 2px (ambient, not heavy)
 *
 * Performance: ~8KB inline + 0ms load time
 */
export function MinimalistHeroSVG() {
  return (
    <svg
      viewBox="0 0 500 400"
      className="w-full h-auto max-w-2xl mx-auto"
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.05))' }}
      aria-label="Productivity illustration"
    >
      <defs>
        {/* Primary Gradient: Indigo to Light Indigo */}
        <linearGradient
          id="heroGradientPrimary"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0.9" />
        </linearGradient>

        {/* Secondary Gradient: Light gray for accents */}
        <linearGradient
          id="heroGradientAccent"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#E2E8F0" stopOpacity="1" />
          <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Background subtle blob - opacity 0.02 (almost invisible) */}
      <circle cx="250" cy="200" r="200" fill="#4F46E5" opacity="0.02" />

      {/* DESKTOP WINDOW FRAME (Left side) */}
      <g>
        {/* Window outer frame */}
        <rect
          x="30"
          y="60"
          width="180"
          height="280"
          rx="12"
          fill="white"
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {/* Window title bar */}
        <rect x="30" y="60" width="180" height="40" rx="12" fill="#F8FAFC" />

        {/* Window title bar buttons */}
        <circle cx="50" cy="80" r="3" fill="#E2E8F0" />
        <circle cx="63" cy="80" r="3" fill="#E2E8F0" />
        <circle cx="76" cy="80" r="3" fill="#E2E8F0" />

        {/* Content: Fake text blocks (representing work) */}
        <rect x="45" y="115" width="150" height="10" rx="2" fill="#E2E8F0" />
        <rect x="45" y="132" width="120" height="7" rx="2" fill="#E2E8F0" />
        <rect x="45" y="145" width="150" height="7" rx="2" fill="#E2E8F0" />
        <rect x="45" y="158" width="140" height="7" rx="2" fill="#E2E8F0" />

        {/* Highlight box (active content) */}
        <rect
          x="45"
          y="180"
          width="150"
          height="50"
          rx="4"
          fill="url(#heroGradientPrimary)"
          opacity="0.1"
        />
        <rect
          x="45"
          y="180"
          width="150"
          height="50"
          rx="4"
          fill="none"
          stroke="url(#heroGradientPrimary)"
          strokeWidth="1"
        />

        {/* Bottom action buttons */}
        <rect
          x="45"
          y="250"
          width="65"
          height="32"
          rx="6"
          fill="url(#heroGradientPrimary)"
        />
        <text x="77.5" y="271" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
          Process
        </text>

        <rect
          x="130"
          y="250"
          width="65"
          height="32"
          rx="6"
          fill="url(#heroGradientAccent)"
        />
        <text x="162.5" y="271" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="600">
          Export
        </text>
      </g>

      {/* MOBILE PHONE FRAME (Right side) */}
      <g>
        {/* Phone body */}
        <rect
          x="250"
          y="100"
          width="120"
          height="240"
          rx="20"
          fill="white"
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {/* Phone notch */}
        <rect
          x="295"
          y="100"
          width="30"
          height="12"
          rx="6"
          fill="#1E293B"
        />

        {/* Phone screen background */}
        <rect
          x="258"
          y="120"
          width="104"
          height="200"
          rx="12"
          fill="#F8FAFC"
        />

        {/* Mobile status bar */}
        <rect
          x="258"
          y="120"
          width="104"
          height="20"
          fill="#1E293B"
          opacity="0.02"
        />

        {/* Mobile content blocks */}
        <rect x="268" y="145" width="84" height="8" rx="2" fill="#E2E8F0" />
        <rect x="268" y="160" width="70" height="6" rx="2" fill="#E2E8F0" />
        <rect x="268" y="172" width="84" height="6" rx="2" fill="#E2E8F0" />
        <rect x="268" y="184" width="75" height="6" rx="2" fill="#E2E8F0" />

        {/* Mobile CTA button */}
        <rect
          x="270"
          y="210"
          width="80"
          height="32"
          rx="6"
          fill="url(#heroGradientPrimary)"
        />
        <text x="310" y="231" textAnchor="middle" fill="white" fontSize="9" fontWeight="600">
          Get Started
        </text>
      </g>

      {/* CONNECTING ELEMENT (Optional subtle line with arrow style) */}
      <path
        d="M 210 200 Q 235 185 250 200"
        stroke="url(#heroGradientPrimary)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4,3"
        opacity="0.25"
      />

      {/* Decorative accent circle (top right) */}
      <circle
        cx="420"
        cy="100"
        r="35"
        fill="none"
        stroke="url(#heroGradientPrimary)"
        strokeWidth="0.5"
        opacity="0.1"
      />

      {/* Decorative accent circle (bottom left) */}
      <circle
        cx="80"
        cy="340"
        r="40"
        fill="none"
        stroke="url(#heroGradientPrimary)"
        strokeWidth="0.5"
        opacity="0.1"
      />
    </svg>
  );
}

export default MinimalistHeroSVG;
