import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function MarginCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Margin Calculator"
      fields={[
        { key: 'capital', label: 'Available capital', min: 1000, max: 10000000, step: 1000, defaultValue: 100000, prefix: '₹' },
        { key: 'leverage', label: 'Leverage multiplier', min: 1, max: 20, step: 0.5, defaultValue: 5, suffix: 'x' },
        { key: 'move', label: 'Expected price move', min: -20, max: 20, step: 0.5, defaultValue: 2, suffix: '%' }
      ]}
      summaryLabels={{ invested: 'Capital used', returns: 'Potential P/L', total: 'Projected equity' }}
      ctaLabel="EVALUATE TRADE"
      calculate={(values) => {
        const exposure = values.capital * values.leverage;
        const pnl = exposure * values.move / 100;
        return {
          invested: values.capital,
          returns: Math.max(0, pnl),
          total: Math.max(0, values.capital + pnl)
        };
      }}
    />
  );
}
