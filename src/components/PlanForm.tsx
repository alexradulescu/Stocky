import { useState } from 'react';
import { Button } from '@heroui/react';
import { IconArrowLeft } from '@tabler/icons-react';
import { StockPlan } from '../types/index';
import { Stack, Group, Text } from './ui';

interface PlanFormProps {
  initialData?: StockPlan;
  onSubmit: (data: Omit<StockPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function PlanForm({ initialData, onSubmit, onCancel, isEditMode = false }: PlanFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [ticker, setTicker] = useState(initialData?.ticker || 'BLSH');
  const [units, setUnits] = useState(initialData?.units?.toString() || '');
  const [strikePrice, setStrikePrice] = useState(initialData?.strikePrice?.toString() || '');
  const [startDate, setStartDate] = useState(
    initialData?.startDate ? initialData.startDate.split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Required';
    if (!ticker.trim()) newErrors.ticker = 'Required';
    const unitsNum = Number(units);
    if (!units || isNaN(unitsNum) || unitsNum <= 0) newErrors.units = 'Must be > 0';
    const strikeNum = Number(strikePrice);
    if (strikePrice === '' || isNaN(strikeNum) || strikeNum < 0) newErrors.strikePrice = 'Must be >= 0';
    if (!startDate) newErrors.startDate = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      ticker: ticker.trim().toUpperCase(),
      units: Number(units),
      strikePrice: Number(strikePrice),
      startDate: new Date(startDate).toISOString(),
    });
  }

  return (
    <Stack gap="sm" className="animate-fade-in">
      <Group gap="xs" align="center" className="py-1">
        <Button isIconOnly variant="ghost" size="sm" onPress={onCancel} className="min-w-0 text-[var(--stocky-text-muted)]">
          <IconArrowLeft size={18} />
        </Button>
        <Text size="sm" fw={600} style={{ color: 'var(--stocky-text-primary)' }}>
          {isEditMode ? 'Edit Plan' : 'New Plan'}
        </Text>
      </Group>

      <form onSubmit={handleSubmit}>
        <Stack gap="sm">
          <div>
            <label className="block text-[10px] font-medium text-[var(--stocky-text-muted)] mb-0.5 tracking-wider uppercase">Plan Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 2024 Grant"
              className="w-full h-[38px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-base px-3 text-[var(--stocky-text-primary)] focus:border-[var(--stocky-gold)] focus:outline-none placeholder:text-[var(--stocky-text-muted)]"
            />
            {errors.name && <span className="text-[10px] text-danger mt-0.5 block">{errors.name}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[var(--stocky-text-muted)] mb-0.5 tracking-wider uppercase">Ticker</label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="BLSH"
              className="w-full h-[38px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-base px-3 uppercase font-semibold tracking-wider text-[var(--stocky-text-primary)] focus:border-[var(--stocky-gold)] focus:outline-none placeholder:text-[var(--stocky-text-muted)]"
            />
            {errors.ticker && <span className="text-[10px] text-danger mt-0.5 block">{errors.ticker}</span>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-[var(--stocky-text-muted)] mb-0.5 tracking-wider uppercase">Units</label>
              <input
                type="text"
                inputMode="numeric"
                value={units}
                onChange={(e) => setUnits(e.target.value.replace(/[^0-9]/g, ''))}
                onClick={(e) => e.currentTarget.select()}
                placeholder="1000"
                className="w-full h-[38px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-base px-3 text-[var(--stocky-text-primary)] focus:border-[var(--stocky-gold)] focus:outline-none placeholder:text-[var(--stocky-text-muted)]"
              />
              {errors.units && <span className="text-[10px] text-danger mt-0.5 block">{errors.units}</span>}
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[var(--stocky-text-muted)] mb-0.5 tracking-wider uppercase">Strike Price</label>
              <input
                type="text"
                inputMode="decimal"
                value={strikePrice ? `$${strikePrice}` : ''}
                onChange={(e) => setStrikePrice(e.target.value.replace(/[^0-9.]/g, ''))}
                onClick={(e) => e.currentTarget.select()}
                placeholder="$0.00"
                className="w-full h-[38px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-base px-3 text-[var(--stocky-text-primary)] focus:border-[var(--stocky-gold)] focus:outline-none placeholder:text-[var(--stocky-text-muted)]"
              />
              {errors.strikePrice && <span className="text-[10px] text-danger mt-0.5 block">{errors.strikePrice}</span>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[var(--stocky-text-muted)] mb-0.5 tracking-wider uppercase">Vesting Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-[38px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg text-base px-3 text-[var(--stocky-text-primary)] focus:border-[var(--stocky-gold)] focus:outline-none"
            />
            {errors.startDate && <span className="text-[10px] text-danger mt-0.5 block">{errors.startDate}</span>}
          </div>

          <Group justify="end" gap="xs" className="mt-1">
            <Button variant="ghost" size="sm" onPress={onCancel} className="text-[var(--stocky-text-secondary)] h-7">
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-gradient-to-br from-gold-500 to-gold-300 text-[#0f1419] font-semibold border-none h-7"
            >
              {isEditMode ? 'Save' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
