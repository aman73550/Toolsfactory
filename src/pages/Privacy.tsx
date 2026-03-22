import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none text-slate-600">
        <p className="mb-6">
          At All-in-One Tools, we take your privacy seriously. This Privacy Policy outlines how we collect, 
          use, and protect your information when you use our website and services.
        </p>
        
        <h2 className="text-2xl font-medium text-slate-900 mt-12 mb-4">1. Information We Collect</h2>
        <p className="mb-6">
          We collect minimal information necessary to provide our services. This includes standard web analytics 
          (such as IP addresses, browser types, and usage patterns) to help us improve our platform.
        </p>
        
        <h2 className="text-2xl font-medium text-slate-900 mt-12 mb-4">2. Client-Side Processing</h2>
        <p className="mb-6">
          A core tenet of our platform is privacy-by-design. Many of our tools, including image compression and 
          PDF manipulation, operate entirely within your web browser. This means your sensitive files are processed 
          locally on your device and are never uploaded to our servers.
        </p>
        
        <h2 className="text-2xl font-medium text-slate-900 mt-12 mb-4">3. Data Security</h2>
        <p className="mb-6">
          For tools that require server-side processing, we implement industry-standard security measures to protect 
          your data during transmission and processing. Files uploaded for processing are automatically deleted from 
          our servers immediately after the task is completed.
        </p>
        
        <h2 className="text-2xl font-medium text-slate-900 mt-12 mb-4">4. Third-Party Services</h2>
        <p className="mb-6">
          We may use trusted third-party services for analytics and hosting. These providers are bound by strict 
          confidentiality agreements and are not permitted to use your data for any other purposes.
        </p>
      </div>
    </div>
  );
}
