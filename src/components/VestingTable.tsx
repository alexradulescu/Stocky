import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { StockPlan } from '../types/index';
import { calculateVestedUnits } from '../utils/vesting';
import { formatUSD, formatSGD, formatUnits } from '../utils/formatting';
import { fetchUSDToSGDRate, convertUSDToSGD } from '../utils/currency';
import { Text } from './ui';

const TAX_RATE = 0.24;

interface VestingTableProps {
  plans: StockPlan[];
  currentStockPrice: number;
}

interface CellData {
  vestedUnits: number;
  grossUSD: number;
  taxUSD: number;
  netUSD: number;
  netSGD: number | null;
}

function computeCellData(vestedUnits: number, currentStockPrice: number, strikePrice: number, sgdRate: number | null): CellData {
  const grossUSD = Math.max(0, vestedUnits * (currentStockPrice - strikePrice));
  const taxUSD = grossUSD * TAX_RATE;
  const netUSD = grossUSD - taxUSD;
  const netSGD = sgdRate !== null ? convertUSDToSGD(netUSD, sgdRate) : null;
  return { vestedUnits, grossUSD, taxUSD, netUSD, netSGD };
}

function PopoverDetail({ data }: { data: CellData }) {
  const rows = [
    { label: 'Gross (USD)', value: formatUSD(data.grossUSD), color: 'var(--stocky-emerald)' },
    { label: 'Tax (USD)', value: `−${formatUSD(data.taxUSD)}`, color: 'var(--stocky-rose)' },
    { label: 'Net (USD)', value: formatUSD(data.netUSD), color: 'var(--stocky-text-primary)' },
    ...(data.netSGD !== null ? [{ label: 'Net (SGD)', value: formatSGD(data.netSGD), color: 'var(--stocky-gold)' }] : []),
  ];

  return (
    <div className="flex flex-col gap-2.5 min-w-[172px]">
      {rows.map(({ label, value, color }) => (
        <div key={label} className="flex justify-between items-center gap-5">
          <Text size="xs" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>{label}</Text>
          <Text size="xs" fw={600} className="number-display" style={{ color }}>{value}</Text>
        </div>
      ))}
    </div>
  );
}

export function VestingTable({ plans, currentStockPrice }: VestingTableProps) {
  const [sgdRate, setSgdRate] = useState<number | null>(null);
  const [openedCell, setOpenedCell] = useState<string | null>(null);

  useEffect(() => {
    fetchUSDToSGDRate().then((rate) => { if (rate) setSgdRate(rate); });
  }, []);

  if (plans.length === 0) return null;

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2];
  const hasPriceData = currentStockPrice > 0;

  const planProjections = plans.map((plan) => {
    const projections = years.map((year) => {
      const projectionDate = new Date(`${year}-12-31`);
      const vestedUnits = calculateVestedUnits(plan, projectionDate);
      return computeCellData(vestedUnits, currentStockPrice, plan.strikePrice, sgdRate);
    });
    return { plan, projections };
  });

  const totals: CellData[] = years.map((_, yearIndex) => {
    const totalVestedUnits = planProjections.reduce((sum, pp) => sum + pp.projections[yearIndex].vestedUnits, 0);
    const totalGrossUSD = planProjections.reduce((sum, pp) => sum + pp.projections[yearIndex].grossUSD, 0);
    const taxUSD = totalGrossUSD * TAX_RATE;
    const netUSD = totalGrossUSD - taxUSD;
    const netSGD = sgdRate !== null ? convertUSDToSGD(netUSD, sgdRate) : null;
    return { vestedUnits: totalVestedUnits, grossUSD: totalGrossUSD, taxUSD, netUSD, netSGD };
  });

  const renderCell = (data: CellData, cellId: string, isTotal: boolean, yearIdx: number) => {
    const canTap = hasPriceData;
    const isOpen = openedCell === cellId;

    return (
      <td key={cellId} className="text-right p-0">
        <Popover isOpen={isOpen} onOpenChange={(open) => setOpenedCell(open ? cellId : null)}>
          <PopoverTrigger>
            <button
              type="button"
              onClick={() => canTap && setOpenedCell(isOpen ? null : cellId)}
              className={`block w-full p-2 px-3 rounded-md transition-colors duration-150 text-right ${
                canTap ? 'cursor-pointer' : 'cursor-default'
              } ${isOpen ? (isTotal ? 'bg-[rgba(230,194,78,0.08)]' : 'bg-[rgba(230,194,78,0.06)]') : 'hover:bg-[rgba(255,255,255,0.03)]'}`}
            >
              <Text size="xs" fw={isTotal ? 600 : 500} className="number-display block">
                {formatUnits(data.vestedUnits)}
              </Text>
              {hasPriceData ? (
                <Text
                  size="xs"
                  fw={isTotal ? 600 : 500}
                  className={`number-display block ${isTotal ? 'text-gradient-gold' : ''}`}
                  style={isTotal ? undefined : { color: 'var(--stocky-text-muted)' }}
                >
                  {data.netSGD !== null ? formatSGD(data.netSGD) : formatUSD(data.netUSD)}
                </Text>
              ) : (
                <Text size="xs" className="number-display block" style={{ color: 'var(--stocky-text-muted)' }}>—</Text>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            placement="bottom"
            className="bg-[rgba(18,24,32,0.97)] border border-[rgba(255,255,255,0.1)] rounded-[10px] p-3 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="mb-2.5">
              <Text size="10px" fw={600} tt="uppercase" style={{ color: isTotal ? 'var(--stocky-gold)' : 'var(--stocky-text-muted)', letterSpacing: '0.08em' }}>
                {isTotal ? 'Total' : planProjections.find(pp => cellId.startsWith(pp.plan.id))?.plan.name} · {years[yearIdx]}
              </Text>
            </div>
            <PopoverDetail data={data} />
          </PopoverContent>
        </Popover>
      </td>
    );
  };

  return (
    <div className="rounded-[10px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[rgba(255,255,255,0.04)]">
        <Text size="xs" fw={600} tt="uppercase" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.08em' }}>
          Vesting Projections
        </Text>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-transparent text-[13px]">
          <thead>
            <tr>
              <th className="text-left text-[10px] font-semibold tracking-[0.06em] uppercase text-[var(--stocky-text-muted)] border-b border-[rgba(255,255,255,0.04)] px-3 py-2">
                Plan
              </th>
              {years.map((year) => (
                <th key={year} className="text-right text-[10px] font-semibold tracking-[0.06em] uppercase text-[var(--stocky-text-muted)] border-b border-[rgba(255,255,255,0.04)] px-3 py-2">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {planProjections.map((pp) => (
              <tr key={pp.plan.id}>
                <td className="border-b border-[rgba(255,255,255,0.02)] px-3 py-2">
                  <Text size="xs" fw={500} style={{ color: 'var(--stocky-text-primary)' }}>{pp.plan.name}</Text>
                </td>
                {pp.projections.map((proj, idx) => renderCell(proj, `${pp.plan.id}-${idx}`, false, idx))}
              </tr>
            ))}
            <tr className="bg-[rgba(230,194,78,0.04)]">
              <td className="px-3 py-2">
                <Text size="xs" fw={600} style={{ color: 'var(--stocky-gold)' }}>Total</Text>
              </td>
              {totals.map((total, idx) => renderCell(total, `total-${idx}`, true, idx))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
