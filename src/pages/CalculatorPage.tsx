import { useState, useMemo } from 'react';
import { Stack, Title, NumberInput, Text, Box, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalculator, IconAlertCircle } from '@tabler/icons-react';
import { useStore } from '../store/useStore';
import { useCurrencyRate } from '../hooks/useCurrencyRate';
import { CalculatorResults } from '../components/CalculatorResults';
import { calculateVestedUnits } from '../utils/vesting';
import { CalculatorResults as CalculatorResultsType } from '../types/index';

export function CalculatorPage() {
  const { plans } = useStore();
  const { rate } = useCurrencyRate();

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  const [saleDate, setSaleDate] = useState<Date | null>(nextMonth);
  const [expectedPrice, setExpectedPrice] = useState<number | string>('');

  const results = useMemo<CalculatorResultsType | null>(() => {
    if (plans.length === 0 || !expectedPrice || Number(expectedPrice) <= 0 || !saleDate) {
      return null;
    }

    const expectedPriceNum = Number(expectedPrice);
    const breakdownByPlan = plans.map((plan) => {
      const vestedUnits = calculateVestedUnits(plan, saleDate as Date);
      const saleValue = vestedUnits * expectedPriceNum;
      const strikeCost = vestedUnits * plan.strikePrice;
      const profit = saleValue - strikeCost;

      return {
        planId: plan.id,
        planName: plan.name,
        vestedUnits,
        strikeCost,
        saleValue,
        profit,
      };
    });

    const totalVestedUnits = breakdownByPlan.reduce((sum, item) => sum + item.vestedUnits, 0);
    const totalSaleValue = breakdownByPlan.reduce((sum, item) => sum + item.saleValue, 0);
    const totalStrikeCost = breakdownByPlan.reduce((sum, item) => sum + item.strikeCost, 0);
    const grossProfit = totalSaleValue - totalStrikeCost;
    const tax = grossProfit > 0 ? grossProfit * 0.24 : 0;
    const netProfitUSD = grossProfit - tax;
    const netProfitSGD = rate ? netProfitUSD * rate : 0;
    const exchangeRate = rate || 0;

    return {
      totalVestedUnits,
      totalSaleValue,
      totalStrikeCost,
      grossProfit,
      tax,
      netProfitUSD,
      netProfitSGD,
      exchangeRate,
      breakdownByPlan,
    };
  }, [plans, saleDate, expectedPrice, rate]);

  // Empty state
  if (plans.length === 0) {
    return (
      <Stack gap="md" className="animate-fade-in">
        <Box>
          <Title order={2} style={{ marginBottom: 2 }}>Calculator</Title>
          <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Profit Projection</Text>
        </Box>
        <Box
          style={{
            padding: '48px 32px',
            textAlign: 'center',
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <IconCalculator size={40} style={{ color: 'var(--stocky-gold)', marginBottom: 16 }} />
          <Text size="lg" fw={500} mb="xs" style={{ color: 'var(--stocky-text-primary)' }}>No plans yet</Text>
          <Text size="sm" style={{ color: 'var(--stocky-text-muted)' }}>
            Add plans to use the calculator
          </Text>
        </Box>
      </Stack>
    );
  }

  const hasVestedUnits = results && results.totalVestedUnits > 0;
  const inputStyles = {
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '16px',
    },
    label: {
      fontSize: '12px',
      fontWeight: 500,
      color: 'var(--stocky-text-muted)',
      marginBottom: 6,
    },
  };

  return (
    <Stack gap="md" className="animate-fade-in">
      {/* Header */}
      <Box>
        <Title order={2} style={{ marginBottom: 2 }}>Calculator</Title>
        <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>Profit Projection</Text>
      </Box>

      {/* Inputs */}
      <Group grow gap="sm">
        <DateInput
          label="Sale Date"
          value={saleDate}
          onChange={(date) => {
            if (typeof date === 'string') {
              setSaleDate(new Date(date));
            } else {
              setSaleDate(date);
            }
          }}
          placeholder="Select date"
          styles={inputStyles}
        />
        <NumberInput
          label="Expected Price"
          value={expectedPrice}
          onChange={setExpectedPrice}
          placeholder="0.00"
          min={0}
          step={0.01}
          decimalScale={2}
          prefix="$"
          styles={inputStyles}
        />
      </Group>

      {/* Warning */}
      {!hasVestedUnits && expectedPrice && Number(expectedPrice) > 0 && (
        <Box
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
          }}
        >
          <Group gap="xs">
            <IconAlertCircle size={18} style={{ color: 'var(--stocky-rose)' }} />
            <Text size="sm" style={{ color: 'var(--stocky-rose)' }}>
              No units vested by this date
            </Text>
          </Group>
        </Box>
      )}

      {/* Results */}
      {hasVestedUnits && results && <CalculatorResults results={results} />}
    </Stack>
  );
}
