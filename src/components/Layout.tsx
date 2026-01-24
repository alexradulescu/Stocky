import { AppShell, Container, Box, Text, UnstyledButton, Group } from '@mantine/core';
import { IconHome, IconCalculator, IconReceipt2 } from '@tabler/icons-react';
import { useLocation, Link } from '@tanstack/react-router';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', icon: IconHome, label: 'Portfolio' },
  { path: '/calculator', icon: IconCalculator, label: 'Calculator' },
  { path: '/tax', icon: IconReceipt2, label: 'Tax' },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <AppShell
      footer={{ height: 'calc(52px + var(--safe-area-inset-bottom))' }}
      layout="default"
      styles={{
        main: {
          backgroundColor: 'transparent',
          minHeight: '100vh',
          paddingTop: 'var(--safe-area-inset-top)',
          paddingBottom: 'calc(52px + var(--mantine-spacing-sm) + var(--safe-area-inset-bottom))',
        },
      }}
    >
      <AppShell.Main>
        <Container size="md" py="sm" style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </Container>
      </AppShell.Main>

      <AppShell.Footer
        style={{
          backgroundColor: 'rgba(15, 20, 25, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 12px',
          paddingBottom: 'var(--safe-area-inset-bottom)',
          height: 'calc(52px + var(--safe-area-inset-bottom))',
        }}
      >
        <Group gap={0} style={{ maxWidth: 320, width: '100%' }}>
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <UnstyledButton
                key={path}
                component={Link}
                to={path}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 4px',
                  borderRadius: 8,
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  backgroundColor: active ? 'rgba(230, 194, 78, 0.06)' : 'transparent',
                }}
              >
                {/* Active indicator - iOS 26 style pill */}
                {active && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 2,
                      background: 'var(--stocky-gold)',
                      borderRadius: 1,
                      opacity: 0.8,
                    }}
                  />
                )}
                <Icon
                  size={20}
                  stroke={1.5}
                  style={{
                    color: active ? 'var(--stocky-gold)' : 'var(--stocky-text-muted)',
                    transition: 'color 0.15s ease',
                  }}
                />
                <Text
                  size="10px"
                  mt={2}
                  fw={active ? 600 : 500}
                  style={{
                    color: active ? 'var(--stocky-gold)' : 'var(--stocky-text-muted)',
                    letterSpacing: '0.01em',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {label}
                </Text>
              </UnstyledButton>
            );
          })}
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
