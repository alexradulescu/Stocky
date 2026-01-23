import { useState } from 'react';
import { Box, Text, Group, Button, Progress, Modal, Stack, ActionIcon } from '@mantine/core';
import { IconEdit, IconTrash, IconCalendar, IconCoin, IconChartPie } from '@tabler/icons-react';
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

  // Generate vesting milestones
  const milestones = [1, 2, 3, 4];

  return (
    <>
      <Box
        className="glass-panel glass-panel-hover"
        style={{
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Card Header */}
        <Box
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
          }}
        >
          <Group justify="space-between" align="center">
            <Box>
              <Text
                size="lg"
                fw={600}
                style={{
                  fontFamily: '"Source Serif 4", Georgia, serif',
                  color: 'var(--stocky-text-primary)',
                }}
              >
                {plan.name}
              </Text>
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                style={{
                  letterSpacing: '0.1em',
                  color: 'var(--stocky-gold)',
                  marginTop: 2,
                }}
              >
                {plan.ticker}
              </Text>
            </Box>
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                size="lg"
                radius="md"
                onClick={handleEdit}
                style={{
                  color: 'var(--stocky-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconEdit size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="lg"
                radius="md"
                onClick={handleDelete}
                style={{
                  color: 'var(--stocky-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconTrash size={18} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Group>
        </Box>

        {/* Card Body */}
        <Box style={{ padding: '20px 24px' }}>
          {/* Stats Grid */}
          <Group grow gap="lg" mb="xl">
            <Box>
              <Group gap={8} align="center" mb={4}>
                <IconChartPie size={14} style={{ color: 'var(--stocky-text-muted)' }} />
                <Text
                  size="xs"
                  fw={500}
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                  }}
                >
                  Total Units
                </Text>
              </Group>
              <Text
                size="md"
                fw={600}
                className="number-display"
                style={{ color: 'var(--stocky-text-primary)' }}
              >
                {formatUnits(plan.units)}
              </Text>
            </Box>
            <Box>
              <Group gap={8} align="center" mb={4}>
                <IconCoin size={14} style={{ color: 'var(--stocky-text-muted)' }} />
                <Text
                  size="xs"
                  fw={500}
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                  }}
                >
                  Strike Price
                </Text>
              </Group>
              <Text
                size="md"
                fw={600}
                className="number-display"
                style={{ color: 'var(--stocky-text-primary)' }}
              >
                {formatUSD(plan.strikePrice)}
              </Text>
            </Box>
            <Box>
              <Group gap={8} align="center" mb={4}>
                <IconCalendar size={14} style={{ color: 'var(--stocky-text-muted)' }} />
                <Text
                  size="xs"
                  fw={500}
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                  }}
                >
                  Start Date
                </Text>
              </Group>
              <Text
                size="md"
                fw={600}
                style={{ color: 'var(--stocky-text-primary)' }}
              >
                {formatDate(plan.startDate)}
              </Text>
            </Box>
          </Group>

          {/* Vesting Progress Section */}
          <Box
            style={{
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
            }}
          >
            <Group justify="space-between" mb="sm">
              <Text
                size="sm"
                fw={600}
                style={{ color: 'var(--stocky-text-primary)' }}
              >
                Vesting Progress
              </Text>
              <Text
                size="sm"
                fw={600}
                style={{ color: 'var(--stocky-gold)' }}
                className="number-display"
              >
                {yearsVested} of 4 years
              </Text>
            </Group>

            {/* Progress bar with milestones */}
            <Box style={{ position: 'relative', marginBottom: 24 }}>
              <Progress
                value={vestedPercentage}
                size="lg"
                radius="xl"
                className="progress-gold"
                styles={{
                  root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  },
                  section: {
                    background: 'linear-gradient(90deg, #e6c24e 0%, #f0da94 100%)',
                    transition: 'width 0.5s ease',
                  },
                }}
              />
              {/* Milestone markers */}
              <Group
                justify="space-between"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  transform: 'translateY(-50%)',
                  padding: '0 2px',
                }}
              >
                {milestones.map((year) => (
                  <Box
                    key={year}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor:
                        yearsVested >= year
                          ? 'var(--stocky-bg-primary)'
                          : 'rgba(255, 255, 255, 0.2)',
                      border: yearsVested >= year
                        ? '1px solid var(--stocky-gold)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  />
                ))}
              </Group>
            </Box>

            {/* Vested summary */}
            <Group justify="space-between">
              <Box>
                <Text
                  size="xs"
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                    marginBottom: 2,
                  }}
                >
                  Currently Vested
                </Text>
                <Text
                  size="lg"
                  fw={700}
                  className="number-display"
                  style={{ color: 'var(--stocky-emerald)' }}
                >
                  {formatUnits(vestedUnits)} units
                </Text>
              </Box>
              <Box style={{ textAlign: 'right' }}>
                <Text
                  size="xs"
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                    marginBottom: 2,
                  }}
                >
                  Percentage
                </Text>
                <Text
                  size="lg"
                  fw={700}
                  className="number-display text-gradient-gold"
                >
                  {formatPercentage(vestedPercentage)}
                </Text>
              </Box>
            </Group>
          </Box>
        </Box>
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Plan"
        centered
        radius="lg"
        overlayProps={{
          backgroundOpacity: 0.7,
          blur: 4,
        }}
      >
        <Stack gap="lg">
          <Text size="sm" style={{ color: 'var(--stocky-text-secondary)' }}>
            Are you sure you want to delete <strong style={{ color: 'var(--stocky-text-primary)' }}>"{plan.name}"</strong>? This action cannot be undone.
          </Text>
          <Group justify="flex-end" gap="md">
            <Button
              variant="subtle"
              onClick={() => setShowDeleteModal(false)}
              style={{ color: 'var(--stocky-text-secondary)' }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={confirmDelete}
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
                border: 'none',
              }}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
