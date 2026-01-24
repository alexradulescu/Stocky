import { useState, useEffect } from 'react';
import { NumberInput, Box, Text, Group, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useStore } from '../store/useStore';

export function StockPriceInput() {
  const { currentStockPrice, setCurrentStockPrice, clearCurrentStockPrice } = useStore();
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

  const handleClear = () => {
    setInputValue('');
    clearCurrentStockPrice();
  };

  return (
    <Box
      style={{
        padding: '8px 12px',
        borderRadius: 8,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Group justify="space-between" align="center">
        <Box>
          <Text size="xs" fw={500} style={{ color: 'var(--stocky-text-primary)' }}>
            BLSH Price
          </Text>
          <Text size="10px" style={{ color: 'var(--stocky-text-muted)' }}>
            Current stock price
          </Text>
        </Box>
        <Group gap={4}>
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
                width: 90,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '16px',
                fontWeight: 600,
                height: 34,
                textAlign: 'right',
                color: 'var(--stocky-gold)',
                '&:focus': {
                  borderColor: 'var(--stocky-gold)',
                },
              },
            }}
          />
          {currentStockPrice > 0 && (
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              onClick={handleClear}
            >
              <IconX size={14} />
            </ActionIcon>
          )}
        </Group>
      </Group>
    </Box>
  );
}
