import { Title, Button, Stack, Group, SimpleGrid } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../store/useStore';
import { StockPriceInput } from '../components/StockPriceInput';
import { VestingTable } from '../components/VestingTable';
import { PlanCard } from '../components/PlanCard';

export function HomePage() {
  const navigate = useNavigate();
  const { plans, currentStockPrice } = useStore();

  const sortedPlans = [...plans].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const handleAddPlan = () => {
    navigate({ to: '/plan/new' });
  };

  return (
    <Stack gap="xl" pb="80px">
      {/* Header Section */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={1}>Stocky</Title>
        </div>
        <Button onClick={handleAddPlan}>Add Plan</Button>
      </Group>

      <StockPriceInput />

      {/* Vesting Table */}
      {plans.length > 0 && (
        <>
          <VestingTable plans={plans} currentStockPrice={currentStockPrice} />
        </>
      )}

      {/* Plans Cards Section */}
      {plans.length > 0 && (
        <>
          <Title order={2}>Your Plans</Title>
          <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="lg">
            {sortedPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </SimpleGrid>
        </>
      )}

      {plans.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Title order={3} mb="md">
            No plans yet
          </Title>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Add your first stock option plan to get started.
          </p>
          <Button onClick={handleAddPlan} size="lg">
            Add Plan
          </Button>
        </div>
      )}
    </Stack>
  );
}
