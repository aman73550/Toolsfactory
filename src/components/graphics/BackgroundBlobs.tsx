import React from 'react';

/**
 * BackgroundBlobs - Subtle Amorphous Background Shapes
 *
 * Features:
 * - CSS radial-gradient (no image files)
 * - Opacity: 0.03-0.04 (almost invisible but adds depth)
 * - Positioned behind all content (z-index: -1)
 * - Zero jank (no blur filters on moving elements)
 * - Infinite scalability (CSS-only)
 *
 * Performance: ~2KB CSS + 0ms load time
 */
export function BackgroundBlobs() {
  return (
    <>
      {/* Global styles for background blobs */}
      <style>{`
        /* Hero section background blob configuration */
        .blob-container {
          position: relative;
          overflow: hidden;
        }

        /* Primary blob: Top right corner (Indigo) */
        .blob-container::before {
          content: '';
          position: absolute;
          top: -80px;
          right: -120px;
          width: 600px;
          height: 600px;
          background: radial-gradient(
            circle at 40% 60%,
            rgba(79, 70, 229, 0.04) 0%,
            rgba(79, 70, 229, 0.02) 50%,
            transparent 75%
          );
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
        }

        /* Secondary blob: Bottom left corner (Slate) */
        .blob-container::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(30, 41, 59, 0.03) 0%,
            rgba(30, 41, 59, 0.01) 60%,
            transparent 75%
          );
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
        }

        /* Tertiary accent: Header floating blob (very subtle) */
        .blob-accent {
          position: fixed;
          top: 0;
          right: 0;
          width: 400px;
          height: 400px;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(99, 102, 241, 0.02) 0%,
            transparent 70%
          );
          border-radius: 50%;
          z-index: -1;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        /* Responsive: Reduce blob size on mobile */
        @media (max-width: 768px) {
          .blob-container::before {
            top: -60px;
            right: -100px;
            width: 400px;
            height: 400px;
          }

          .blob-container::after {
            bottom: -80px;
            left: -120px;
            width: 350px;
            height: 350px;
          }

          .blob-accent {
            width: 300px;
            height: 300px;
          }
        }

        /* Dark mode: Adjust blob colors for dark background */
        @media (prefers-color-scheme: dark) {
          .blob-container::before {
            background: radial-gradient(
              circle at 40% 60%,
              rgba(167, 139, 250, 0.05) 0%,
              rgba(167, 139, 250, 0.02) 50%,
              transparent 75%
            );
          }

          .blob-container::after {
            background: radial-gradient(
              circle at 50% 50%,
              rgba(226, 232, 240, 0.02) 0%,
              rgba(226, 232, 240, 0.01) 60%,
              transparent 75%
            );
          }

          .blob-accent {
            background: radial-gradient(
              circle at 30% 30%,
              rgba(167, 139, 250, 0.03) 0%,
              transparent 70%
            );
          }
        }

        /* Prevent content from being covered by blobs */
        body {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Floating accent blob (optional, can be removed if too much) */}
      <div className="blob-accent" aria-hidden="true" />
    </>
  );
}

/**
 * BlobContainer Component Wrapper
 *
 * Usage:
 * <BlobContainer>
 *   <YourContent />
 * </BlobContainer>
 */
export function BlobContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="blob-container">
      {children}
    </div>
  );
}

export default BackgroundBlobs;
