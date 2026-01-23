import { Container, Stack, Text } from '@mantine/core';
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
      <Container size="sm" py="xl">
        <Text>Plan not found</Text>
      </Container>
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
    <Container size="sm" py="xl" pb="80px">
      <Stack gap="xl">
        <PlanForm
          initialData={plan}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditMode={true}
        />
      </Stack>
    </Container>
  );
}
