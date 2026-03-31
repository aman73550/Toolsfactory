import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function SwpCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="SWP Calculator"
      fields={[
        { key: 'corpus', label: 'Initial corpus', min: 10000, max: 100000000, step: 10000, defaultValue: 3000000, prefix: '₹' },
        { key: 'withdrawal', label: 'Monthly withdrawal', min: 1000, max: 1000000, step: 1000, defaultValue: 25000, prefix: '₹' },
        { key: 'rate', label: 'Expected return rate (p.a)', min: 1, max: 20, step: 0.1, defaultValue: 10, suffix: '%' },
        { key: 'years', label: 'Withdrawal period', min: 1, max: 30, step: 1, defaultValue: 10, suffix: 'Yr' }
      ]}
      summaryLabels={{ invested: 'Initial corpus', returns: 'Net gains', total: 'Final value + withdrawn' }}
      calculate={(values) => {
        let balance = values.corpus;
        const monthlyRate = values.rate / 1200;
        const months = values.years * 12;
        let withdrawn = 0;

        for (let m = 0; m < months; m += 1) {
          balance = balance * (1 + monthlyRate);
          const draw = Math.min(values.withdrawal, balance);
          balance -= draw;
          withdrawn += draw;
          if (balance <= 0) break;
        }

        const total = balance + withdrawn;
        return {
          invested: values.corpus,
          returns: Math.max(0, total - values.corpus),
          total
        };
      }}
    />
  );
}
