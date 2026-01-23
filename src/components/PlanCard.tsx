import { useState } from 'react';
import { Box, Text, Group, Button, Progress, Modal, Stack, ActionIcon } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { StockPlan } from '../types/index';
import { useStore } from '../store/useStore';
import {
  calculateVestedUnits,
  getYearsVested,
  calculateVestedPercentage,
} from '../utils/vesting';
import {
  formatUSD,
  formatUnits,
  formatDate,
} from '../utils/formatting';

interface PlanCardProps {
  plan: StockPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const navigate = useNavigate();
  const { deletePlan } = useStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const today = new Date();
  const vestedUnits = calculateVestedUnits(plan, today);
  const vestedPercentage = calculateVestedPercentage(plan, today);
  const yearsVested = getYearsVested(plan, today);

  const handleEdit = () => {
    navigate({ to: `/plan/${plan.id}/edit` });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deletePlan(plan.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Box
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Header Row */}
        <Group justify="space-between" align="flex-start" mb={8}>
          <Box style={{ flex: 1 }}>
            <Group gap={8} align="center">
              <Text size="sm" fw={600} style={{ color: 'var(--stocky-text-primary)' }}>
                {plan.name}
              </Text>
              <Text
                size="xs"
                fw={600}
                style={{
                  color: 'var(--stocky-gold)',
                  letterSpacing: '0.05em',
                }}
              >
                {plan.ticker}
              </Text>
            </Group>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)', marginTop: 2 }}>
              {formatDate(plan.startDate)} · {formatUSD(plan.strikePrice)} strike
            </Text>
          </Box>
          <Group gap={4}>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={handleEdit}
              style={{ color: 'var(--stocky-text-muted)' }}
            >
              <IconEdit size={14} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={handleDelete}
              style={{ color: 'var(--stocky-text-muted)' }}
            >
              <IconTrash size={14} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Stats Row */}
        <Group gap="md" mb={8}>
          <Box>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Units</Text>
            <Text size="sm" fw={600} className="number-display">{formatUnits(plan.units)}</Text>
          </Box>
          <Box>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Vested</Text>
            <Text size="sm" fw={600} className="number-display" style={{ color: 'var(--stocky-emerald)' }}>
              {formatUnits(vestedUnits)}
            </Text>
          </Box>
          <Box style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Progress</Text>
            <Text size="sm" fw={600} className="number-display" style={{ color: 'var(--stocky-gold)' }}>
              {yearsVested}/4 yrs
            </Text>
          </Box>
        </Group>

        {/* Progress Bar */}
        <Progress
          value={vestedPercentage}
          size={6}
          radius="xl"
          styles={{
            root: { backgroundColor: 'rgba(255, 255, 255, 0.06)' },
            section: { background: 'linear-gradient(90deg, #e6c24e 0%, #f0da94 100%)' },
          }}
        />
      </Box>

      {/* Delete Modal */}
      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Plan"
        centered
        size="sm"
        radius="md"
        overlayProps={{ backgroundOpacity: 0.7, blur: 4 }}
      >
        <Stack gap="md">
          <Text size="sm" style={{ color: 'var(--stocky-text-secondary)' }}>
            Delete <strong style={{ color: 'var(--stocky-text-primary)' }}>"{plan.name}"</strong>?
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              style={{ color: 'var(--stocky-text-secondary)' }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              size="sm"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
