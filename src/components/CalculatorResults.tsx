import { Text } from './ui';
import { CalculatorResults as CalculatorResultsType } from '../types/index';
import { formatUSD, formatSGD, formatUnits } from '../utils/formatting';

interface CalculatorResultsProps {
  results: CalculatorResultsType;
}

export function CalculatorResults({ results }: CalculatorResultsProps) {
  const hasExchangeRate = results.exchangeRate > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Net Profit Hero */}
      <div className="p-4 px-5 rounded-xl bg-gradient-to-br from-[rgba(230,194,78,0.1)] to-[rgba(230,194,78,0.03)] border border-[rgba(230,194,78,0.15)] text-center">
        <Text size="xs" fw={600} tt="uppercase" style={{ letterSpacing: '0.08em', color: 'var(--stocky-gold)', marginBottom: 4 }} className="block">
          Estimated Net Profit
        </Text>
        <span
          className="number-display block"
          style={{
            fontSize: '1.75rem', fontWeight: 700, fontFamily: '"Source Serif 4", Georgia, serif',
            background: 'linear-gradient(135deg, #e6c24e 0%, #f0da94 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1,
          }}
        >
          {formatUSD(results.netProfitUSD)}
        </span>
        {hasExchangeRate && (
          <Text size="xs" className="number-display mt-1 block" style={{ color: 'var(--stocky-text-secondary)' }}>
            {formatSGD(results.netProfitSGD)}
          </Text>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Vested', value: formatUnits(results.totalVestedUnits), borderColor: 'rgba(255,255,255,0.06)', bgColor: 'rgba(255,255,255,0.02)' },
          { label: 'Sale Value', value: formatUSD(results.totalSaleValue), borderColor: 'rgba(255,255,255,0.06)', bgColor: 'rgba(255,255,255,0.02)' },
          { label: 'Strike Cost', value: formatUSD(results.totalStrikeCost), borderColor: 'rgba(255,255,255,0.06)', bgColor: 'rgba(255,255,255,0.02)' },
        ].map(({ label, value, borderColor, bgColor }) => (
          <div key={label} className="p-2.5 px-3 rounded-lg" style={{ background: bgColor, border: `1px solid ${borderColor}` }}>
            <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }} className="block">{label}</Text>
            <Text size="sm" fw={600} className="number-display">{value}</Text>
          </div>
        ))}
      </div>

      {/* Profit Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Gross', value: formatUSD(results.grossProfit), color: 'var(--stocky-emerald)', borderColor: 'rgba(34,197,94,0.1)', bgColor: 'rgba(34,197,94,0.06)' },
          { label: 'Tax (24%)', value: `-${formatUSD(results.tax)}`, color: 'var(--stocky-rose)', borderColor: 'rgba(244,63,94,0.1)', bgColor: 'rgba(244,63,94,0.06)' },
          { label: 'Net', value: formatUSD(results.netProfitUSD), color: 'var(--stocky-gold)', borderColor: 'rgba(230,194,78,0.1)', bgColor: 'rgba(230,194,78,0.06)' },
        ].map(({ label, value, color, borderColor, bgColor }) => (
          <div key={label} className="p-2.5 px-3 rounded-lg" style={{ background: bgColor, border: `1px solid ${borderColor}` }}>
            <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }} className="block">{label}</Text>
            <Text size="sm" fw={600} className="number-display" style={{ color }}>{value}</Text>
          </div>
        ))}
      </div>

      {hasExchangeRate && (
        <Text size="10px" ta="center" style={{ color: 'var(--stocky-text-muted)' }} className="block">
          1 USD = {results.exchangeRate.toFixed(4)} SGD
        </Text>
      )}

      {/* Breakdown Table */}
      <div className="rounded-[10px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <div className="flex items-center gap-1 px-3 py-2.5 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
          <Text size="xs" fw={600}>Plan Breakdown</Text>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full bg-transparent text-xs">
            <thead>
              <tr>
                {['Plan', 'Units', 'Strike', 'Value', 'Profit'].map((h, i) => (
                  <th key={h} className={`text-[10px] font-semibold tracking-wider uppercase text-[var(--stocky-text-muted)] border-b border-[rgba(255,255,255,0.06)] p-2 px-2.5 ${i > 0 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.breakdownByPlan.map((item) => (
                <tr key={item.planId}>
                  <td className="border-b border-[rgba(255,255,255,0.03)] p-2 px-2.5">
                    <Text fw={500} size="xs" style={{ color: 'var(--stocky-text-primary)' }}>{item.planName}</Text>
                  </td>
                  <td className="text-right border-b border-[rgba(255,255,255,0.03)] p-2 px-2.5">
                    <Text size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>{formatUnits(item.vestedUnits)}</Text>
                  </td>
                  <td className="text-right border-b border-[rgba(255,255,255,0.03)] p-2 px-2.5">
                    <Text size="xs" className="number-display" style={{ color: 'var(--stocky-text-secondary)' }}>{formatUSD(item.strikeCost)}</Text>
                  </td>
                  <td className="text-right border-b border-[rgba(255,255,255,0.03)] p-2 px-2.5">
                    <Text size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>{formatUSD(item.saleValue)}</Text>
                  </td>
                  <td className="text-right border-b border-[rgba(255,255,255,0.03)] p-2 px-2.5">
                    <Text size="xs" fw={600} className="number-display" style={{ color: item.profit >= 0 ? 'var(--stocky-emerald)' : 'var(--stocky-rose)' }}>
                      {formatUSD(item.profit)}
                    </Text>
                  </td>
                </tr>
              ))}
              <tr className="bg-gradient-to-r from-[rgba(230,194,78,0.05)] to-[rgba(230,194,78,0.02)]">
                <td className="p-2 px-2.5"><Text fw={700} size="xs" style={{ color: 'var(--stocky-gold)' }}>TOTAL</Text></td>
                <td className="text-right p-2 px-2.5"><Text fw={700} size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>{formatUnits(results.totalVestedUnits)}</Text></td>
                <td className="text-right p-2 px-2.5"><Text fw={700} size="xs" className="number-display" style={{ color: 'var(--stocky-text-secondary)' }}>{formatUSD(results.totalStrikeCost)}</Text></td>
                <td className="text-right p-2 px-2.5"><Text fw={700} size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>{formatUSD(results.totalSaleValue)}</Text></td>
                <td className="text-right p-2 px-2.5"><Text fw={700} size="xs" className="number-display text-gradient-gold">{formatUSD(results.grossProfit)}</Text></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
