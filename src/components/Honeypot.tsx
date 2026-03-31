import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

/**
 * Honeypot Form Component
 * Contains hidden field to catch bots
 * Legitimate users won't fill this field
 */

interface HoneypotFieldProps {
  // The honeypot field name (should be something a bot might fill)
  fieldName?: string;
}

export const HoneypotField: React.FC<HoneypotFieldProps> = ({ fieldName = 'website' }) => {
  return (
    <input
      name={fieldName}
      type="text"
      style={{
        display: 'none',
        visibility: 'hidden',
      }}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
    />
  );
};

/**
 * Hook to check if honeypot field is filled
 * Returns true if bot suspected
 */
export const useHoneypotCheck = (fieldName = 'website') => {
  return (formElement: HTMLFormElement | null) => {
    if (!formElement) return false;

    const honeypot = formElement.elements.namedItem(fieldName) as HTMLInputElement;
    if (!honeypot) return false;

    return honeypot.value.length > 0;
  };
};

/**
 * Contact form example with honeypot protection
 */
export function ContactFormWithHoneypot() {
  const { add: toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const honeypotFieldName = 'contact_website';
  const [honeypot, setHoneypot] = useState('');
  const checkHoneypot = useHoneypotCheck(honeypotFieldName);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if honeypot is filled
    if (honeypot.length > 0) {
      console.warn('Honeypot triggered - likely bot');
      // Silently fail - don't reveal honeypot to bot
      toast('Form submitted successfully', 'success');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      toast('Please fill in all fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast('Message sent successfully!', 'success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast('Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast('An error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          required
        />
      </div>

      {/* HONEYPOT FIELD - Hidden from users */}
      <HoneypotField fieldName={honeypotFieldName} />
      <input
        type="text"
        value={honeypot}
        onChange={e => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

/**
 * Validation utilities for common bot patterns
 */
export const BotDetection = {
  /**
   * Check for suspicious patterns in form submission
   */
  isSuspicious(data: Record<string, string>): {
    suspicious: boolean;
    reason?: string;
  } {
    // Check for multiple URLs (common bot spam)
    const urlCount = Object.values(data).reduce((count, value) => {
      const urlMatches = value.match(/https?:\/\/|www\./gi);
      return count + (urlMatches?.length || 0);
    }, 0);

    if (urlCount > 1) {
      return { suspicious: true, reason: 'Multiple URLs detected' };
    }

    // Check for very short/long text
    const textLength = Object.values(data).join('').length;
    if (textLength < 5 || textLength > 10000) {
      return { suspicious: true, reason: 'Unusual text length' };
    }

    // Check for excessive special characters
    const specialCharCount = Object.values(data).join('').match(/[!@#$%^&*()_+=\[\]{};':"\\|,.<>?/]/g)?.length || 0;
    if (specialCharCount > textLength * 0.3) {
      return { suspicious: true, reason: 'Excessive special characters' };
    }

    return { suspicious: false };
  },
};
