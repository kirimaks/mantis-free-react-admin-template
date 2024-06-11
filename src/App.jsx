import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { AuthContext } from 'contexts/auth/AuthContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const queryClient = new QueryClient();

export default function App() {
  const [ isAuthenticated, setIsAuthenticated] = useState(false);

  // TODO:
  useEffect(() => {
    let authInfo = localStorage.getItem('authInfo');
    console.log(`Auth info: ${authInfo}`);

    if (authInfo) {
        authInfo = JSON.parse(authInfo);
        const { authKey, authEnds } = authInfo;

        console.log(`AuthKey: ${authKey}`);
        console.log(`AuthEnds: ${authEnds}`);

        if (authKey && authKey.length) {
            if (authEnds && authEnds < Date.now()) {
                setIsAuthenticated(true);

            } else {
                setIsAuthenticated(false);
            }
        }
    }

  }, []);
  // TODO:

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
