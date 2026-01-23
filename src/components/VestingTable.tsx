import { Fragment } from 'react';
import { Box, Table, Text } from '@mantine/core';
import { StockPlan } from '../types/index';
import { calculateVestedUnits } from '../utils/vesting';
import { formatUSD, formatUnits } from '../utils/formatting';

interface VestingTableProps {
  plans: StockPlan[];
  currentStockPrice: number;
}

export function VestingTable({ plans, currentStockPrice }: VestingTableProps) {
  if (plans.length === 0) {
    return null;
  }

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2];

  // Calculate vested units and values for each plan and year
  const planProjections = plans.map((plan) => {
    const projections = years.map((year) => {
      const dateStr = `${year}-12-31`;
      const projectionDate = new Date(dateStr);
      const vestedUnits = calculateVestedUnits(plan, projectionDate);
      const value = vestedUnits * currentStockPrice;
      return { vestedUnits, value };
    });
    return { plan, projections };
  });

  // Calculate totals
  const totals = years.map((_, yearIndex) => {
    const totalUnits = planProjections.reduce(
      (sum, pp) => sum + pp.projections[yearIndex].vestedUnits,
      0
    );
    const totalValue = planProjections.reduce(
      (sum, pp) => sum + pp.projections[yearIndex].value,
      0
    );
    return { totalUnits, totalValue };
  });

  return (
    <Box
      style={{
        borderRadius: 10,
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        overflow: 'hidden',
      }}
    >
      <Box style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
        <Text size="xs" fw={600} tt="uppercase" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.08em' }}>
          Vesting Projections
        </Text>
      </Box>

      <Box style={{ overflowX: 'auto' }}>
        <Table
          verticalSpacing={8}
          horizontalSpacing={12}
          styles={{
            table: { backgroundColor: 'transparent', fontSize: '13px' },
            th: {
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--stocky-text-muted)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
              padding: '8px 12px',
            },
            td: {
              borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
              padding: '8px 12px',
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Plan</Table.Th>
              {years.map((year) => (
                <Table.Th key={year} ta="right">{year}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {planProjections.map((pp) => (
              <Fragment key={pp.plan.id}>
                <Table.Tr>
                  <Table.Td>
                    <Text size="xs" fw={500} style={{ color: 'var(--stocky-text-primary)' }}>
                      {pp.plan.name}
                    </Text>
                  </Table.Td>
                  {pp.projections.map((proj, idx) => (
                    <Table.Td key={idx} ta="right">
                      <Text size="xs" fw={500} className="number-display">
                        {formatUnits(proj.vestedUnits)}
                      </Text>
                      <Text size="xs" className="number-display" style={{ color: 'var(--stocky-text-muted)' }}>
                        {currentStockPrice > 0 ? formatUSD(proj.value) : '—'}
                      </Text>
                    </Table.Td>
                  ))}
                </Table.Tr>
              </Fragment>
            ))}

            {/* Total Row */}
            <Table.Tr style={{ background: 'rgba(230, 194, 78, 0.04)' }}>
              <Table.Td>
                <Text size="xs" fw={600} style={{ color: 'var(--stocky-gold)' }}>Total</Text>
              </Table.Td>
              {totals.map((total, idx) => (
                <Table.Td key={idx} ta="right">
                  <Text size="xs" fw={600} className="number-display">
                    {formatUnits(total.totalUnits)}
                  </Text>
                  <Text size="xs" fw={500} className="number-display text-gradient-gold">
                    {currentStockPrice > 0 ? formatUSD(total.totalValue) : '—'}
                  </Text>
                </Table.Td>
              ))}
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
