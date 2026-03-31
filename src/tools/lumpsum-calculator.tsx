import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function LumpsumCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Lumpsum Calculator"
      fields={[
        { key: 'amount', label: 'One-time investment', min: 1000, max: 50000000, step: 1000, defaultValue: 500000, prefix: '₹' },
        { key: 'rate', label: 'Expected return rate (p.a)', min: 1, max: 20, step: 0.1, defaultValue: 12, suffix: '%' },
        { key: 'years', label: 'Investment period', min: 1, max: 40, step: 1, defaultValue: 10, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        const invested = values.amount;
        const total = invested * Math.pow(1 + values.rate / 100, values.years);
        return {
          invested,
          returns: Math.max(0, total - invested),
          total
        };
      }}
    />
  );
}
