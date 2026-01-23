import { Box, Title, Text, Stack } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../store/useStore';
import { PlanForm } from '../components/PlanForm';
import { StockPlan } from '../types/index';

interface EditPlanPageProps {
  planId: string;
}

export function EditPlanPage({ planId }: EditPlanPageProps) {
  const navigate = useNavigate();
  const { plans, updatePlan } = useStore();

  const plan = plans.find((p) => p.id === planId);

  if (!plan) {
    return (
      <Stack gap="sm" className="animate-fade-in">
        <Box
          className="glass-panel"
          style={{
            padding: '32px 20px',
            textAlign: 'center',
          }}
        >
          <Box
            style={{
              width: 48,
              height: 48,
              margin: '0 auto 12px',
              borderRadius: 12,
              background: 'rgba(244, 63, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconAlertCircle size={24} style={{ color: 'var(--stocky-rose)' }} />
          </Box>
          <Title order={4} mb="xs" style={{ color: 'var(--stocky-text-primary)', fontSize: '1rem' }}>
            Plan not found
          </Title>
          <Text
            size="xs"
            style={{ color: 'var(--stocky-text-secondary)', maxWidth: 240, margin: '0 auto' }}
          >
            The plan you're looking for doesn't exist or has been deleted.
          </Text>
        </Box>
      </Stack>
    );
  }

  const handleSubmit = (formData: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    updatePlan(planId, formData);
    navigate({ to: '/' });
  };

  const handleCancel = () => {
    navigate({ to: '/' });
  };

  return (
    <PlanForm
      initialData={plan}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isEditMode={true}
    />
  );
}
