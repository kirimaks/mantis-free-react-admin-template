import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { AuthContext, getInitialAuthContext } from 'contexts/auth/AuthContext';

import { AUTH_INFO_KEY } from 'config';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const queryClient = new QueryClient();

export default function App() {
  const [ isAuthenticated, setIsAuthenticated] = useState(getInitialAuthContext);

  return (
    <ThemeCustomization>
      <ScrollTop>
        <QueryClientProvider client={ queryClient }>
            <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
                <RouterProvider router={ router } />
            </AuthContext.Provider>
        </QueryClientProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
