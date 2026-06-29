import { Outlet } from '@tanstack/react-router';
import { Layout } from './components/Layout';
import './app.css';
import './styles/global.css';

export function App() {
  return (
    <div className="dark text-foreground">
      <Layout>
        <Outlet />
      </Layout>
    </div>
  );
}
