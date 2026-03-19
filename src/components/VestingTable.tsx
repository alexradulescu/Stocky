import { Fragment, useState, useEffect } from 'react';
import { Box, Table, Text, Popover } from '@mantine/core';
import { StockPlan } from '../types/index';
import { calculateVestedUnits } from '../utils/vesting';
import { formatUSD, formatSGD, formatUnits } from '../utils/formatting';
import { fetchUSDToSGDRate, convertUSDToSGD } from '../utils/currency';

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

function computeCellData(
  vestedUnits: number,
  currentStockPrice: number,
  strikePrice: number,
  sgdRate: number | null
): CellData {
  const grossUSD = Math.max(0, vestedUnits * (currentStockPrice - strikePrice));
  const taxUSD = grossUSD * TAX_RATE;
  const netUSD = grossUSD - taxUSD;
  const netSGD = sgdRate !== null ? convertUSDToSGD(netUSD, sgdRate) : null;
  return { vestedUnits, grossUSD, taxUSD, netUSD, netSGD };
}

interface PopoverDetailProps {
  data: CellData;
}

function PopoverDetail({ data }: PopoverDetailProps) {
  const rows = [
    { label: 'Gross (USD)', value: formatUSD(data.grossUSD), color: 'var(--stocky-emerald)' },
    { label: 'Tax (USD)', value: `−${formatUSD(data.taxUSD)}`, color: 'var(--stocky-rose)' },
    { label: 'Net (USD)', value: formatUSD(data.netUSD), color: 'var(--stocky-text-primary)' },
    ...(data.netSGD !== null
      ? [{ label: 'Net (SGD)', value: formatSGD(data.netSGD), color: 'var(--stocky-gold)' }]
      : []),
  ];

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 172 }}>
      {rows.map(({ label, value, color }) => (
        <Box
          key={label}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}
        >
          <Text size="xs" style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.02em' }}>
            {label}
          </Text>
          <Text size="xs" fw={600} className="number-display" style={{ color }}>
            {value}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

export function VestingTable({ plans, currentStockPrice }: VestingTableProps) {
  const [sgdRate, setSgdRate] = useState<number | null>(null);
  const [openedCell, setOpenedCell] = useState<string | null>(null);

  useEffect(() => {
    fetchUSDToSGDRate().then((rate) => {
      if (rate) setSgdRate(rate);
    });
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
    const totalVestedUnits = planProjections.reduce(
      (sum, pp) => sum + pp.projections[yearIndex].vestedUnits,
      0
    );
    const totalGrossUSD = planProjections.reduce(
      (sum, pp) => sum + pp.projections[yearIndex].grossUSD,
      0
    );
    const taxUSD = totalGrossUSD * TAX_RATE;
    const netUSD = totalGrossUSD - taxUSD;
    const netSGD = sgdRate !== null ? convertUSDToSGD(netUSD, sgdRate) : null;
    return { vestedUnits: totalVestedUnits, grossUSD: totalGrossUSD, taxUSD, netUSD, netSGD };
  });

  const toggleCell = (id: string) =>
    setOpenedCell((prev) => (prev === id ? null : id));

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
        <Text
          size="xs"
          fw={600}
          tt="uppercase"
          style={{ color: 'var(--stocky-text-muted)', letterSpacing: '0.08em' }}
        >
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
                <Table.Th key={year} ta="right">
                  {year}
                </Table.Th>
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
                  {pp.projections.map((proj, idx) => {
                    const cellId = `${pp.plan.id}-${idx}`;
                    const isOpen = openedCell === cellId;
                    const canTap = hasPriceData;

                    return (
                      <Table.Td key={idx} ta="right" style={{ padding: 0 }}>
                        <Popover
                          opened={isOpen}
                          onClose={() => setOpenedCell(null)}
                          position="bottom"
                          withArrow
                          arrowSize={8}
                          offset={6}
                          styles={{
                            dropdown: {
                              background: 'rgba(18, 24, 32, 0.97)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: 10,
                              padding: '12px 14px',
                              backdropFilter: 'blur(12px)',
                              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                            },
                            arrow: {
                              background: 'rgba(18, 24, 32, 0.97)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            },
                          }}
                        >
                          <Popover.Target>
                            <Box
                              onClick={() => canTap && toggleCell(cellId)}
                              style={{
                                padding: '8px 12px',
                                cursor: canTap ? 'pointer' : 'default',
                                borderRadius: 6,
                                transition: 'background 0.15s ease',
                                background: isOpen
                                  ? 'rgba(230, 194, 78, 0.06)'
                                  : 'transparent',
                              }}
                              onMouseEnter={(e) => {
                                if (canTap && !isOpen)
                                  (e.currentTarget as HTMLElement).style.background =
                                    'rgba(255, 255, 255, 0.03)';
                              }}
                              onMouseLeave={(e) => {
                                if (!isOpen)
                                  (e.currentTarget as HTMLElement).style.background =
                                    'transparent';
                              }}
                            >
                              <Text size="xs" fw={500} className="number-display">
                                {formatUnits(proj.vestedUnits)}
                              </Text>
                              {hasPriceData ? (
                                <Text
                                  size="xs"
                                  fw={500}
                                  className="number-display"
                                  style={{ color: 'var(--stocky-text-muted)' }}
                                >
                                  {proj.netSGD !== null ? formatSGD(proj.netSGD) : formatUSD(proj.netUSD)}
                                </Text>
                              ) : (
                                <Text
                                  size="xs"
                                  className="number-display"
                                  style={{ color: 'var(--stocky-text-muted)' }}
                                >
                                  —
                                </Text>
                              )}
                            </Box>
                          </Popover.Target>
                          <Popover.Dropdown>
                            <Box style={{ marginBottom: 10 }}>
                              <Text
                                size="10px"
                                fw={600}
                                tt="uppercase"
                                style={{
                                  color: 'var(--stocky-text-muted)',
                                  letterSpacing: '0.08em',
                                }}
                              >
                                {pp.plan.name} · {years[idx]}
                              </Text>
                            </Box>
                            <PopoverDetail data={proj} />
                          </Popover.Dropdown>
                        </Popover>
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              </Fragment>
            ))}

            {/* Total Row */}
            <Table.Tr style={{ background: 'rgba(230, 194, 78, 0.04)' }}>
              <Table.Td>
                <Text size="xs" fw={600} style={{ color: 'var(--stocky-gold)' }}>
                  Total
                </Text>
              </Table.Td>
              {totals.map((total, idx) => {
                const cellId = `total-${idx}`;
                const isOpen = openedCell === cellId;
                const canTap = hasPriceData;

                return (
                  <Table.Td key={idx} ta="right" style={{ padding: 0 }}>
                    <Popover
                      opened={isOpen}
                      onClose={() => setOpenedCell(null)}
                      position="bottom"
                      withArrow
                      arrowSize={8}
                      offset={6}
                      styles={{
                        dropdown: {
                          background: 'rgba(18, 24, 32, 0.97)',
                          border: '1px solid rgba(230, 194, 78, 0.2)',
                          borderRadius: 10,
                          padding: '12px 14px',
                          backdropFilter: 'blur(12px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                        },
                        arrow: {
                          background: 'rgba(18, 24, 32, 0.97)',
                          border: '1px solid rgba(230, 194, 78, 0.2)',
                        },
                      }}
                    >
                      <Popover.Target>
                        <Box
                          onClick={() => canTap && toggleCell(cellId)}
                          style={{
                            padding: '8px 12px',
                            cursor: canTap ? 'pointer' : 'default',
                            borderRadius: 6,
                            transition: 'background 0.15s ease',
                            background: isOpen
                              ? 'rgba(230, 194, 78, 0.08)'
                              : 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            if (canTap && !isOpen)
                              (e.currentTarget as HTMLElement).style.background =
                                'rgba(230, 194, 78, 0.04)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isOpen)
                              (e.currentTarget as HTMLElement).style.background =
                                'transparent';
                          }}
                        >
                          <Text size="xs" fw={600} className="number-display">
                            {formatUnits(total.vestedUnits)}
                          </Text>
                          {hasPriceData ? (
                            <Text
                              size="xs"
                              fw={600}
                              className="number-display text-gradient-gold"
                            >
                              {total.netSGD !== null
                                ? formatSGD(total.netSGD)
                                : formatUSD(total.netUSD)}
                            </Text>
                          ) : (
                            <Text
                              size="xs"
                              fw={500}
                              className="number-display"
                              style={{ color: 'var(--stocky-text-muted)' }}
                            >
                              —
                            </Text>
                          )}
                        </Box>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Box style={{ marginBottom: 10 }}>
                          <Text
                            size="10px"
                            fw={600}
                            tt="uppercase"
                            style={{
                              color: 'var(--stocky-gold)',
                              letterSpacing: '0.08em',
                            }}
                          >
                            Total · {years[idx]}
                          </Text>
                        </Box>
                        <PopoverDetail data={total} />
                      </Popover.Dropdown>
                    </Popover>
                  </Table.Td>
                );
              })}
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
