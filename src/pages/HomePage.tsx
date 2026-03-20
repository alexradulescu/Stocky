import { Title, Stack, Group, Box, Text } from '@mantine/core';
import { useStore } from '../store/useStore';
import { StockPriceInput } from '../components/StockPriceInput';
import { VestingTable } from '../components/VestingTable';
import { calculateVestedUnits } from '../utils/vesting';
import { formatUSD, formatUnits } from '../utils/formatting';

export function HomePage() {
  const { plans, currentStockPrice } = useStore();

  // Calculate portfolio summary
  const today = new Date();
  const totalUnits = plans.reduce((sum, plan) => sum + plan.units, 0);
  const vestedUnits = plans.reduce(
    (sum, plan) => sum + calculateVestedUnits(plan, today),
    0
  );
  const currentValue = vestedUnits * currentStockPrice;

  return (
    <Stack gap="sm" className="animate-fade-in">
      {/* iOS 26 Compact Header */}
      <Group justify="space-between" align="center" py={4}>
        <Box>
          <Title order={3} style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 0, lineHeight: 1.2 }}>
            Overview
          </Title>
          <Text size="10px" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
            Stock Options Tracker
          </Text>
        </Box>
      </Group>

      {/* Quick Stats Bar - Only show when there are plans */}
      {plans.length > 0 && (
        <Box
          style={{
            display: 'flex',
            gap: 12,
            padding: '8px 12px',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Box style={{ flex: 1 }}>
            <Text size="10px" style={{ color: 'var(--stocky-text-muted)', marginBottom: 1 }}>
              Total
            </Text>
            <Text size="xs" fw={600} className="number-display">
              {formatUnits(totalUnits)}
            </Text>
          </Box>
          <Box style={{ flex: 1 }}>
            <Text size="10px" style={{ color: 'var(--stocky-text-muted)', marginBottom: 1 }}>
              Vested
            </Text>
            <Text size="xs" fw={600} className="number-display" style={{ color: 'var(--stocky-emerald)' }}>
              {formatUnits(vestedUnits)}
            </Text>
          </Box>
          <Box style={{ flex: 1.5 }}>
            <Text size="10px" style={{ color: 'var(--stocky-text-muted)', marginBottom: 1 }}>
              Value
            </Text>
            <Text size="xs" fw={600} className="number-display text-gradient-gold">
              {currentStockPrice > 0 ? formatUSD(currentValue) : '—'}
            </Text>
          </Box>
        </Box>
      )}

      {/* Stock Price Input */}
      <StockPriceInput />

      {/* Vesting Table */}
      {plans.length > 0 && (
        <VestingTable plans={plans} currentStockPrice={currentStockPrice} />
      )}

    </Stack>
  );
}
