import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { CreatorDashboard } from '@/pages/CreatorDashboard';
import { CreatorEditor } from '@/pages/CreatorEditor';
import { SubscriberView } from '@/pages/SubscriberView';
import { TokensStore } from '@/pages/TokensStore';
import { DemoPage } from '@/pages/DemoPage';
import { CreatorAnalytics } from '@/pages/CreatorAnalytics';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/creator/:creatorId",
    element: <SubscriberView />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <CreatorDashboard />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/editor/:contentId",
    element: <CreatorEditor />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/editor",
    element: <CreatorEditor />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/tokens",
    element: <TokensStore />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/analytics",
    element: <CreatorAnalytics />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/demo",
    element: <DemoPage />,
    errorElement: <RouteErrorBoundary />,
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)