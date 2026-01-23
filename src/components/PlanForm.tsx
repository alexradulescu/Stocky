import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Title,
  Box,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
  IconFileText,
  IconTag,
  IconChartBar,
  IconCoin,
  IconCalendar,
} from '@tabler/icons-react';
import { StockPlan } from '../types/index';

interface PlanFormProps {
  initialData?: StockPlan;
  onSubmit: (data: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const inputStyles = {
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontSize: '16px',
    height: 48,
    '&:focus': {
      borderColor: 'var(--stocky-gold)',
      boxShadow: '0 0 0 3px rgba(230, 194, 78, 0.15)',
    },
    '&::placeholder': {
      color: 'var(--stocky-text-muted)',
    },
  },
  label: {
    display: 'none', // We'll use custom labels
  },
  error: {
    marginTop: 6,
  },
};

export function PlanForm({
  initialData,
  onSubmit,
  onCancel,
  isEditMode = false,
}: PlanFormProps) {
  const form = useForm({
    initialValues: {
      name: initialData?.name || '',
      ticker: initialData?.ticker || 'BLSH',
      units: initialData?.units || '',
      strikePrice: initialData?.strikePrice || '',
      startDate: initialData ? new Date(initialData.startDate) : new Date(),
    },
    validate: {
      name: (value) => (!value ? 'Plan name is required' : null),
      ticker: (value) => (!value ? 'Ticker is required' : null),
      units: (value) => {
        if (!value) return 'Number of units is required';
        if (typeof value === 'string' && isNaN(Number(value)))
          return 'Must be a valid number';
        if (Number(value) <= 0) return 'Must be greater than 0';
        return null;
      },
      strikePrice: (value) => {
        if (!value) return 'Strike price is required';
        if (typeof value === 'string' && isNaN(Number(value)))
          return 'Must be a valid number';
        if (Number(value) <= 0) return 'Must be greater than 0';
        return null;
      },
      startDate: (value) => (!value ? 'Start date is required' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const startDateISO = values.startDate.toISOString();
    onSubmit({
      name: values.name,
      ticker: values.ticker,
      units: Number(values.units),
      strikePrice: Number(values.strikePrice),
      startDate: startDateISO,
    });
  });

  return (
    <Stack gap="xl" className="animate-fade-in">
      {/* Header */}
      <Box>
        <Text
          size="xs"
          fw={600}
          tt="uppercase"
          style={{
            letterSpacing: '0.12em',
            color: 'var(--stocky-gold)',
            marginBottom: 4,
          }}
        >
          {isEditMode ? 'Modify Plan' : 'New Plan'}
        </Text>
        <Title
          order={1}
          style={{
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {isEditMode ? 'Edit Plan' : 'Add Plan'}
        </Title>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box className="glass-panel" style={{ padding: '32px' }}>
          <Stack gap="xl">
            {/* Plan Name */}
            <Box>
              <Group gap="sm" mb="xs">
                <IconFileText size={16} style={{ color: 'var(--stocky-gold)' }} />
                <Text
                  size="xs"
                  fw={600}
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                  }}
                >
                  Plan Name
                </Text>
              </Group>
              <TextInput
                placeholder="e.g., 2024 Grant"
                {...form.getInputProps('name')}
                styles={inputStyles}
              />
            </Box>

            {/* Stock Ticker */}
            <Box>
              <Group gap="sm" mb="xs">
                <IconTag size={16} style={{ color: 'var(--stocky-gold)' }} />
                <Text
                  size="xs"
                  fw={600}
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                  }}
                >
                  Stock Ticker
                </Text>
              </Group>
              <TextInput
                placeholder="e.g., BLSH"
                {...form.getInputProps('ticker')}
                styles={{
                  ...inputStyles,
                  input: {
                    ...inputStyles.input,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                  },
                }}
              />
            </Box>

            {/* Two column layout for numbers */}
            <Group grow gap="lg">
              {/* Number of Units */}
              <Box>
                <Group gap="sm" mb="xs">
                  <IconChartBar size={16} style={{ color: 'var(--stocky-gold)' }} />
                  <Text
                    size="xs"
                    fw={600}
                    tt="uppercase"
                    style={{
                      letterSpacing: '0.06em',
                      color: 'var(--stocky-text-muted)',
                    }}
                  >
                    Number of Units
                  </Text>
                </Group>
                <NumberInput
                  placeholder="1,000"
                  {...form.getInputProps('units')}
                  min={1}
                  thousandSeparator=","
                  styles={inputStyles}
                />
              </Box>

              {/* Strike Price */}
              <Box>
                <Group gap="sm" mb="xs">
                  <IconCoin size={16} style={{ color: 'var(--stocky-gold)' }} />
                  <Text
                    size="xs"
                    fw={600}
                    tt="uppercase"
                    style={{
                      letterSpacing: '0.06em',
                      color: 'var(--stocky-text-muted)',
                    }}
                  >
                    Strike Price (USD)
                  </Text>
                </Group>
                <NumberInput
                  placeholder="0.00"
                  {...form.getInputProps('strikePrice')}
                  min={0}
                  step={0.01}
                  decimalScale={2}
                  leftSection={
                    <Text size="sm" fw={600} style={{ color: 'var(--stocky-text-muted)' }}>
                      $
                    </Text>
                  }
                  styles={{
                    ...inputStyles,
                    input: {
                      ...inputStyles.input,
                      paddingLeft: 36,
                    },
                  }}
                />
              </Box>
            </Group>

            {/* Start Date */}
            <Box>
              <Group gap="sm" mb="xs">
                <IconCalendar size={16} style={{ color: 'var(--stocky-gold)' }} />
                <Text
                  size="xs"
                  fw={600}
                  tt="uppercase"
                  style={{
                    letterSpacing: '0.06em',
                    color: 'var(--stocky-text-muted)',
                  }}
                >
                  Vesting Start Date
                </Text>
              </Group>
              <DateInput
                placeholder="Select date"
                {...form.getInputProps('startDate')}
                styles={inputStyles}
              />
            </Box>

            {/* Divider */}
            <Box className="divider-subtle" style={{ margin: '8px 0' }} />

            {/* Actions */}
            <Group justify="flex-end" gap="md">
              <Button
                variant="subtle"
                onClick={onCancel}
                style={{
                  color: 'var(--stocky-text-secondary)',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #e6c24e 0%, #f0da94 100%)',
                  color: '#0f1419',
                  fontWeight: 600,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(230, 194, 78, 0.25)',
                }}
              >
                {isEditMode ? 'Save Changes' : 'Create Plan'}
              </Button>
            </Group>
          </Stack>
        </Box>
      </form>
    </Stack>
  );
}
