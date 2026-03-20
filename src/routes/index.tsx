import { createRootRoute, createRoute, createRouter, useParams } from '@tanstack/react-router';
import { App } from '../App';
import { HomePage } from '../pages/HomePage';
import { PlansPage } from '../pages/PlansPage';
import { TaxCalculatorPage } from '../pages/TaxCalculatorPage';
import { AddPlanPage } from '../pages/AddPlanPage';
import { EditPlanPage } from '../pages/EditPlanPage';

function EditPlanPageWrapper() {
  const { planId } = useParams({ from: '/plan/$planId/edit' });
  return <EditPlanPage planId={planId} />;
}

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plans',
  component: PlansPage,
});

const taxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tax',
  component: TaxCalculatorPage,
});

const addPlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plan/new',
  component: AddPlanPage,
});

const editPlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plan/$planId/edit',
  component: EditPlanPageWrapper,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  plansRoute,
  taxRoute,
  addPlanRoute,
  editPlanRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
