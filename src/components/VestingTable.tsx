import { Fragment } from 'react';
import { Box, Table, Text, Title, Group } from '@mantine/core';
import { IconCalendarStats } from '@tabler/icons-react';
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
    <Box className="glass-panel" style={{ overflow: 'hidden' }}>
      {/* Table Header */}
      <Box
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 100%)',
        }}
      >
        <Group gap="sm" align="center">
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(230, 194, 78, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconCalendarStats size={18} style={{ color: 'var(--stocky-gold)' }} />
          </Box>
          <Box>
            <Title order={4} style={{ fontSize: '1rem', marginBottom: 2 }}>
              Vesting Projections
            </Title>
            <Text size="xs" style={{ color: 'var(--stocky-text-muted)' }}>
              Based on {formatUSD(currentStockPrice)} per share
            </Text>
          </Box>
        </Group>
      </Box>

      {/* Table Content */}
      <Box style={{ overflowX: 'auto' }}>
        <Table
          verticalSpacing="md"
          horizontalSpacing="lg"
          styles={{
            table: {
              backgroundColor: 'transparent',
              borderCollapse: 'collapse',
            },
            thead: {
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
            },
            th: {
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--stocky-text-muted)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '14px 20px',
            },
            td: {
              borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
              padding: '16px 20px',
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '40%' }}>Plan</Table.Th>
              {years.map((year, idx) => (
                <Table.Th key={year} ta="center">
                  <Box>
                    <Text
                      fw={700}
                      size="sm"
                      style={{
                        color:
                          idx === 0
                            ? 'var(--stocky-gold)'
                            : 'var(--stocky-text-secondary)',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {year}
                    </Text>
                    <Text
                      size="xs"
                      style={{
                        color: 'var(--stocky-text-muted)',
                        fontWeight: 400,
                        letterSpacing: '0.02em',
                        marginTop: 2,
                      }}
                    >
                      EOY
                    </Text>
                  </Box>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {planProjections.map((pp) => (
              <Fragment key={pp.plan.id}>
                <Table.Tr
                  style={{
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <Table.Td>
                    <Text
                      fw={500}
                      size="sm"
                      style={{ color: 'var(--stocky-text-primary)' }}
                    >
                      {pp.plan.name}
                    </Text>
                    <Text
                      size="xs"
                      style={{
                        color: 'var(--stocky-gold)',
                        letterSpacing: '0.06em',
                        marginTop: 2,
                      }}
                    >
                      {pp.plan.ticker}
                    </Text>
                  </Table.Td>
                  {pp.projections.map((proj, idx) => (
                    <Table.Td key={idx} ta="center">
                      <Text
                        size="sm"
                        fw={600}
                        className="number-display"
                        style={{ color: 'var(--stocky-text-primary)' }}
                      >
                        {formatUnits(proj.vestedUnits)}
                      </Text>
                      <Text
                        size="xs"
                        className="number-display"
                        style={{
                          color:
                            proj.value > 0
                              ? 'var(--stocky-emerald)'
                              : 'var(--stocky-text-muted)',
                          marginTop: 2,
                        }}
                      >
                        {currentStockPrice > 0 ? formatUSD(proj.value) : '—'}
                      </Text>
                    </Table.Td>
                  ))}
                </Table.Tr>
              </Fragment>
            ))}

            {/* Total Row */}
            <Table.Tr
              style={{
                background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.06) 0%, rgba(230, 194, 78, 0.02) 100%)',
              }}
            >
              <Table.Td>
                <Text
                  fw={700}
                  size="sm"
                  style={{ color: 'var(--stocky-gold)' }}
                >
                  TOTAL
                </Text>
              </Table.Td>
              {totals.map((total, idx) => (
                <Table.Td key={idx} ta="center">
                  <Text
                    size="sm"
                    fw={700}
                    className="number-display"
                    style={{ color: 'var(--stocky-text-primary)' }}
                  >
                    {formatUnits(total.totalUnits)}
                  </Text>
                  <Text
                    size="xs"
                    fw={600}
                    className="number-display text-gradient-gold"
                    style={{ marginTop: 2 }}
                  >
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
