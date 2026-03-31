import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function TdsCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="TDS Calculator"
      fields={[
        { key: 'income', label: 'Payment amount', min: 1000, max: 10000000, step: 1000, defaultValue: 500000, prefix: '₹' },
        { key: 'rate', label: 'TDS rate', min: 0.1, max: 30, step: 0.1, defaultValue: 10, suffix: '%' },
        { key: 'threshold', label: 'Exemption threshold', min: 0, max: 500000, step: 1000, defaultValue: 30000, prefix: '₹' }
      ]}
      summaryLabels={{ invested: 'TDS deduction', returns: 'Net receivable', total: 'Taxable amount' }}
      calculate={(values) => {
        const taxable = Math.max(0, values.income - values.threshold);
        const tds = taxable * (values.rate / 100);
        return {
          invested: tds,
          returns: Math.max(0, values.income - tds),
          total: taxable
        };
      }}
    />
  );
}
