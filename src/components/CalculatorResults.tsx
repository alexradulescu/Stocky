import {
  Box,
  Text,
  Stack,
  Table,
  SimpleGrid,
  Group,
  Title,
} from '@mantine/core';
import {
  IconCoins,
  IconReceipt,
  IconTrendingUp,
  IconReceiptTax,
  IconWallet,
  IconCurrencyDollar,
  IconList,
} from '@tabler/icons-react';
import { CalculatorResults as CalculatorResultsType } from '../types/index';
import { formatUSD, formatSGD, formatUnits } from '../utils/formatting';

interface CalculatorResultsProps {
  results: CalculatorResultsType;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'highlight';
  subtext?: string;
}

function StatCard({ label, value, icon, variant = 'default', subtext }: StatCardProps) {
  const colorMap = {
    default: 'var(--stocky-text-primary)',
    success: 'var(--stocky-emerald)',
    danger: 'var(--stocky-rose)',
    highlight: 'var(--stocky-gold)',
  };

  const bgMap = {
    default: 'rgba(255, 255, 255, 0.05)',
    success: 'rgba(34, 197, 94, 0.1)',
    danger: 'rgba(244, 63, 94, 0.1)',
    highlight: 'rgba(230, 194, 78, 0.1)',
  };

  return (
    <Box
      className="glass-panel"
      style={{ padding: '20px 24px' }}
    >
      <Group gap="sm" align="flex-start">
        <Box
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: bgMap[variant],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colorMap[variant],
          }}
        >
          {icon}
        </Box>
        <Box style={{ flex: 1 }}>
          <Text
            size="xs"
            fw={500}
            tt="uppercase"
            style={{
              letterSpacing: '0.06em',
              color: 'var(--stocky-text-muted)',
            }}
          >
            {label}
          </Text>
          <Text
            size="xl"
            fw={700}
            className="number-display"
            style={{ color: colorMap[variant], marginTop: 2 }}
          >
            {value}
          </Text>
          {subtext && (
            <Text
              size="xs"
              style={{ color: 'var(--stocky-text-muted)', marginTop: 4 }}
            >
              {subtext}
            </Text>
          )}
        </Box>
      </Group>
    </Box>
  );
}

export function CalculatorResults({ results }: CalculatorResultsProps) {
  const hasExchangeRate = results.exchangeRate > 0;

  return (
    <Stack gap="xl">
      {/* Highlight Card - Net Profit */}
      <Box
        style={{
          padding: '28px 32px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.12) 0%, rgba(230, 194, 78, 0.04) 100%)',
          border: '1px solid rgba(230, 194, 78, 0.2)',
          textAlign: 'center',
        }}
      >
        <Text
          size="xs"
          fw={600}
          tt="uppercase"
          style={{
            letterSpacing: '0.1em',
            color: 'var(--stocky-gold)',
            marginBottom: 8,
          }}
        >
          Estimated Net Profit
        </Text>
        <Text
          style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
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
            size="sm"
            style={{ color: 'var(--stocky-text-secondary)', marginTop: 8 }}
            className="number-display"
          >
            {formatSGD(results.netProfitSGD)} SGD
          </Text>
        )}
      </Box>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="md">
        <StatCard
          label="Vested Units"
          value={`${formatUnits(results.totalVestedUnits)}`}
          icon={<IconCoins size={20} />}
        />
        <StatCard
          label="Sale Value"
          value={formatUSD(results.totalSaleValue)}
          icon={<IconCurrencyDollar size={20} />}
        />
        <StatCard
          label="Strike Cost"
          value={formatUSD(results.totalStrikeCost)}
          icon={<IconReceipt size={20} />}
        />
        <StatCard
          label="Gross Profit"
          value={formatUSD(results.grossProfit)}
          icon={<IconTrendingUp size={20} />}
          variant="success"
        />
        <StatCard
          label="Tax (24%)"
          value={`-${formatUSD(results.tax)}`}
          icon={<IconReceiptTax size={20} />}
          variant="danger"
        />
        <StatCard
          label="Net Profit"
          value={formatUSD(results.netProfitUSD)}
          icon={<IconWallet size={20} />}
          variant="highlight"
          subtext={hasExchangeRate ? `${formatSGD(results.netProfitSGD)} SGD` : undefined}
        />
      </SimpleGrid>

      {/* Exchange Rate Note */}
      {hasExchangeRate && (
        <Text
          size="xs"
          ta="center"
          style={{ color: 'var(--stocky-text-muted)' }}
        >
          Exchange rate: 1 USD = {results.exchangeRate.toFixed(4)} SGD
        </Text>
      )}

      {/* Breakdown Table */}
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
              <IconList size={18} style={{ color: 'var(--stocky-gold)' }} />
            </Box>
            <Title order={4} style={{ fontSize: '1rem' }}>
              Breakdown by Plan
            </Title>
          </Group>
        </Box>

        <Box style={{ overflowX: 'auto' }}>
          <Table
            verticalSpacing="md"
            horizontalSpacing="lg"
            styles={{
              table: {
                backgroundColor: 'transparent',
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
                <Table.Th>Plan</Table.Th>
                <Table.Th ta="right">Units</Table.Th>
                <Table.Th ta="right">Strike Cost</Table.Th>
                <Table.Th ta="right">Sale Value</Table.Th>
                <Table.Th ta="right">Profit</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {results.breakdownByPlan.map((item) => (
                <Table.Tr key={item.planId}>
                  <Table.Td>
                    <Text fw={500} size="sm" style={{ color: 'var(--stocky-text-primary)' }}>
                      {item.planName}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                      {formatUnits(item.vestedUnits)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" className="number-display" style={{ color: 'var(--stocky-text-secondary)' }}>
                      {formatUSD(item.strikeCost)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text size="sm" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                      {formatUSD(item.saleValue)}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">
                    <Text
                      size="sm"
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
                  background: 'linear-gradient(135deg, rgba(230, 194, 78, 0.06) 0%, rgba(230, 194, 78, 0.02) 100%)',
                }}
              >
                <Table.Td>
                  <Text fw={700} size="sm" style={{ color: 'var(--stocky-gold)' }}>
                    TOTAL
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text fw={700} size="sm" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                    {formatUnits(results.totalVestedUnits)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text fw={700} size="sm" className="number-display" style={{ color: 'var(--stocky-text-secondary)' }}>
                    {formatUSD(results.totalStrikeCost)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text fw={700} size="sm" className="number-display" style={{ color: 'var(--stocky-text-primary)' }}>
                    {formatUSD(results.totalSaleValue)}
                  </Text>
                </Table.Td>
                <Table.Td ta="right">
                  <Text
                    fw={700}
                    size="sm"
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
    </Stack>
  );
}
