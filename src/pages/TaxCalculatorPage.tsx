import { useMemo } from 'react';
import { Button } from '@heroui/react';
import { IconReceipt2, IconX } from '@tabler/icons-react';
import { calculateFamilyTax, PersonTaxInput, TaxCalculationResult } from '../utils/tax';
import { formatSGD, formatPercentage } from '../utils/formatting';
import { useStore } from '../store/useStore';
import { Stack, Group, Text, Title } from '../components/ui';

export function TaxCalculatorPage() {
  const { taxInputs, setTaxInputs } = useStore();

  const results = useMemo<TaxCalculationResult | null>(() => {
    const alexSalary = Number(taxInputs.alexSalary) || 0;
    const alexBonus = Number(taxInputs.alexBonus) || 0;
    const andreeaSalary = Number(taxInputs.andreeaSalary) || 0;
    const andreeaBonus = Number(taxInputs.andreeaBonus) || 0;

    if (alexSalary + alexBonus + andreeaSalary + andreeaBonus === 0) {
      return null;
    }

    const inputs: PersonTaxInput[] = [
      { name: 'Alex', annualSalary: alexSalary, annualBonus: alexBonus },
      { name: 'Andreea', annualSalary: andreeaSalary, annualBonus: andreeaBonus },
    ];

    return calculateFamilyTax(inputs);
  }, [taxInputs]);

  const ResultsTable = ({ results }: { results: TaxCalculationResult }) => {
    const rows = [
      { label: 'Gross Annual Income', getValue: (p: typeof results.persons[0]) => formatSGD(p.grossAnnualIncome), getTotal: () => formatSGD(results.totals.grossAnnualIncome), highlight: false },
      { label: 'CPF (Employee 20%)', getValue: (p: typeof results.persons[0]) => formatSGD(p.cpfEmployee), getTotal: () => formatSGD(results.totals.cpfEmployee), highlight: false, negative: true },
      { label: 'CPF (Employer 17%)', getValue: (p: typeof results.persons[0]) => formatSGD(p.cpfEmployer), getTotal: () => formatSGD(results.totals.cpfEmployer), highlight: false },
      { label: 'Total CPF', getValue: (p: typeof results.persons[0]) => formatSGD(p.totalCpf), getTotal: () => formatSGD(results.totals.totalCpf), highlight: true },
      { label: 'Taxable Income', getValue: (p: typeof results.persons[0]) => formatSGD(p.taxableIncome), getTotal: () => formatSGD(results.totals.taxableIncome), highlight: false },
      { label: 'Tax (Annual)', getValue: (p: typeof results.persons[0]) => formatSGD(p.taxPayableAnnual), getTotal: () => formatSGD(results.totals.taxPayableAnnual), highlight: false, negative: true },
      { label: 'Tax (Monthly)', getValue: (p: typeof results.persons[0]) => formatSGD(p.taxPayableMonthly), getTotal: () => formatSGD(results.totals.taxPayableMonthly), highlight: false, negative: true },
      { label: 'Net Take-Home (Annual)', getValue: (p: typeof results.persons[0]) => formatSGD(p.netTakeHomeAnnual), getTotal: () => formatSGD(results.totals.netTakeHomeAnnual), highlight: true, success: true },
      { label: 'Net Take-Home (Monthly)', getValue: (p: typeof results.persons[0]) => formatSGD(p.netTakeHomeMonthly), getTotal: () => formatSGD(results.totals.netTakeHomeMonthly), highlight: true, success: true },
      { label: 'Net % of Gross', getValue: (p: typeof results.persons[0]) => formatPercentage(p.netPercentage), getTotal: () => formatPercentage(results.totals.netPercentage), highlight: true },
    ];

    const cellStyle = { padding: '8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' };
    const headerCellStyle = { ...cellStyle, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' };

    return (
      <div className="rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="grid gap-0 bg-[rgba(255,255,255,0.03)]" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
          <div style={headerCellStyle}>
            <Text size="10px" fw={600} style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>METRIC</Text>
          </div>
          {results.persons.map((p) => (
            <div key={p.name} style={{ ...headerCellStyle, textAlign: 'right' }}>
              <Text size="10px" fw={600} style={{ color: 'var(--stocky-gold)', letterSpacing: '0.02em' }}>{p.name.toUpperCase()}</Text>
            </div>
          ))}
          <div style={{ ...headerCellStyle, textAlign: 'right' }}>
            <Text size="10px" fw={600} style={{ color: 'var(--stocky-text-primary)', letterSpacing: '0.02em' }}>TOTAL</Text>
          </div>
        </div>

        {rows.map((row, index) => (
          <div key={row.label} className="grid gap-0" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', background: row.highlight ? 'rgba(230, 194, 78, 0.04)' : 'transparent' }}>
            <div style={{ ...cellStyle, borderBottom: index === rows.length - 1 ? 'none' : cellStyle.borderBottom }}>
              <Text size="11px" fw={row.highlight ? 600 : 500} style={{ color: row.highlight ? 'var(--stocky-text-primary)' : 'var(--stocky-text-secondary)' }}>
                {row.label}
              </Text>
            </div>
            {results.persons.map((p) => (
              <div key={`${p.name}-${row.label}`} style={{ ...cellStyle, textAlign: 'right', borderBottom: index === rows.length - 1 ? 'none' : cellStyle.borderBottom }}>
                <Text size="11px" fw={row.highlight ? 600 : 500} className="number-display" style={{
                  color: row.success ? 'var(--stocky-emerald)' : row.negative ? 'var(--stocky-rose)' : row.highlight ? 'var(--stocky-text-primary)' : 'var(--stocky-text-secondary)',
                }}>
                  {row.getValue(p)}
                </Text>
              </div>
            ))}
            <div style={{ ...cellStyle, textAlign: 'right', borderBottom: index === rows.length - 1 ? 'none' : cellStyle.borderBottom }}>
              <Text size="11px" fw={600} className="number-display" style={{
                color: row.success ? 'var(--stocky-emerald)' : row.negative ? 'var(--stocky-rose)' : row.highlight ? 'var(--stocky-gold)' : 'var(--stocky-text-primary)',
              }}>
                {row.getTotal()}
              </Text>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const NumberInputField = ({ label, value, onChange, id }: { label: string; value: string | number; onChange: (val: string | number) => void; id: string }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      onChange(raw);
    };

    const handleClear = () => onChange('');

    return (
      <div>
        <label className="block text-[10px] font-medium text-[var(--stocky-text-muted)] mb-0.5 tracking-wider uppercase">{label}</label>
        <div className="relative">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            onChange={handleChange}
            placeholder="0"
            className="w-full h-[38px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-base px-3 text-[var(--stocky-text-primary)] focus:border-[var(--stocky-gold)] focus:outline-none placeholder:text-[var(--stocky-text-muted)]"
          />
          {value !== '' && (
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={handleClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-w-0 w-6 h-6"
            >
              <IconX size={14} />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <Stack gap="sm" className="animate-fade-in">
      <div className="py-1">
        <Title order={3} style={{ fontSize: '1.125rem', marginBottom: 0, lineHeight: 1.2 }}>
          Tax Calculator
        </Title>
        <Text size="10px" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
          Singapore Income Tax & CPF
        </Text>
      </div>

      <Stack gap="sm">
        <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <Text size="11px" fw={600} className="mb-2 block" style={{ color: 'var(--stocky-gold)', letterSpacing: '0.02em' }}>
            Alex
          </Text>
          <Group grow gap="sm">
            <NumberInputField label="Annual Salary" value={taxInputs.alexSalary} onChange={(val) => setTaxInputs({ alexSalary: val })} id="alex-salary" />
            <NumberInputField label="Annual Bonus" value={taxInputs.alexBonus} onChange={(val) => setTaxInputs({ alexBonus: val })} id="alex-bonus" />
          </Group>
        </div>

        <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <Text size="11px" fw={600} className="mb-2 block" style={{ color: 'var(--stocky-gold)', letterSpacing: '0.02em' }}>
            Andreea
          </Text>
          <Group grow gap="sm">
            <NumberInputField label="Annual Salary" value={taxInputs.andreeaSalary} onChange={(val) => setTaxInputs({ andreeaSalary: val })} id="andreea-salary" />
            <NumberInputField label="Annual Bonus" value={taxInputs.andreeaBonus} onChange={(val) => setTaxInputs({ andreeaBonus: val })} id="andreea-bonus" />
          </Group>
        </div>
      </Stack>

      {results ? (
        <ResultsTable results={results} />
      ) : (
        <div className="p-6 px-4 text-center rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <IconReceipt2 size={24} style={{ color: 'var(--stocky-gold)', marginBottom: 8 }} />
          <Text size="sm" fw={500} className="mb-1 block" style={{ color: 'var(--stocky-text-primary)' }}>
            Enter income details
          </Text>
          <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>
            Add salary and bonus to see tax calculations
          </Text>
        </div>
      )}
    </Stack>
  );
}
