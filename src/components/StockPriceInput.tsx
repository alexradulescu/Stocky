import { useState, useEffect } from 'react';
import { NumberInput, Group, Text } from '@mantine/core';
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
    <Group mb="xl">
      <div>
        <Text size="sm" fw={500}>
          BLSH Price (USD)
        </Text>
        <NumberInput
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter stock price"
          min={0}
          step={0.01}
          decimalScale={2}
          style={{ width: '150px' }}
        />
      </div>
    </Group>
  );
}
