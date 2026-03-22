import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-6">About Us</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-lg text-slate-600 mb-6">
          Welcome to All-in-One Tools, your premier destination for high-performance, privacy-first online utilities. 
          Founded with the mission to simplify digital workflows, we provide a comprehensive suite of tools designed 
          for professionals, developers, and everyday users.
        </p>
        <h2 className="text-2xl font-medium text-slate-900 mt-12 mb-4">Our Philosophy</h2>
        <p className="text-slate-600 mb-6">
          We believe that essential digital tools should be fast, accessible, and secure. That's why we prioritize 
          client-side processing whenever possible. By leveraging modern browser capabilities, your files—whether they 
          are sensitive PDFs, personal images, or confidential data—never leave your device unless absolutely necessary.
        </p>
        <h2 className="text-2xl font-medium text-slate-900 mt-12 mb-4">Enterprise-Grade Performance</h2>
        <p className="text-slate-600 mb-6">
          Our platform is built on cutting-edge web technologies, ensuring that tasks like image compression, PDF 
          manipulation, and data formatting happen with zero latency. We continuously expand our toolset to meet the 
          evolving needs of our global user base.
        </p>
      </div>
    </div>
  );
}
