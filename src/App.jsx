import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { AuthContext, getInitialAuthContext } from 'contexts/auth/AuthContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const queryClient = new QueryClient();

export default function App() {
  const [ authInfo, setAuthInfo ] = useState(getInitialAuthContext);

  return (
    <ThemeCustomization>
      <ScrollTop>
        <QueryClientProvider client={ queryClient }>
            <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
                <RouterProvider router={ router } />
            </AuthContext.Provider>
        </QueryClientProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
