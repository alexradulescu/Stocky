import { IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../store/useStore';
import { PlanForm } from '../components/PlanForm';
import { StockPlan } from '../types/index';
import { Stack, Text, Title } from '../components/ui';

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
        <div className="glass-panel p-8 px-5 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[rgba(244,63,94,0.1)] flex items-center justify-center">
            <IconAlertCircle size={24} style={{ color: 'var(--stocky-rose)' }} />
          </div>
          <Title order={4} className="mb-1 text-base" style={{ color: 'var(--stocky-text-primary)' }}>
            Plan not found
          </Title>
          <Text size="xs" style={{ color: 'var(--stocky-text-secondary)', maxWidth: 240, margin: '0 auto' }}>
            The plan you're looking for doesn't exist or has been deleted.
          </Text>
        </div>
      </Stack>
    );
  }

  const handleSubmit = (formData: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    updatePlan(planId, formData);
    navigate({ to: '/' });
  };
  const handleCancel = () => { navigate({ to: '/' }); };

  return <PlanForm initialData={plan} onSubmit={handleSubmit} onCancel={handleCancel} isEditMode={true} />;
}
