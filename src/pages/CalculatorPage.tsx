import { useState, useMemo } from 'react';
import { Stack, Title, NumberInput, Text, Box, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCalculator, IconCurrencyDollar, IconCalendar, IconAlertCircle } from '@tabler/icons-react';
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

  // Empty state for no plans
  if (plans.length === 0) {
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
            Profit Projection
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
            Calculator
          </Title>
        </Box>

        <Box
          className="glass-panel"
          style={{
            padding: '60px 32px',
            textAlign: 'center',
          }}
        >
          <Box
            style={{
              width: 72,
              height: 72,
              margin: '0 auto 24px',
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.12) 0%, rgba(230, 194, 78, 0.04) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconCalculator size={32} style={{ color: 'var(--stocky-gold)' }} />
          </Box>
          <Title order={3} mb="sm" style={{ color: 'var(--stocky-text-primary)' }}>
            No plans to calculate
          </Title>
          <Text
            size="sm"
            style={{ color: 'var(--stocky-text-secondary)', maxWidth: 280, margin: '0 auto' }}
          >
            Add some stock option plans first to use the gain calculator.
          </Text>
        </Box>
      </Stack>
    );
  }

  const hasVestedUnits = results && results.totalVestedUnits > 0;

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
          Profit Projection
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
          Calculator
        </Title>
        <Text size="sm" mt="xs" style={{ color: 'var(--stocky-text-secondary)' }}>
          Calculate your potential profit from selling vested options
        </Text>
      </Box>

      {/* Input Section */}
      <Box
        className="glass-panel animate-fade-in-up stagger-1"
        style={{ padding: '24px' }}
      >
        <Group gap="xl" grow>
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
                Sale Date
              </Text>
            </Group>
            <DateInput
              value={saleDate}
              onChange={(date) => {
                if (typeof date === 'string') {
                  setSaleDate(new Date(date));
                } else {
                  setSaleDate(date);
                }
              }}
              placeholder="Select sale date"
              size="md"
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '16px',
                  height: 48,
                  '&:focus': {
                    borderColor: 'var(--stocky-gold)',
                  },
                },
              }}
            />
          </Box>

          <Box>
            <Group gap="sm" mb="xs">
              <IconCurrencyDollar size={16} style={{ color: 'var(--stocky-gold)' }} />
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                style={{
                  letterSpacing: '0.06em',
                  color: 'var(--stocky-text-muted)',
                }}
              >
                Expected Price (USD)
              </Text>
            </Group>
            <NumberInput
              value={expectedPrice}
              onChange={setExpectedPrice}
              placeholder="0.00"
              min={0}
              step={0.01}
              decimalScale={2}
              size="md"
              autoFocus
              leftSection={
                <Text size="sm" fw={600} style={{ color: 'var(--stocky-text-muted)' }}>
                  $
                </Text>
              }
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '16px',
                  height: 48,
                  paddingLeft: 36,
                  '&:focus': {
                    borderColor: 'var(--stocky-gold)',
                  },
                },
              }}
            />
          </Box>
        </Group>
      </Box>

      {/* Warning message if no vested units */}
      {!hasVestedUnits && expectedPrice && Number(expectedPrice) > 0 && (
        <Box
          className="animate-fade-in-up stagger-2"
          style={{
            padding: '16px 20px',
            borderRadius: 12,
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
          }}
        >
          <Group gap="sm">
            <IconAlertCircle size={18} style={{ color: 'var(--stocky-rose)' }} />
            <Text size="sm" style={{ color: 'var(--stocky-rose)' }}>
              No units will be vested by this date
            </Text>
          </Group>
        </Box>
      )}

      {/* Results */}
      {hasVestedUnits && results && (
        <Box className="animate-fade-in-up stagger-2">
          <CalculatorResults results={results} />
        </Box>
      )}
    </Stack>
  );
}
