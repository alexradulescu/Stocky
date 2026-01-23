import { useNavigate } from '@tanstack/react-router';
import { useStore } from '../store/useStore';
import { PlanForm } from '../components/PlanForm';
import { StockPlan } from '../types/index';

export function AddPlanPage() {
  const navigate = useNavigate();
  const { addPlan } = useStore();

  const handleSubmit = (formData: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    addPlan(formData);
    navigate({ to: '/' });
  };

  const handleCancel = () => {
    navigate({ to: '/' });
  };

  return (
    <PlanForm onSubmit={handleSubmit} onCancel={handleCancel} />
  );
}
