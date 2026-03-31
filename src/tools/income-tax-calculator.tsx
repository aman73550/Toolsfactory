import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

function progressiveTax(income: number) {
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.1 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.2 }
  ];

  let tax = 0;
  let previousLimit = 0;

  slabs.forEach((slab) => {
    if (income > slab.limit) {
      tax += (slab.limit - previousLimit) * slab.rate;
      previousLimit = slab.limit;
    }
  });

  if (income > 1500000) {
    tax += (income - 1500000) * 0.3;
  }

  return tax;
}

export default function IncomeTaxCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Income Tax Calculator"
      fields={[
        { key: 'income', label: 'Annual income', min: 100000, max: 50000000, step: 10000, defaultValue: 1800000, prefix: '₹' },
        { key: 'deductions', label: 'Eligible deductions', min: 0, max: 3000000, step: 10000, defaultValue: 150000, prefix: '₹' },
        { key: 'cess', label: 'Health & education cess', min: 0, max: 10, step: 0.5, defaultValue: 4, suffix: '%' }
      ]}
      summaryLabels={{ invested: 'Tax payable', returns: 'Post-tax income', total: 'Taxable income' }}
      ctaLabel="PLAN TAX"
      calculate={(values) => {
        const taxableIncome = Math.max(0, values.income - values.deductions);
        const baseTax = progressiveTax(taxableIncome);
        const totalTax = baseTax * (1 + values.cess / 100);

        return {
          invested: totalTax,
          returns: Math.max(0, values.income - totalTax),
          total: taxableIncome
        };
      }}
    />
  );
}
