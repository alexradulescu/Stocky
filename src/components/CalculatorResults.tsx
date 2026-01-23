import {
  Card,
  Text,
  Stack,
  Table,
  SimpleGrid,
} from '@mantine/core';
import { CalculatorResults as CalculatorResultsType } from '../types/index';
import { formatUSD, formatUnits } from '../utils/formatting';

interface CalculatorResultsProps {
  results: CalculatorResultsType;
}

export function CalculatorResults({ results }: CalculatorResultsProps) {
  const hasExchangeRate = results.exchangeRate > 0;

  return (
    <Stack gap="lg">
      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Vested Units
            </Text>
            <Text size="lg" fw={700}>
              {formatUnits(results.totalVestedUnits)} units
            </Text>
          </Stack>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Total Sale Value
            </Text>
            <Text size="lg" fw={700}>
              {formatUSD(results.totalSaleValue)}
            </Text>
          </Stack>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Strike Price Cost
            </Text>
            <Text size="lg" fw={700}>
              {formatUSD(results.totalStrikeCost)}
            </Text>
          </Stack>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Gross Profit
            </Text>
            <Text size="lg" fw={700} c="green">
              {formatUSD(results.grossProfit)}
            </Text>
          </Stack>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Tax (24%)
            </Text>
            <Text size="lg" fw={700} c="red">
              {formatUSD(results.tax)}
            </Text>
          </Stack>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Net Profit (USD)
            </Text>
            <Text size="lg" fw={700} c="blue">
              {formatUSD(results.netProfitUSD)}
            </Text>
          </Stack>
        </Card>

        {hasExchangeRate && (
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                Net Profit (SGD)
              </Text>
              <Text size="lg" fw={700} c="blue">
                S${formatUnits(results.netProfitSGD)}.00
              </Text>
            </Stack>
          </Card>
        )}
      </SimpleGrid>

      {hasExchangeRate && (
        <Text size="sm" c="dimmed" ta="center">
          Exchange rate: 1 USD = {results.exchangeRate.toFixed(2)} SGD
        </Text>
      )}

      {/* Breakdown Table */}
      <div>
        <Text fw={600} mb="md">
          Breakdown by Plan
        </Text>
        <div style={{ overflowX: 'auto' }}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Plan Name</Table.Th>
                <Table.Th ta="right">Vested Units</Table.Th>
                <Table.Th ta="right">Strike Cost</Table.Th>
                <Table.Th ta="right">Sale Value</Table.Th>
                <Table.Th ta="right">Profit</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {results.breakdownByPlan.map((item) => (
                <Table.Tr key={item.planId}>
                  <Table.Td>{item.planName}</Table.Td>
                  <Table.Td ta="right">{formatUnits(item.vestedUnits)}</Table.Td>
                  <Table.Td ta="right">{formatUSD(item.strikeCost)}</Table.Td>
                  <Table.Td ta="right">{formatUSD(item.saleValue)}</Table.Td>
                  <Table.Td ta="right">{formatUSD(item.profit)}</Table.Td>
                </Table.Tr>
              ))}
              <Table.Tr style={{ fontWeight: 'bold' }}>
                <Table.Td>
                  <strong>TOTAL</strong>
                </Table.Td>
                <Table.Td ta="right">
                  <strong>{formatUnits(results.totalVestedUnits)}</strong>
                </Table.Td>
                <Table.Td ta="right">
                  <strong>{formatUSD(results.totalStrikeCost)}</strong>
                </Table.Td>
                <Table.Td ta="right">
                  <strong>{formatUSD(results.totalSaleValue)}</strong>
                </Table.Td>
                <Table.Td ta="right">
                  <strong>{formatUSD(results.grossProfit)}</strong>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </Stack>
  );
}
