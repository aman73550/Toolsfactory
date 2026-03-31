import React from 'react';
import FinanceCalculatorTemplate from '../components/FinanceCalculatorTemplate';

export default function CarLoanEmiCalculator() {
  return (
    <FinanceCalculatorTemplate
      title="Car Loan EMI Calculator"
      fields={[
        { key: 'loan', label: 'Loan amount', min: 50000, max: 5000000, step: 10000, defaultValue: 800000, prefix: '₹' },
        { key: 'rate', label: 'Interest rate (p.a)', min: 5, max: 20, step: 0.1, defaultValue: 9.2, suffix: '%' },
        { key: 'years', label: 'Loan tenure', min: 1, max: 10, step: 1, defaultValue: 5, suffix: 'Yr' }
      ]}
      summaryLabels={{ invested: 'Principal amount', returns: 'Interest payable', total: 'Total repayment' }}
      ctaLabel="CHECK ELIGIBILITY"
      calculate={(values) => {
        const monthlyRate = values.rate / 1200;
        const months = values.years * 12;
        const emi = monthlyRate > 0
          ? (values.loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
          : values.loan / months;
        const total = emi * months;
        return {
          invested: values.loan,
          returns: Math.max(0, total - values.loan),
          total
        };
      }}
    />
  );
}
