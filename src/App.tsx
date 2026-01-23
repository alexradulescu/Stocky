import { MantineProvider } from '@mantine/core';
import { Outlet } from '@tanstack/react-router';
import { theme } from './theme';
import { Layout } from './components/Layout';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './styles/global.css';

export function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Layout>
        <Outlet />
      </Layout>
    </MantineProvider>
  );
}
