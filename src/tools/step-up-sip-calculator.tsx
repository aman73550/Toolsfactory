import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function StepUpSipCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Step-Up SIP Calculator"
      fields={[
        { key: 'monthly', label: 'Starting monthly SIP', min: 500, max: 300000, step: 500, defaultValue: 10000, prefix: '₹' },
        { key: 'stepUp', label: 'Yearly step-up', min: 0, max: 50, step: 1, defaultValue: 10, suffix: '%' },
        { key: 'rate', label: 'Expected return rate (p.a)', min: 1, max: 20, step: 0.1, defaultValue: 12, suffix: '%' },
        { key: 'years', label: 'Investment period', min: 1, max: 40, step: 1, defaultValue: 15, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        const monthlyRate = values.rate / 1200;
        let monthlySip = values.monthly;
        let invested = 0;
        let corpus = 0;

        for (let year = 1; year <= values.years; year += 1) {
          for (let month = 1; month <= 12; month += 1) {
            corpus += monthlySip;
            invested += monthlySip;
            corpus *= (1 + monthlyRate);
          }
          monthlySip *= (1 + values.stepUp / 100);
        }

        return {
          invested,
          returns: Math.max(0, corpus - invested),
          total: corpus
        };
      }}
    />
  );
}
