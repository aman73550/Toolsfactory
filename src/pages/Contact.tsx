import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div>
          <h2 className="text-2xl font-medium text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-slate-600 mb-8">
            Have a question, feedback, or need support? Our team is here to help. Fill out the form, 
            and we'll get back to you as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-900">Corporate Headquarters</h3>
              <p className="text-slate-600 mt-1">
                123 Innovation Drive<br />
                Tech District, CA 94105<br />
                United States
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-900">Email</h3>
              <p className="text-slate-600 mt-1">support@allinonetools.com</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input type="text" id="name" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input type="email" id="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea id="message" rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
            <button className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
