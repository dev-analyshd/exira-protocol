import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect } from 'react';

import { Shell } from './components/layout/Shell';

// Pages
import Dashboard from './pages/dashboard';
import Finance from './pages/finance';
import Verify from './pages/verify';
import Bridge from './pages/bridge';
import Agents from './pages/agents';
import Learn from './pages/learn';
import Guard from './pages/guard';
import Sense from './pages/sense';
import NotFound from './pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/finance" component={Finance} />
        <Route path="/verify" component={Verify} />
        <Route path="/bridge" component={Bridge} />
        <Route path="/agents" component={Agents} />
        <Route path="/learn" component={Learn} />
        <Route path="/guard" component={Guard} />
        <Route path="/sense" component={Sense} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
