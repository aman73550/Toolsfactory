import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function StockAverageCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Stock Average Calculator"
      fields={[
        { key: 'qty1', label: 'Existing quantity', min: 1, max: 100000, step: 1, defaultValue: 100 },
        { key: 'price1', label: 'Current average price', min: 1, max: 100000, step: 1, defaultValue: 350, prefix: '₹' },
        { key: 'qty2', label: 'Additional quantity', min: 1, max: 100000, step: 1, defaultValue: 50 },
        { key: 'price2', label: 'Buy price for new qty', min: 1, max: 100000, step: 1, defaultValue: 300, prefix: '₹' }
      ]}
      summaryLabels={{ invested: 'Existing cost', returns: 'Additional cost', total: 'Total invested cost' }}
      ctaLabel="CALCULATE AVERAGE"
      calculate={(values) => {
        const existingCost = values.qty1 * values.price1;
        const additionalCost = values.qty2 * values.price2;
        return {
          invested: existingCost,
          returns: additionalCost,
          total: existingCost + additionalCost
        };
      }}
    />
  );
}
