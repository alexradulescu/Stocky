import { useState, useEffect } from 'react';
import { NumberInput, Box, Text, Group } from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';
import { useStore } from '../store/useStore';

export function StockPriceInput() {
  const { currentStockPrice, setCurrentStockPrice } = useStore();
  const [inputValue, setInputValue] = useState<number | string>(currentStockPrice || '');

  useEffect(() => {
    setInputValue(currentStockPrice || '');
  }, [currentStockPrice]);

  const handleChange = (value: number | string) => {
    setInputValue(value);
  };

  const handleBlur = () => {
    if (typeof inputValue === 'number' && inputValue > 0) {
      setCurrentStockPrice(inputValue);
    }
  };

  return (
    <Box
      className="glass-panel"
      style={{ padding: '20px 24px' }}
    >
      <Group gap="md" align="center">
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.15) 0%, rgba(230, 194, 78, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconCurrencyDollar size={22} style={{ color: 'var(--stocky-gold)' }} />
        </Box>
        <Box style={{ flex: 1 }}>
          <Text
            size="xs"
            fw={600}
            tt="uppercase"
            style={{
              letterSpacing: '0.08em',
              color: 'var(--stocky-text-muted)',
              marginBottom: 4,
            }}
          >
            BLSH Current Price
          </Text>
          <Text
            size="xs"
            style={{
              color: 'var(--stocky-text-muted)',
            }}
          >
            Enter the current stock price to calculate values
          </Text>
        </Box>
        <Box>
          <NumberInput
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.00"
            min={0}
            step={0.01}
            decimalScale={2}
            leftSection={
              <Text size="sm" fw={600} style={{ color: 'var(--stocky-text-muted)' }}>
                $
              </Text>
            }
            styles={{
              input: {
                width: 140,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '18px',
                fontWeight: 600,
                height: 48,
                paddingLeft: 36,
                textAlign: 'right',
                fontFamily: '"DM Sans", sans-serif',
                color: 'var(--stocky-gold)',
                '&:focus': {
                  borderColor: 'var(--stocky-gold)',
                  boxShadow: '0 0 0 3px rgba(230, 194, 78, 0.15)',
                },
                '&::placeholder': {
                  color: 'var(--stocky-text-muted)',
                  fontWeight: 400,
                },
              },
            }}
          />
        </Box>
      </Group>
    </Box>
  );
}
