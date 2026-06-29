import { IconHome, IconListDetails, IconReceipt2 } from '@tabler/icons-react';
import { useLocation, Link } from '@tanstack/react-router';
import { Container } from './ui';

const navItems = [
  { path: '/', icon: IconHome, label: 'Overview' },
  { path: '/plans', icon: IconListDetails, label: 'Plans' },
  { path: '/tax', icon: IconReceipt2, label: 'Tax' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <div className="min-h-screen">
      <main
        className="pb-[calc(52px+8px+var(--safe-area-inset-bottom))]"
        style={{ paddingTop: 'var(--safe-area-inset-top)' }}
      >
        <Container size="md" className="relative z-[1] py-2">
          {children}
        </Container>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 flex items-start justify-center px-4 pb-[calc(2px+var(--safe-area-inset-bottom))]"
        style={{ height: 'calc(52px + 4px + var(--safe-area-inset-bottom))' }}
      >
        <div className="flex gap-0 bg-[rgba(15,20,25,0.5)] backdrop-blur-[5px] border border-[rgba(255,255,255,0.08)] rounded-2xl p-[2px] max-w-[320px] w-full">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-[14px] relative transition-all duration-150 no-underline ${
                  active ? 'bg-[rgba(230,194,78,0.06)]' : ''
                }`}
              >
                {active && (
                  <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[var(--stocky-gold)] rounded-[1px] opacity-80" />
                )}
                <Icon
                  size={20}
                  stroke={1.5}
                  className={`transition-colors duration-150 ${
                    active ? 'text-[var(--stocky-gold)]' : 'text-[var(--stocky-text-muted)]'
                  }`}
                />
                <span
                  className={`text-[10px] mt-[2px] tracking-[0.01em] transition-colors duration-150 ${
                    active ? 'font-semibold text-[var(--stocky-gold)]' : 'font-medium text-[var(--stocky-text-muted)]'
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
