import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function SipCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="SIP Calculator"
      tabs={["SIP", "Lumpsum"]}
      fields={[
        { key: 'monthly', label: 'Monthly investment', min: 500, max: 300000, step: 500, defaultValue: 25000, prefix: '₹' },
        { key: 'rate', label: 'Expected return rate (p.a)', min: 1, max: 25, step: 0.1, defaultValue: 12, suffix: '%' },
        { key: 'years', label: 'Time period', min: 1, max: 40, step: 1, defaultValue: 10, suffix: 'Yr' }
      ]}
      calculate={(values) => {
        const monthly = values.monthly;
        const monthlyRate = values.rate / 1200;
        const months = values.years * 12;
        const totalInvested = monthly * months;
        const futureValue = monthlyRate > 0
          ? monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
          : totalInvested;

        return {
          invested: totalInvested,
          returns: Math.max(0, futureValue - totalInvested),
          total: futureValue
        };
      }}
    />
  );
}
