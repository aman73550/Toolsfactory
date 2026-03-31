import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * Theme Toggle Button
 * Allows users to switch between Light, Dark, and System modes
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="
      flex items-center gap-1
      bg-[var(--bg-tertiary)]
      rounded-lg p-1
      border border-[var(--border-primary)]
    ">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center justify-center gap-1
            px-3 py-2 rounded text-sm font-medium
            transition-all duration-200
            focus-visible:outline-2 focus-visible:outline-[var(--accent)]
            ${theme === value
              ? 'bg-[var(--bg-secondary)] text-[var(--accent)] shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }
          `}
          title={`Switch to ${label} mode`}
          aria-label={`Theme: ${label}`}
          aria-pressed={theme === value}
        >
          <Icon size={18} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Compact Theme Toggle (Icon Only)
 * For headers and compact spaces
 */
export function ThemeToggleIcon() {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="
        p-2 rounded-lg
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        hover:bg-[var(--bg-tertiary)]
        transition-all
        focus-visible:outline-2 focus-visible:outline-[var(--accent)]
      "
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Theme toggle: currently ${isDark ? 'dark' : 'light'}`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
