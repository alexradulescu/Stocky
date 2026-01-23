import { useState, useEffect } from 'react';
import { NumberInput, Box, Text, Group } from '@mantine/core';
import { useStore } from '../store/useStore';

export function StockPriceInput() {
  const { currentStockPrice, setCurrentStockPrice } = useStore();
  const [inputValue, setInputValue] = useState<number | string>(currentStockPrice || '');

  useEffect(() => {
    setInputValue(currentStockPrice || '');
  }, [currentStockPrice]);

  const handleChange = (value: number | string) => {
    setInputValue(value);
    // Save immediately on change for better UX
    if (typeof value === 'number' && value > 0) {
      setCurrentStockPrice(value);
    }
  };

  return (
    <Box
      style={{
        padding: '12px 16px',
        borderRadius: 10,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Group justify="space-between" align="center">
        <Box>
          <Text size="sm" fw={500} style={{ color: 'var(--stocky-text-primary)' }}>
            BLSH Price
          </Text>
          <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>
            Current stock price
          </Text>
        </Box>
        <NumberInput
          value={inputValue}
          onChange={handleChange}
          placeholder="0.00"
          min={0}
          step={0.01}
          decimalScale={2}
          prefix="$"
          hideControls
          styles={{
            input: {
              width: 100,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '16px',
              fontWeight: 600,
              height: 40,
              textAlign: 'right',
              color: 'var(--stocky-gold)',
              '&:focus': {
                borderColor: 'var(--stocky-gold)',
              },
            },
          }}
        />
      </Group>
    </Box>
  );
}
