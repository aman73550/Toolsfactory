import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function SalaryCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Salary Calculator"
      fields={[
        { key: 'ctc', label: 'Annual CTC', min: 120000, max: 10000000, step: 10000, defaultValue: 1200000, prefix: '₹' },
        { key: 'bonus', label: 'Annual bonus', min: 0, max: 2000000, step: 5000, defaultValue: 100000, prefix: '₹' },
        { key: 'deductions', label: 'Annual deductions', min: 0, max: 2000000, step: 5000, defaultValue: 150000, prefix: '₹' }
      ]}
      summaryLabels={{ invested: 'Take-home salary', returns: 'Deductions', total: 'Gross package' }}
      calculate={(values) => {
        const gross = values.ctc + values.bonus;
        const takeHome = Math.max(0, gross - values.deductions);
        return {
          invested: takeHome,
          returns: values.deductions,
          total: gross
        };
      }}
    />
  );
}
