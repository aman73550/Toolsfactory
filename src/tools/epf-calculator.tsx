import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function EpfCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="EPF Calculator"
      fields={[
        { key: 'employee', label: 'Employee monthly contribution', min: 500, max: 100000, step: 500, defaultValue: 5000, prefix: '₹' },
        { key: 'rate', label: 'Expected EPF return (p.a)', min: 1, max: 12, step: 0.1, defaultValue: 8.15, suffix: '%' },
        { key: 'years', label: 'Years of contribution', min: 1, max: 40, step: 1, defaultValue: 15, suffix: 'Yr' }
      ]}
      summaryLabels={{ invested: 'Total contribution', returns: 'Interest earned', total: 'Retirement corpus' }}
      calculate={(values) => {
        const totalMonthly = values.employee * 2;
        const monthlyRate = values.rate / 1200;
        const months = values.years * 12;
        const invested = totalMonthly * months;
        const total = monthlyRate > 0
          ? totalMonthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
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
