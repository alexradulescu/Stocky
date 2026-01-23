import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Stack,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { StockPlan } from '../types/index';

interface PlanFormProps {
  initialData?: StockPlan;
  onSubmit: (data: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

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
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Title order={2}>{isEditMode ? 'Edit Plan' : 'Add Plan'}</Title>

        <TextInput
          label="Plan Name"
          placeholder="e.g., 2024 Grant"
          {...form.getInputProps('name')}
          required
        />

        <TextInput
          label="Stock Ticker"
          placeholder="e.g., BLSH"
          {...form.getInputProps('ticker')}
          required
        />

        <NumberInput
          label="Number of Units"
          placeholder="e.g., 1000"
          {...form.getInputProps('units')}
          required
          min={1}
        />

        <NumberInput
          label="Strike Price (USD)"
          placeholder="e.g., 36.50"
          {...form.getInputProps('strikePrice')}
          required
          min={0}
          step={0.01}
          decimalScale={2}
        />

        <DateInput
          label="Start Date"
          {...form.getInputProps('startDate')}
          required
        />

        <Group justify="flex-end" gap="md">
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </Group>
      </Stack>
    </form>
  );
}
