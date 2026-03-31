import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function FdCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="FD Calculator"
      fields={[
        { key: 'principal', label: 'Deposit amount', min: 1000, max: 50000000, step: 1000, defaultValue: 1000000, prefix: '₹' },
        { key: 'rate', label: 'Interest rate (p.a)', min: 1, max: 12, step: 0.1, defaultValue: 7, suffix: '%' },
        { key: 'years', label: 'Tenure', min: 1, max: 20, step: 1, defaultValue: 5, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        const invested = values.principal;
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
