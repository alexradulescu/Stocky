import { Fragment } from 'react';
import { Table, Text } from '@mantine/core';
import { StockPlan } from '../types/index';
import { calculateVestedUnits } from '../utils/vesting';
import { formatUSD, formatUnits } from '../utils/formatting';

interface VestingTableProps {
  plans: StockPlan[];
  currentStockPrice: number;
}

export function VestingTable({ plans, currentStockPrice }: VestingTableProps) {
  if (plans.length === 0) {
    return (
      <div style={{ padding: 'var(--mantine-spacing-xl)', textAlign: 'center', marginBottom: 'var(--mantine-spacing-xl)' }}>
        <Text c="dimmed">No plans yet. Add your first stock option plan.</Text>
      </div>
    );
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
    <div style={{ marginBottom: 'var(--mantine-spacing-xl)', overflowX: 'auto' }}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Plan Name</Table.Th>
            {years.map((year) => (
              <Table.Th key={year} ta="center" style={{ width: '150px' }}>
                {year}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {planProjections.map((pp) => (
            <Fragment key={pp.plan.id}>
              <Table.Tr>
                <Table.Td>{pp.plan.name}</Table.Td>
                {pp.projections.map((proj, idx) => (
                  <Table.Td key={idx} ta="center">
                    <div>
                      <Text size="sm" fw={500}>
                        {formatUnits(proj.vestedUnits)} units
                      </Text>
                      <Text size="sm" c="dimmed">
                        {formatUSD(proj.value)}
                      </Text>
                    </div>
                  </Table.Td>
                ))}
              </Table.Tr>
            </Fragment>
          ))}
          <Table.Tr style={{ fontWeight: 'bold' }}>
            <Table.Td>
              <strong>TOTAL</strong>
            </Table.Td>
            {totals.map((total, idx) => (
              <Table.Td key={idx} ta="center">
                <div>
                  <Text size="sm" fw={700}>
                    {formatUnits(total.totalUnits)} units
                  </Text>
                  <Text size="sm" fw={700}>
                    {formatUSD(total.totalValue)}
                  </Text>
                </div>
              </Table.Td>
            ))}
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );
}
