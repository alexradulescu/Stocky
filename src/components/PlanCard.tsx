import { useState } from 'react';
import { Card, Text, Group, Button, Progress, Modal } from '@mantine/core';
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
  formatPercentage,
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
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Card.Section withBorder inheritPadding py="md">
          <Group justify="space-between" align="center">
            <Text fw={600} size="lg">
              {plan.name}
            </Text>
            <Group gap="xs">
              <Button
                variant="light"
                size="sm"
                leftSection={<IconEdit size={16} />}
                onClick={handleEdit}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="red"
                size="sm"
                leftSection={<IconTrash size={16} />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Group>
          </Group>
        </Card.Section>

        <div style={{ paddingTop: '12px' }}>
          <Group justify="space-between" mb="sm">
            <Text size="sm" c="dimmed">
              Ticker
            </Text>
            <Text size="sm" fw={500}>
              {plan.ticker}
            </Text>
          </Group>

          <Group justify="space-between" mb="sm">
            <Text size="sm" c="dimmed">
              Total Units
            </Text>
            <Text size="sm" fw={500}>
              {formatUnits(plan.units)}
            </Text>
          </Group>

          <Group justify="space-between" mb="sm">
            <Text size="sm" c="dimmed">
              Strike Price
            </Text>
            <Text size="sm" fw={500}>
              {formatUSD(plan.strikePrice)}
            </Text>
          </Group>

          <Group justify="space-between" mb="md">
            <Text size="sm" c="dimmed">
              Start Date
            </Text>
            <Text size="sm" fw={500}>
              {formatDate(plan.startDate)}
            </Text>
          </Group>

          <div style={{ marginBottom: '16px' }}>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Vesting Progress
              </Text>
              <Text size="sm" fw={500}>
                {yearsVested} of 4 years vested
              </Text>
            </Group>
            <Progress value={vestedPercentage} color="blue" radius="md" />
          </div>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Currently Vested
            </Text>
            <Text size="sm" fw={500}>
              {formatUnits(vestedUnits)} ({formatPercentage(vestedPercentage)})
            </Text>
          </Group>
        </div>
      </Card>

      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Plan"
        centered
      >
        <Text mb="xl" size="sm">
          Are you sure you want to delete "{plan.name}"? This action cannot be undone.
        </Text>
        <Group justify="flex-end" gap="md">
          <Button
            variant="default"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
}
