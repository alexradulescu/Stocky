import { useState, useMemo } from 'react';
import { Container, Stack, Title, NumberInput, Text, Box } from '@mantine/core';
import { DateInput } from '@mantine/dates';
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
    const tax = grossProfit * 0.24;
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

  if (plans.length === 0) {
    return (
      <Container size="sm" py="xl" pb="80px">
        <Stack gap="lg">
          <Title order={1}>Gain Calculator</Title>
          <Text c="dimmed">
            Add some stock option plans first to use the calculator.
          </Text>
        </Stack>
      </Container>
    );
  }

  const hasVestedUnits = results && results.totalVestedUnits > 0;

  return (
    <Container size="sm" py="xl" pb="80px">
      <Stack gap="xl">
        <div>
          <Title order={1}>Gain Calculator</Title>
          <Text c="dimmed">
            Calculate your potential profit from selling vested options
          </Text>
        </div>

        <Box>
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
            placeholder="Select sale date"
          />
        </Box>

        <Box>
          <NumberInput
            label="Expected Stock Price (USD)"
            value={expectedPrice}
            onChange={setExpectedPrice}
            placeholder="Enter expected price"
            min={0}
            step={0.01}
            decimalScale={2}
            autoFocus
          />
        </Box>

        {!hasVestedUnits && (
          <Text c="red" size="sm">
            {plans.length === 0
              ? 'Add some stock option plans first'
              : Number(expectedPrice) <= 0
              ? 'Please enter a valid expected price'
              : 'No units will be vested by this date'}
          </Text>
        )}

        {hasVestedUnits && results && (
          <CalculatorResults results={results} />
        )}
      </Stack>
    </Container>
  );
}
