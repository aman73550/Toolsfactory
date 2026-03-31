import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function SsyCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="SSY Calculator"
      fields={[
        { key: 'yearly', label: 'Yearly contribution', min: 1000, max: 150000, step: 1000, defaultValue: 100000, prefix: '₹' },
        { key: 'rate', label: 'Interest rate (p.a)', min: 1, max: 12, step: 0.1, defaultValue: 8, suffix: '%' },
        { key: 'years', label: 'Account duration', min: 1, max: 21, step: 1, defaultValue: 21, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        const r = values.rate / 100;
        const n = values.years;
        const yearly = values.yearly;
        const total = r > 0 ? yearly * ((Math.pow(1 + r, n) - 1) / r) : yearly * n;
        const invested = yearly * n;
        return {
          invested,
          returns: Math.max(0, total - invested),
          total
        };
      }}
    />
  );
}
