import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons-react';
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
    height: 44,
    '&:focus': {
      borderColor: 'var(--stocky-gold)',
    },
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--stocky-text-muted)',
    marginBottom: 4,
  },
  error: {
    marginTop: 4,
    fontSize: '12px',
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
      units: initialData?.units ?? ('' as number | ''),
      strikePrice: initialData?.strikePrice ?? ('' as number | ''),
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
    },
    validate: {
      name: (value) => (!value?.trim() ? 'Required' : null),
      ticker: (value) => (!value?.trim() ? 'Required' : null),
      units: (value) => {
        if (value === '' || value === null || value === undefined) return 'Required';
        const num = Number(value);
        if (isNaN(num) || num <= 0) return 'Must be > 0';
        return null;
      },
      strikePrice: (value) => {
        if (value === '' || value === null || value === undefined) return 'Required';
        const num = Number(value);
        if (isNaN(num) || num < 0) return 'Must be >= 0';
        return null;
      },
      startDate: (value) => (!value ? 'Required' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    // Ensure startDate is a valid Date
    let startDateISO: string;
    if (values.startDate instanceof Date) {
      startDateISO = values.startDate.toISOString();
    } else if (typeof values.startDate === 'string') {
      startDateISO = new Date(values.startDate).toISOString();
    } else {
      startDateISO = new Date().toISOString();
    }

    onSubmit({
      name: values.name.trim(),
      ticker: values.ticker.trim().toUpperCase(),
      units: Number(values.units),
      strikePrice: Number(values.strikePrice),
      startDate: startDateISO,
    });
  });

  return (
    <Stack gap="md" className="animate-fade-in">
      {/* Compact Header */}
      <Group gap="sm" align="center">
        <Button
          variant="subtle"
          size="compact-sm"
          p={0}
          onClick={onCancel}
          style={{ color: 'var(--stocky-text-muted)' }}
        >
          <IconArrowLeft size={20} />
        </Button>
        <Text size="lg" fw={600} style={{ color: 'var(--stocky-text-primary)' }}>
          {isEditMode ? 'Edit Plan' : 'New Plan'}
        </Text>
      </Group>

      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          {/* Plan Name */}
          <TextInput
            label="Plan Name"
            placeholder="e.g., 2024 Grant"
            {...form.getInputProps('name')}
            styles={inputStyles}
          />

          {/* Ticker */}
          <TextInput
            label="Ticker"
            placeholder="BLSH"
            {...form.getInputProps('ticker')}
            styles={{
              ...inputStyles,
              input: {
                ...inputStyles.input,
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em',
              },
            }}
          />

          {/* Units & Strike Price - side by side */}
          <Group grow gap="sm">
            <NumberInput
              label="Units"
              placeholder="1000"
              {...form.getInputProps('units')}
              min={1}
              thousandSeparator=","
              styles={inputStyles}
            />
            <NumberInput
              label="Strike Price"
              placeholder="0.00"
              {...form.getInputProps('strikePrice')}
              min={0}
              step={0.01}
              decimalScale={2}
              prefix="$"
              styles={inputStyles}
            />
          </Group>

          {/* Start Date */}
          <DateInput
            label="Vesting Start Date"
            placeholder="Select date"
            {...form.getInputProps('startDate')}
            styles={inputStyles}
          />

          {/* Actions */}
          <Group justify="flex-end" gap="sm" mt="sm">
            <Button
              variant="subtle"
              onClick={onCancel}
              style={{ color: 'var(--stocky-text-secondary)' }}
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
              }}
            >
              {isEditMode ? 'Save' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
