import { Title, Button, Stack, Group, Box, Text, SimpleGrid } from '@mantine/core';
import { IconPlus, IconChartLine, IconTrendingUp } from '@tabler/icons-react';
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
    <Stack gap="xl" className="animate-fade-in">
      {/* Hero Header Section */}
      <Box
        style={{
          position: 'relative',
          paddingTop: 8,
          paddingBottom: 16,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text
              size="xs"
              fw={600}
              tt="uppercase"
              style={{
                letterSpacing: '0.12em',
                color: 'var(--stocky-gold)',
                marginBottom: 4,
              }}
            >
              Stock Options Tracker
            </Text>
            <Title
              order={1}
              style={{
                fontSize: 'clamp(2rem, 5vw, 2.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Stocky
            </Title>
          </Box>
          <Button
            onClick={handleAddPlan}
            leftSection={<IconPlus size={18} stroke={2} />}
            variant="filled"
            size="md"
            style={{
              background: 'linear-gradient(135deg, #e6c24e 0%, #f0da94 100%)',
              color: '#0f1419',
              fontWeight: 600,
              border: 'none',
              boxShadow: '0 4px 12px rgba(230, 194, 78, 0.25)',
            }}
          >
            Add Plan
          </Button>
        </Group>
      </Box>

      {/* Portfolio Summary Cards - Only show when there are plans */}
      {plans.length > 0 && (
        <Box className="animate-fade-in-up stagger-1">
          <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="md">
            {/* Total Units Card */}
            <Box
              className="glass-panel"
              style={{ padding: '20px 24px' }}
            >
              <Group gap="sm" align="flex-start">
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(230, 194, 78, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconChartLine size={20} style={{ color: 'var(--stocky-gold)' }} />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text
                    size="xs"
                    fw={500}
                    tt="uppercase"
                    style={{
                      letterSpacing: '0.08em',
                      color: 'var(--stocky-text-muted)',
                    }}
                  >
                    Total Units
                  </Text>
                  <Text
                    size="xl"
                    fw={700}
                    className="number-display"
                    style={{ color: 'var(--stocky-text-primary)', marginTop: 2 }}
                  >
                    {formatUnits(totalUnits)}
                  </Text>
                </Box>
              </Group>
            </Box>

            {/* Vested Units Card */}
            <Box
              className="glass-panel"
              style={{ padding: '20px 24px' }}
            >
              <Group gap="sm" align="flex-start">
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'rgba(34, 197, 94, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconTrendingUp size={20} style={{ color: 'var(--stocky-emerald)' }} />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text
                    size="xs"
                    fw={500}
                    tt="uppercase"
                    style={{
                      letterSpacing: '0.08em',
                      color: 'var(--stocky-text-muted)',
                    }}
                  >
                    Vested
                  </Text>
                  <Text
                    size="xl"
                    fw={700}
                    className="number-display"
                    style={{ color: 'var(--stocky-emerald)', marginTop: 2 }}
                  >
                    {formatUnits(vestedUnits)}
                  </Text>
                </Box>
              </Group>
            </Box>

            {/* Current Value Card */}
            <Box
              className="glass-panel"
              style={{ padding: '20px 24px' }}
            >
              <Group gap="sm" align="flex-start">
                <Box
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.15) 0%, rgba(230, 194, 78, 0.05) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text fw={700} style={{ color: 'var(--stocky-gold)', fontSize: 14 }}>$</Text>
                </Box>
                <Box style={{ flex: 1 }}>
                  <Text
                    size="xs"
                    fw={500}
                    tt="uppercase"
                    style={{
                      letterSpacing: '0.08em',
                      color: 'var(--stocky-text-muted)',
                    }}
                  >
                    Vested Value
                  </Text>
                  <Text
                    size="xl"
                    fw={700}
                    className="number-display text-gradient-gold"
                    style={{ marginTop: 2 }}
                  >
                    {currentStockPrice > 0 ? formatUSD(currentValue) : '—'}
                  </Text>
                </Box>
              </Group>
            </Box>
          </SimpleGrid>
        </Box>
      )}

      {/* Stock Price Input */}
      <Box className="animate-fade-in-up stagger-2">
        <StockPriceInput />
      </Box>

      {/* Vesting Table */}
      {plans.length > 0 && (
        <Box className="animate-fade-in-up stagger-3">
          <VestingTable plans={plans} currentStockPrice={currentStockPrice} />
        </Box>
      )}

      {/* Plans Cards Section */}
      {plans.length > 0 && (
        <Box className="animate-fade-in-up stagger-4">
          <Group justify="space-between" align="center" mb="lg">
            <Title order={2} style={{ fontSize: '1.25rem' }}>
              Your Plans
            </Title>
            <Text size="sm" c="dimmed">
              {plans.length} {plans.length === 1 ? 'plan' : 'plans'}
            </Text>
          </Group>
          <Stack gap="md">
            {sortedPlans.map((plan, index) => (
              <Box
                key={plan.id}
                className={`animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
                style={{ opacity: 0 }}
              >
                <PlanCard plan={plan} />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Empty State */}
      {plans.length === 0 && (
        <Box
          className="glass-panel animate-fade-in-scale"
          style={{
            padding: '60px 32px',
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          <Box
            style={{
              width: 72,
              height: 72,
              margin: '0 auto 24px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.12) 0%, rgba(230, 194, 78, 0.04) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconChartLine size={32} style={{ color: 'var(--stocky-gold)' }} />
          </Box>
          <Title order={3} mb="sm" style={{ color: 'var(--stocky-text-primary)' }}>
            No plans yet
          </Title>
          <Text
            size="sm"
            mb="xl"
            style={{ color: 'var(--stocky-text-secondary)', maxWidth: 280, margin: '0 auto 28px' }}
          >
            Start tracking your stock options by adding your first vesting plan.
          </Text>
          <Button
            onClick={handleAddPlan}
            leftSection={<IconPlus size={18} stroke={2} />}
            size="lg"
            style={{
              background: 'linear-gradient(135deg, #e6c24e 0%, #f0da94 100%)',
              color: '#0f1419',
              fontWeight: 600,
              border: 'none',
              boxShadow: '0 4px 12px rgba(230, 194, 78, 0.25)',
            }}
          >
            Add Your First Plan
          </Button>
        </Box>
      )}
    </Stack>
  );
}
