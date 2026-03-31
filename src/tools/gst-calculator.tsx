import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function GstCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="GST Calculator"
      fields={[
        { key: 'amount', label: 'Amount before GST', min: 100, max: 5000000, step: 100, defaultValue: 10000, prefix: '₹' },
        { key: 'rate', label: 'GST rate', min: 1, max: 28, step: 1, defaultValue: 18, suffix: '%' },
        { key: 'quantity', label: 'Quantity', min: 1, max: 1000, step: 1, defaultValue: 1 }
      ]}
      summaryLabels={{ invested: 'Base amount', returns: 'GST amount', total: 'Invoice total' }}
      ctaLabel="CREATE INVOICE"
      calculate={(values) => {
        const baseAmount = values.amount * values.quantity;
        const gstAmount = baseAmount * values.rate / 100;
        return {
          invested: baseAmount,
          returns: gstAmount,
          total: baseAmount + gstAmount
        };
      }}
    />
  );
}
