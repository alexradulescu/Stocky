import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { IconX } from '@tabler/icons-react';
import { useStore } from '../store/useStore';
import { Group, Text } from './ui';

export function StockPriceInput() {
  const { currentStockPrice, setCurrentStockPrice, clearCurrentStockPrice } = useStore();
  const [inputValue, setInputValue] = useState<string>(currentStockPrice > 0 ? currentStockPrice.toString() : '');

  useEffect(() => {
    setInputValue(currentStockPrice > 0 ? currentStockPrice.toString() : '');
  }, [currentStockPrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num > 0) {
      setCurrentStockPrice(num);
    }
  };

  const handleClear = () => {
    setInputValue('');
    clearCurrentStockPrice();
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  return (
    <div className="p-2 px-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
      <Group justify="space-between" align="center">
        <div>
          <Text size="xs" fw={500} style={{ color: 'var(--stocky-text-primary)' }}>BLSH Price</Text>
          <Text size="10px" style={{ color: 'var(--stocky-text-muted)' }}>Current stock price</Text>
        </div>
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={inputValue ? `$${inputValue}` : ''}
            onChange={(e) => {
              const val = e.target.value.replace('$', '');
              handleChange({ ...e, target: { ...e.target, value: val } } as any);
            }}
            onClick={handleClick}
            placeholder="$0.00"
            className="w-[110px] h-[34px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-base font-semibold text-right text-[var(--stocky-gold)] px-2 pr-8 focus:border-[var(--stocky-gold)] focus:outline-none placeholder:text-[var(--stocky-text-muted)]"
          />
          {currentStockPrice > 0 && (
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              onPress={handleClear}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-w-0 w-6 h-6"
            >
              <IconX size={14} />
            </Button>
          )}
        </div>
      </Group>
    </div>
  );
}
