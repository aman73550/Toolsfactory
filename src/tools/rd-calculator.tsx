import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function RdCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="RD Calculator"
      fields={[
        { key: 'monthly', label: 'Monthly deposit', min: 500, max: 500000, step: 500, defaultValue: 5000, prefix: '₹' },
        { key: 'rate', label: 'Interest rate (p.a)', min: 1, max: 12, step: 0.1, defaultValue: 7.2, suffix: '%' },
        { key: 'years', label: 'Tenure', min: 1, max: 20, step: 1, defaultValue: 5, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        const monthlyRate = values.rate / 1200;
        const months = values.years * 12;
        const invested = values.monthly * months;
        const total = monthlyRate > 0
          ? values.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
          : invested;

        return {
          invested,
          returns: Math.max(0, total - invested),
          total
        };
      }}
    />
  );
}
