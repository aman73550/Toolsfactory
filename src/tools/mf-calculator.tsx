import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function MfCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="MF Calculator"
      fields={[
        { key: 'monthly', label: 'Monthly SIP amount', min: 500, max: 500000, step: 500, defaultValue: 15000, prefix: '₹' },
        { key: 'rate', label: 'Expected annual return', min: 1, max: 25, step: 0.1, defaultValue: 12, suffix: '%' },
        { key: 'years', label: 'Investment horizon', min: 1, max: 40, step: 1, defaultValue: 12, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        const monthlyRate = values.rate / 1200;
        const months = values.years * 12;
        const invested = values.monthly * months;
        const total = monthlyRate > 0
          ? values.monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
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
