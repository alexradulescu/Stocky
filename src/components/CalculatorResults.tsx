import {
  Box,
  Text,
  Table,
  Group,
} from '@mantine/core';
import { CalculatorResults as CalculatorResultsType } from '../types/index';
import { formatUSD, formatSGD, formatUnits } from '../utils/formatting';

interface CalculatorResultsProps {
  results: CalculatorResultsType;
}

export function CalculatorResults({ results }: CalculatorResultsProps) {
  const hasExchangeRate = results.exchangeRate > 0;

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Net Profit Hero - Compact */}
      <Box
        style={{
          padding: '16px 20px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.1) 0%, rgba(230, 194, 78, 0.03) 100%)',
          border: '1px solid rgba(230, 194, 78, 0.15)',
          textAlign: 'center',
        }}
      >
        <Text
          size="xs"
          fw={600}
          tt="uppercase"
          style={{
            letterSpacing: '0.08em',
            color: 'var(--stocky-gold)',
            marginBottom: 4,
          }}
        >
          Estimated Net Profit
        </Text>
        <Text
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            fontFamily: '"Source Serif 4", Georgia, serif',
            background: 'linear-gradient(135deg, #e6c24e 0%, #f0da94 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1,
          }}
          className="number-display"
        >
          {formatUSD(results.netProfitUSD)}
        </Text>
        {hasExchangeRate && (
          <Text
            size="xs"
            style={{ color: 'var(--stocky-text-secondary)', marginTop: 4 }}
            className="number-display"
          >
            {formatSGD(results.netProfitSGD)} SGD
          </Text>
        )}
      </Box>

      {/* Stats Row - Compact Grid */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        <Box style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }}>
            Vested
          </Text>
          <Text size="sm" fw={600} className="number-display">
            {formatUnits(results.totalVestedUnits)}
          </Text>
        </Box>
        <Box style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }}>
            Sale Value
          </Text>
          <Text size="sm" fw={600} className="number-display">
            {formatUSD(results.totalSaleValue)}
          </Text>
        </Box>
        <Box style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }}>
            Strike Cost
          </Text>
          <Text size="sm" fw={600} className="number-display">
            {formatUSD(results.totalStrikeCost)}
          </Text>
        </Box>
      </Box>

      {/* Second Row - Profit Breakdown */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}
      >
        <Box style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.1)' }}>
          <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }}>
            Gross
          </Text>
          <Text size="sm" fw={600} className="number-display" style={{ color: 'var(--stocky-emerald)' }}>
            {formatUSD(results.grossProfit)}
          </Text>
        </Box>
        <Box style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.1)' }}>
          <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }}>
            Tax (24%)
          </Text>
          <Text size="sm" fw={600} className="number-display" style={{ color: 'var(--stocky-rose)' }}>
            -{formatUSD(results.tax)}
          </Text>
        </Box>
        <Box style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(230, 194, 78, 0.06)', border: '1px solid rgba(230, 194, 78, 0.1)' }}>
          <Text size="10px" fw={500} tt="uppercase" style={{ letterSpacing: '0.04em', color: 'var(--stocky-text-muted)', marginBottom: 2 }}>
            Net
          </Text>
          <Text size="sm" fw={600} className="number-display" style={{ color: 'var(--stocky-gold)' }}>
            {formatUSD(results.netProfitUSD)}
          </Text>
        </Box>
      </Box>

      {/* Exchange Rate */}
      {hasExchangeRate && (
        <Text
          size="10px"
          ta="center"
          style={{ color: 'var(--stocky-text-muted)' }}
        >
          1 USD = {results.exchangeRate.toFixed(4)} SGD
        </Text>
      )}

      {/* Breakdown Table - Compact */}
      <Box
        style={{
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        <Group
          gap="xs"
          style={{
            padding: '10px 12px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <Text size="xs" fw={600}>Plan Breakdown</Text>
        </Group>

        <Box style={{ overflowX: 'auto' }}>
          <Table
            verticalSpacing={6}
            horizontalSpacing={10}
            styles={{
              table: {
                backgroundColor: 'transparent',
                fontSize: '12px',
              },
              th: {
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'var(--stocky-text-muted)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '8px 10px',
              },
              td: {
                borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                padding: '8px 10px',
              },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Plan</Table.Th>
                <Table.Th ta="right">Units</Table.Th>
                <Table.Th ta="right">Strike</Table.Th>
                <Table.Th ta="right">Value</Table.Th>
                <Table.Th ta="right">Profit</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {results.breakdownByPlan.map((item) => (
                <Table.Tr key={item.planId}>
                  <Table.Td>
                    <Text fw={500} size="xs" style={{ color: 'var(--stocky-text-primary)' }}>
                      {item.planName}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                      {formatUnits(item.vestedUnits)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="xs" className="number-display" style={{ color: 'var(--stocky-text-secondary)' }}>
                      {formatUSD(item.strikeCost)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                      {formatUSD(item.saleValue)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text
                      size="xs"
                      fw={600}
                      className="number-display"
                      style={{
                        color: item.profit >= 0 ? 'var(--stocky-emerald)' : 'var(--stocky-rose)',
                      }}
                    >
                      {formatUSD(item.profit)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}

              {/* Total Row */}
              <Table.Tr
                style={{
                  background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.05) 0%, rgba(230, 194, 78, 0.02) 100%)',
                }}
              >
                <Table.Td>
                  <Text fw={700} size="xs" style={{ color: 'var(--stocky-gold)' }}>
                    TOTAL
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text fw={700} size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                    {formatUnits(results.totalVestedUnits)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text fw={700} size="xs" className="number-display" style={{ color: 'var(--stocky-text-secondary)' }}>
                    {formatUSD(results.totalStrikeCost)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text fw={700} size="xs" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                    {formatUSD(results.totalSaleValue)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text
                    fw={700}
                    size="xs"
                    className="number-display text-gradient-gold"
                  >
                    {formatUSD(results.grossProfit)}
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
