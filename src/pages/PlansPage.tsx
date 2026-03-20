import { Title, Button, Stack, Group, Box, Text } from '@mantine/core';
import { IconPlus, IconTrendingUp } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../store/useStore';
import { PlanCard } from '../components/PlanCard';

export function PlansPage() {
  const navigate = useNavigate();
  const { plans } = useStore();

  const sortedPlans = [...plans].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const handleAddPlan = () => {
    navigate({ to: '/plan/new' });
  };

  return (
    <Stack gap="sm" className="animate-fade-in">
      {/* Header */}
      <Group justify="space-between" align="center" py={4}>
        <Box>
          <Title order={3} style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 0, lineHeight: 1.2 }}>
            Plans
          </Title>
          <Text size="10px" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
            Your stock option grants
          </Text>
        </Box>
        {plans.length > 0 && (
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
        )}
      </Group>

      {/* Plans List */}
      {plans.length > 0 && (
        <Stack gap="xs">
          {sortedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Stack>
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
