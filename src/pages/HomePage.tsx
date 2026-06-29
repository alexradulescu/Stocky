import { Stack, Group, Text, Title } from '../components/ui';
import { useStore } from '../store/useStore';
import { StockPriceInput } from '../components/StockPriceInput';
import { VestingTable } from '../components/VestingTable';
import { calculateVestedUnits } from '../utils/vesting';
import { formatUSD, formatUnits } from '../utils/formatting';

export function HomePage() {
  const { plans, currentStockPrice } = useStore();
  const today = new Date();
  const totalUnits = plans.reduce((sum, plan) => sum + plan.units, 0);
  const vestedUnits = plans.reduce((sum, plan) => sum + calculateVestedUnits(plan, today), 0);
  const currentValue = vestedUnits * currentStockPrice;

  return (
    <Stack gap="sm" className="animate-fade-in">
      <Group justify="space-between" align="center" className="py-1">
        <div>
          <Title order={3} style={{ fontSize: '1.125rem', marginBottom: 0, lineHeight: 1.2 }}>
            Overview
          </Title>
          <Text size="10px" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
            Stock Options Tracker
          </Text>
        </div>
      </Group>

      {plans.length > 0 && (
        <div className="flex gap-3 p-2 px-3 rounded-[10px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <div className="flex-1">
            <Text size="10px" style={{ color: 'var(--stocky-text-muted)', marginBottom: 1 }}>Total</Text>
            <Text size="xs" fw={600} className="number-display">{formatUnits(totalUnits)}</Text>
          </div>
          <div className="flex-1">
            <Text size="10px" style={{ color: 'var(--stocky-text-muted)', marginBottom: 1 }}>Vested</Text>
            <Text size="xs" fw={600} className="number-display" style={{ color: 'var(--stocky-emerald)' }}>{formatUnits(vestedUnits)}</Text>
          </div>
          <div className="flex-[1.5]">
            <Text size="10px" style={{ color: 'var(--stocky-text-muted)', marginBottom: 1 }}>Value</Text>
            <Text size="xs" fw={600} className="number-display text-gradient-gold">
              {currentStockPrice > 0 ? formatUSD(currentValue) : '—'}
            </Text>
          </div>
        </div>
      )}

      <StockPriceInput />
      {plans.length > 0 && <VestingTable plans={plans} currentStockPrice={currentStockPrice} />}
    </Stack>
  );
}
