import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function HraCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="HRA Calculator"
      fields={[
        { key: 'basic', label: 'Monthly basic salary', min: 5000, max: 500000, step: 1000, defaultValue: 50000, prefix: '₹' },
        { key: 'hra', label: 'Monthly HRA received', min: 1000, max: 300000, step: 1000, defaultValue: 20000, prefix: '₹' },
        { key: 'rent', label: 'Monthly rent paid', min: 1000, max: 300000, step: 1000, defaultValue: 25000, prefix: '₹' }
      ]}
      summaryLabels={{ invested: 'HRA exempt', returns: 'Taxable HRA', total: 'Total HRA received' }}
      calculate={(values) => {
        const annualBasic = values.basic * 12;
        const annualHra = values.hra * 12;
        const annualRent = values.rent * 12;

        const exemption = Math.max(
          0,
          Math.min(
            annualHra,
            annualRent - 0.1 * annualBasic,
            0.5 * annualBasic
          )
        );

        return {
          invested: exemption,
          returns: Math.max(0, annualHra - exemption),
          total: annualHra
        };
      }}
    />
  );
}
