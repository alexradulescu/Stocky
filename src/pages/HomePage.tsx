import { Title, Button, Stack, Group, Box, Text } from '@mantine/core';
import { IconPlus, IconTrendingUp } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../store/useStore';
import { StockPriceInput } from '../components/StockPriceInput';
import { VestingTable } from '../components/VestingTable';
import { PlanCard } from '../components/PlanCard';
import { calculateVestedUnits } from '../utils/vesting';
import { formatUSD, formatUnits } from '../utils/formatting';

export function HomePage() {
  const navigate = useNavigate();
  const { plans, currentStockPrice } = useStore();

  const sortedPlans = [...plans].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // Calculate portfolio summary
  const today = new Date();
  const totalUnits = plans.reduce((sum, plan) => sum + plan.units, 0);
  const vestedUnits = plans.reduce(
    (sum, plan) => sum + calculateVestedUnits(plan, today),
    0
  );
  const currentValue = vestedUnits * currentStockPrice;

  const handleAddPlan = () => {
    navigate({ to: '/plan/new' });
  };

  return (
    <Stack gap="sm" className="animate-fade-in">
      {/* iOS 26 Compact Header */}
      <Group justify="space-between" align="center" py={4}>
        <Box>
          <Title order={3} style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 0, lineHeight: 1.2 }}>
            Stocky
          </Title>
          <Text size="10px" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
            Stock Options Tracker
          </Text>
        </Box>
        <Button
          onClick={handleAddPlan}
          leftSection={<IconPlus size={14} />}
          size="xs"
          style={{
            background: 'linear-gradient(135deg, #e6c24e 0%, #f0da94 100%)',
            color: '#0f1419',
            fontWeight: 600,
            border: 'none',
            height: 28,
            paddingLeft: 10,
            paddingRight: 12,
          }}
        >
          Add
        </Button>
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

      {/* Plans List */}
      {plans.length > 0 && (
        <Box>
          <Text size="xs" fw={600} tt="uppercase" mb="xs" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.08em' }}>
            Plans ({plans.length})
          </Text>
          <Stack gap="xs">
            {sortedPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </Stack>
        </Box>
      )}

      {/* Empty State */}
      {plans.length === 0 && (
        <Box
          style={{
            padding: '24px 16px',
            textAlign: 'center',
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <IconTrendingUp
            size={24}
            style={{ color: 'var(--stocky-gold)', marginBottom: 8 }}
          />
          <Text size="sm" fw={500} mb={4} style={{ color: 'var(--stocky-text-primary)' }}>
            No plans yet
          </Text>
          <Text size="xs" mb="sm" style={{ color: 'var(--stocky-text-muted)' }}>
            Add your first stock option plan
          </Text>
          <Button
            onClick={handleAddPlan}
            leftSection={<IconPlus size={14} />}
            size="xs"
            style={{
              background: 'linear-gradient(135deg, #e6c24e 0%, #f0da94 100%)',
              color: '#0f1419',
              fontWeight: 600,
              border: 'none',
              height: 28,
            }}
          >
            Add Plan
          </Button>
        </Box>
      )}
    </Stack>
  );
}
