import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@/App.css'
import Dashboard from '@/pages/Dashboard'
import { ThemeProvider } from '@/context/theme/ThemeProvider';
import PortfolioProvider from '@/context/portfolio/PortfolioProvider';
import { Route, Routes } from 'react-router';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-gray-400 min-h-screen">
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <PortfolioProvider>
                <Routes>
                  <Route index element={<Dashboard/>}/>
                  <Route path="*" element={<NotFound/>}/>
                </Routes>
              </PortfolioProvider>
            </ThemeProvider>
        </QueryClientProvider>
      </div>
    </>
  )
}

export default App;
