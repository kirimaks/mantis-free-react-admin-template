import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


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
            <ReactQueryDevtools initialOpen={ false } />
        </QueryClientProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
}
