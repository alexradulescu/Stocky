import { useState, useMemo } from 'react';
import { Stack, Title, NumberInput, Text, Box, Group } from '@mantine/core';
import { IconReceipt2 } from '@tabler/icons-react';
import { calculateFamilyTax, PersonTaxInput, TaxCalculationResult } from '../utils/tax';
import { formatSGD, formatPercentage } from '../utils/formatting';

interface PersonInput {
  salary: number | string;
  bonus: number | string;
}

export function TaxCalculatorPage() {
  const [alex, setAlex] = useState<PersonInput>({ salary: '', bonus: '' });
  const [andreea, setAndreea] = useState<PersonInput>({ salary: '', bonus: '' });

  const results = useMemo<TaxCalculationResult | null>(() => {
    const alexSalary = Number(alex.salary) || 0;
    const alexBonus = Number(alex.bonus) || 0;
    const andreeaSalary = Number(andreea.salary) || 0;
    const andreeaBonus = Number(andreea.bonus) || 0;

    // Only calculate if at least one person has income
    if (alexSalary + alexBonus + andreeaSalary + andreeaBonus === 0) {
      return null;
    }

    const inputs: PersonTaxInput[] = [
      { name: 'Alex', annualSalary: alexSalary, annualBonus: alexBonus },
      { name: 'Andreea', annualSalary: andreeaSalary, annualBonus: andreeaBonus },
    ];

    return calculateFamilyTax(inputs);
  }, [alex, andreea]);

  const inputStyles = {
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '16px',
      height: 38,
    },
    label: {
      fontSize: '10px',
      fontWeight: 500,
      color: 'var(--stocky-text-muted)',
      marginBottom: 2,
      letterSpacing: '0.02em',
    },
  };

  const ResultsTable = ({ results }: { results: TaxCalculationResult }) => {
    const rows = [
      {
        label: 'Gross Annual Income',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.grossAnnualIncome),
        getTotal: () => formatSGD(results.totals.grossAnnualIncome),
        highlight: false,
      },
      {
        label: 'CPF (Employee 20%)',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.cpfEmployee),
        getTotal: () => formatSGD(results.totals.cpfEmployee),
        highlight: false,
        negative: true,
      },
      {
        label: 'CPF (Employer 17%)',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.cpfEmployer),
        getTotal: () => formatSGD(results.totals.cpfEmployer),
        highlight: false,
      },
      {
        label: 'Total CPF',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.totalCpf),
        getTotal: () => formatSGD(results.totals.totalCpf),
        highlight: true,
      },
      {
        label: 'Taxable Income',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.taxableIncome),
        getTotal: () => formatSGD(results.totals.taxableIncome),
        highlight: false,
      },
      {
        label: 'Tax (Annual)',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.taxPayableAnnual),
        getTotal: () => formatSGD(results.totals.taxPayableAnnual),
        highlight: false,
        negative: true,
      },
      {
        label: 'Tax (Monthly)',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.taxPayableMonthly),
        getTotal: () => formatSGD(results.totals.taxPayableMonthly),
        highlight: false,
        negative: true,
      },
      {
        label: 'Net Take-Home (Annual)',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.netTakeHomeAnnual),
        getTotal: () => formatSGD(results.totals.netTakeHomeAnnual),
        highlight: true,
        success: true,
      },
      {
        label: 'Net Take-Home (Monthly)',
        getValue: (p: typeof results.persons[0]) => formatSGD(p.netTakeHomeMonthly),
        getTotal: () => formatSGD(results.totals.netTakeHomeMonthly),
        highlight: true,
        success: true,
      },
      {
        label: 'Net % of Gross',
        getValue: (p: typeof results.persons[0]) => formatPercentage(p.netPercentage),
        getTotal: () => formatPercentage(results.totals.netPercentage),
        highlight: true,
      },
    ];

    const cellStyle = {
      padding: '8px 10px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    };

    const headerCellStyle = {
      ...cellStyle,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    };

    return (
      <Box
        style={{
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        >
          <Box style={headerCellStyle}>
            <Text size="10px" fw={600} style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
              METRIC
            </Text>
          </Box>
          {results.persons.map((p) => (
            <Box key={p.name} style={{ ...headerCellStyle, textAlign: 'right' }}>
              <Text size="10px" fw={600} style={{ color: 'var(--stocky-gold)', letterSpacing: '0.02em' }}>
                {p.name.toUpperCase()}
              </Text>
            </Box>
          ))}
          <Box style={{ ...headerCellStyle, textAlign: 'right' }}>
            <Text size="10px" fw={600} style={{ color: 'var(--stocky-text-primary)', letterSpacing: '0.02em' }}>
              TOTAL
            </Text>
          </Box>
        </Box>

        {/* Table Rows */}
        {rows.map((row, index) => (
          <Box
            key={row.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              background: row.highlight ? 'rgba(230, 194, 78, 0.04)' : 'transparent',
            }}
          >
            <Box style={{ ...cellStyle, borderBottom: index === rows.length - 1 ? 'none' : cellStyle.borderBottom }}>
              <Text
                size="11px"
                fw={row.highlight ? 600 : 500}
                style={{ color: row.highlight ? 'var(--stocky-text-primary)' : 'var(--stocky-text-secondary)' }}
              >
                {row.label}
              </Text>
            </Box>
            {results.persons.map((p) => (
              <Box
                key={`${p.name}-${row.label}`}
                style={{
                  ...cellStyle,
                  textAlign: 'right',
                  borderBottom: index === rows.length - 1 ? 'none' : cellStyle.borderBottom,
                }}
              >
                <Text
                  size="11px"
                  fw={row.highlight ? 600 : 500}
                  className="number-display"
                  style={{
                    color: row.success
                      ? 'var(--stocky-emerald)'
                      : row.negative
                      ? 'var(--stocky-rose)'
                      : row.highlight
                      ? 'var(--stocky-text-primary)'
                      : 'var(--stocky-text-secondary)',
                  }}
                >
                  {row.getValue(p)}
                </Text>
              </Box>
            ))}
            <Box
              style={{
                ...cellStyle,
                textAlign: 'right',
                borderBottom: index === rows.length - 1 ? 'none' : cellStyle.borderBottom,
              }}
            >
              <Text
                size="11px"
                fw={600}
                className="number-display"
                style={{
                  color: row.success
                    ? 'var(--stocky-emerald)'
                    : row.negative
                    ? 'var(--stocky-rose)'
                    : row.highlight
                    ? 'var(--stocky-gold)'
                    : 'var(--stocky-text-primary)',
                }}
              >
                {row.getTotal()}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Stack gap="sm" className="animate-fade-in">
      {/* iOS 26 Compact Header */}
      <Box py={4}>
        <Title order={3} style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 0, lineHeight: 1.2 }}>
          Tax Calculator
        </Title>
        <Text size="10px" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
          Singapore Income Tax & CPF
        </Text>
      </Box>

      {/* Input Sections */}
      <Stack gap="sm">
        {/* Alex */}
        <Box
          style={{
            padding: '12px',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Text
            size="11px"
            fw={600}
            mb={8}
            style={{ color: 'var(--stocky-gold)', letterSpacing: '0.02em' }}
          >
            Alex
          </Text>
          <Group grow gap="sm">
            <NumberInput
              label="Annual Salary"
              value={alex.salary}
              onChange={(val) => setAlex({ ...alex, salary: val })}
              placeholder="0"
              min={0}
              step={1000}
              thousandSeparator=","
              styles={inputStyles}
            />
            <NumberInput
              label="Annual Bonus"
              value={alex.bonus}
              onChange={(val) => setAlex({ ...alex, bonus: val })}
              placeholder="0"
              min={0}
              step={1000}
              thousandSeparator=","
              styles={inputStyles}
            />
          </Group>
        </Box>

        {/* Andreea */}
        <Box
          style={{
            padding: '12px',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Text
            size="11px"
            fw={600}
            mb={8}
            style={{ color: 'var(--stocky-gold)', letterSpacing: '0.02em' }}
          >
            Andreea
          </Text>
          <Group grow gap="sm">
            <NumberInput
              label="Annual Salary"
              value={andreea.salary}
              onChange={(val) => setAndreea({ ...andreea, salary: val })}
              placeholder="0"
              min={0}
              step={1000}
              thousandSeparator=","
              styles={inputStyles}
            />
            <NumberInput
              label="Annual Bonus"
              value={andreea.bonus}
              onChange={(val) => setAndreea({ ...andreea, bonus: val })}
              placeholder="0"
              min={0}
              step={1000}
              thousandSeparator=","
              styles={inputStyles}
            />
          </Group>
        </Box>
      </Stack>

      {/* Results */}
      {results ? (
        <ResultsTable results={results} />
      ) : (
        <Box
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <IconReceipt2 size={24} style={{ color: 'var(--stocky-gold)', marginBottom: 8 }} />
          <Text size="sm" fw={500} mb={4} style={{ color: 'var(--stocky-text-primary)' }}>
            Enter income details
          </Text>
          <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>
            Add salary and bonus to see tax calculations
          </Text>
        </Box>
      )}
    </Stack>
  );
}
