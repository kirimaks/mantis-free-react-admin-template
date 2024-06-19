import { createBrowserRouter } from 'react-router-dom';

// project import
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import ProfileRoutes from './ProfileRoutes';
import TagsRoutes from './TagsRoutes';
import TransactionsRoutes from './TransactionsRoutes';

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
    [MainRoutes, LoginRoutes, ProfileRoutes, TagsRoutes, TransactionsRoutes], 
    { 
        basename: import.meta.env.VITE_APP_BASE_NAME 
    }
);

export default router;
