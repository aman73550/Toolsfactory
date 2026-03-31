import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function PpfCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="PPF Calculator"
      fields={[
        { key: 'yearly', label: 'Yearly investment', min: 500, max: 150000, step: 500, defaultValue: 150000, prefix: '₹' },
        { key: 'rate', label: 'Interest rate (p.a)', min: 1, max: 12, step: 0.1, defaultValue: 7.1, suffix: '%' },
        { key: 'years', label: 'Tenure', min: 1, max: 30, step: 1, defaultValue: 15, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        let total = 0;
        for (let i = 0; i < values.years; i += 1) {
          total = (total + values.yearly) * (1 + values.rate / 100);
        }
        const invested = values.yearly * values.years;
        return {
          invested,
          returns: Math.max(0, total - invested),
          total
        };
      }}
    />
  );
}
