import { MantineProvider } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { theme } from './theme';
import { Layout } from './components/Layout';
import '@mantine/core/styles.css';

export function App() {
  return (
    <MantineProvider theme={theme}>
      <Layout>
        <Outlet />
      </Layout>
    </MantineProvider>
  );
}
