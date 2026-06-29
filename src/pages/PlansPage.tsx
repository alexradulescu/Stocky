import { Button } from '@heroui/react';
import { IconPlus, IconTrendingUp } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../store/useStore';
import { PlanCard } from '../components/PlanCard';
import { Stack, Group, Text, Title } from '../components/ui';

export function PlansPage() {
  const navigate = useNavigate();
  const { plans } = useStore();
  const sortedPlans = [...plans].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const handleAddPlan = () => { navigate({ to: '/plan/new' }); };

  return (
    <Stack gap="sm" className="animate-fade-in">
      <Group justify="space-between" align="center" className="py-1">
        <div>
          <Title order={3} style={{ fontSize: '1.125rem', marginBottom: 0, lineHeight: 1.2 }}>Plans</Title>
          <Text size="10px" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>Your stock option grants</Text>
        </div>
        {plans.length > 0 && (
          <Button
            size="sm"
            onPress={handleAddPlan}
            className="bg-gradient-to-br from-gold-500 to-gold-300 text-[#0f1419] font-semibold border-none h-7 px-3 min-w-0"
          >
            <IconPlus size={14} /> Add
          </Button>
        )}
      </Group>

      {plans.length > 0 && (
        <Stack gap="xs">
          {sortedPlans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}
        </Stack>
      )}

      {plans.length === 0 && (
        <div className="p-6 px-4 text-center rounded-[10px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
          <IconTrendingUp size={24} style={{ color: 'var(--stocky-gold)', marginBottom: 8 }} />
          <Text size="sm" fw={500} className="mb-1 block" style={{ color: 'var(--stocky-text-primary)' }}>No plans yet</Text>
          <Text size="xs" className="mb-3 block" style={{ color: 'var(--stocky-text-muted)' }}>Add your first stock option plan</Text>
          <Button
            size="sm"
            onPress={handleAddPlan}
            className="bg-gradient-to-br from-gold-500 to-gold-300 text-[#0f1419] font-semibold border-none h-7"
          >
            <IconPlus size={14} /> Add Plan
          </Button>
        </div>
      )}
    </Stack>
  );
}
