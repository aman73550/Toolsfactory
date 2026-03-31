import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function BrokerageCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Brokerage Calculator"
      fields={[
        { key: 'turnover', label: 'Trade turnover', min: 1000, max: 50000000, step: 1000, defaultValue: 250000, prefix: '₹' },
        { key: 'brokerageRate', label: 'Brokerage rate', min: 0.01, max: 1, step: 0.01, defaultValue: 0.2, suffix: '%' },
        { key: 'otherCharges', label: 'Other charges rate', min: 0, max: 0.5, step: 0.01, defaultValue: 0.05, suffix: '%' }
      ]}
      summaryLabels={{ invested: 'Brokerage', returns: 'Other charges', total: 'Total cost' }}
      ctaLabel="CHECK PROFITABILITY"
      calculate={(values) => {
        const brokerage = values.turnover * values.brokerageRate / 100;
        const charges = values.turnover * values.otherCharges / 100;
        return {
          invested: brokerage,
          returns: charges,
          total: brokerage + charges
        };
      }}
    />
  );
}
