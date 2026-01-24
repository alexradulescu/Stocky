import { AppShell, Container, Box, Text, UnstyledButton, Group } from '@mantine/core';
import { IconHome, IconCalculator } from '@tabler/icons-react';
import { useLocation, Link } from '@tanstack/react-router';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', icon: IconHome, label: 'Portfolio' },
  { path: '/calculator', icon: IconCalculator, label: 'Calculator' },
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
      footer={{ height: 70 }}
      layout="default"
      styles={{
        main: {
          backgroundColor: 'transparent',
          minHeight: '100vh',
          paddingBottom: 'calc(70px + var(--mantine-spacing-md))',
        },
      }}
    >
      <AppShell.Main>
        <Container size="md" py="lg" style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </Container>
      </AppShell.Main>

      <AppShell.Footer
        style={{
          backgroundColor: 'rgba(15, 20, 25, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
        }}
      >
        <Group gap={0} style={{ maxWidth: 400, width: '100%' }}>
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
                  padding: '12px 8px',
                  borderRadius: 12,
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  backgroundColor: active ? 'rgba(230, 194, 78, 0.08)' : 'transparent',
                }}
              >
                {/* Active indicator glow */}
                {active && (
                  <Box
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 24,
                      height: 2,
                      background: 'linear-gradient(90deg, transparent, var(--stocky-gold), transparent)',
                      borderRadius: 1,
                    }}
                  />
                )}
                <Icon
                  size={22}
                  stroke={1.75}
                  style={{
                    color: active ? 'var(--stocky-gold)' : 'var(--stocky-text-muted)',
                    transition: 'color 0.2s ease',
                  }}
                />
                <Text
                  size="xs"
                  mt={4}
                  fw={active ? 600 : 500}
                  style={{
                    color: active ? 'var(--stocky-gold)' : 'var(--stocky-text-muted)',
                    letterSpacing: '0.02em',
                    transition: 'color 0.2s ease',
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
