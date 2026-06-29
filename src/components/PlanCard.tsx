import { Button, Modal, useOverlayState } from '@heroui/react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { StockPlan } from '../types/index';
import { useStore } from '../store/useStore';
import { calculateVestedUnits, getYearsVested, calculateVestedPercentage } from '../utils/vesting';
import { formatUSD, formatUnits, formatDate } from '../utils/formatting';
import { Group, Text } from './ui';

interface PlanCardProps {
  plan: StockPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const navigate = useNavigate();
  const { deletePlan } = useStore();
  const deleteModalState = useOverlayState();

  const today = new Date();
  const vestedUnits = calculateVestedUnits(plan, today);
  const vestedPercentage = calculateVestedPercentage(plan, today);
  const yearsVested = getYearsVested(plan, today);

  const handleEdit = () => { navigate({ to: `/plan/${plan.id}/edit` }); };
  const confirmDelete = () => { deletePlan(plan.id); deleteModalState.close(); };

  return (
    <>
      <div className="p-3 px-4 rounded-[10px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
        <Group justify="space-between" align="start" className="mb-2">
          <div className="flex-1">
            <Group gap="xs" align="center">
              <Text size="sm" fw={600} style={{ color: 'var(--stocky-text-primary)' }}>{plan.name}</Text>
              <Text size="xs" fw={600} style={{ color: 'var(--stocky-gold)', letterSpacing: '0.05em' }}>{plan.ticker}</Text>
            </Group>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)', marginTop: 2 }}>
              {formatDate(plan.startDate)} · {formatUSD(plan.strikePrice)} strike
            </Text>
          </div>
          <Group gap="xs">
            <Button isIconOnly variant="ghost" size="sm" onPress={handleEdit} className="min-w-0 w-7 h-7 text-[var(--stocky-text-muted)]">
              <IconEdit size={14} />
            </Button>
            <Button isIconOnly variant="ghost" size="sm" onPress={deleteModalState.open} className="min-w-0 w-7 h-7 text-[var(--stocky-text-muted)]">
              <IconTrash size={14} />
            </Button>
          </Group>
        </Group>

        <Group gap="md" className="mb-2">
          <div>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Units</Text>
            <Text size="sm" fw={600} className="number-display">{formatUnits(plan.units)}</Text>
          </div>
          <div>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Vested</Text>
            <Text size="sm" fw={600} className="number-display" style={{ color: 'var(--stocky-emerald)' }}>{formatUnits(vestedUnits)}</Text>
          </div>
          <div className="ml-auto text-right">
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Progress</Text>
            <Text size="sm" fw={600} className="number-display" style={{ color: 'var(--stocky-gold)' }}>{yearsVested}/4 yrs</Text>
          </div>
        </Group>

        <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full"
            style={{ width: `${vestedPercentage}%` }}
          />
        </div>
      </div>

      <Modal state={deleteModalState}>
        <Modal.Backdrop isDismissable />
        <Modal.Container size="sm" placement="center">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Delete Plan</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <Text size="sm" style={{ color: 'var(--stocky-text-secondary)' }}>
                Delete <strong style={{ color: 'var(--stocky-text-primary)' }}>"{plan.name}"</strong>?
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={deleteModalState.close}>
                Cancel
              </Button>
              <Button variant="danger" onPress={confirmDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </>
  );
}
