import { AppShell, Container } from '@mantine/core';
import { IconHome, IconCalculator } from '@tabler/icons-react';
import { useLocation, Link } from '@tanstack/react-router';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  const navItems = [
    { path: '/', icon: IconHome, label: 'Home' },
    { path: '/calculator', icon: IconCalculator, label: 'Calculator' },
  ];

  return (
    <AppShell
      footer={{ height: 60 }}
      layout="default"
    >
      <AppShell.Main>
        <Container py="xl" pb="100px">
          {children}
        </Container>
      </AppShell.Main>

      <AppShell.Footer
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: '1px solid #e0e0e0',
          backgroundColor: '#fff'
        }}
      >
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderTop: isActive(path) ? '3px solid #228be6' : 'none',
              color: isActive(path) ? '#228be6' : '#666',
              textDecoration: 'none'
            }}
          >
            <Icon size={24} />
            <span style={{ fontSize: '12px', marginTop: '4px' }}>{label}</span>
          </Link>
        ))}
      </AppShell.Footer>
    </AppShell>
  );
}
