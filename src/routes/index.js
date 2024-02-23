import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import GuestGuard from '../guards/GuestGuard';
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/books/list')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Main Routes
    {
      path: '*',
      element: (
        <GuestGuard>
          <LogoOnlyLayout />
        </GuestGuard>
      ),
      // eslint-disable-next-line
      children: [, { path: '404', element: <Page404 /> }, { path: '*', element: <Navigate to='/404' replace /> }],
    },

    // Books Routes
    {
      path: '/',
      element: (
        <GuestGuard>
          <DashboardLayout />
        </GuestGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'books',
          children: [
            { element: <Navigate to='/books/list' replace />, index: true },
            { path: 'list', element: <Books /> },
            { element: <Navigate to='books/:title/:id' replace />, index: true },
            { path: ':title/:id', element: <Book isView /> },
          ],
        },
        { path: 'permission-denied', element: <PermissionDenied /> },
      ],
    },

    // Athors Routes
    {
      path: '/',
      element: (
        <GuestGuard>
          <DashboardLayout />
        </GuestGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'authors',
          children: [
            { element: <Navigate to='/authors/list' replace />, index: true },
            { path: ':list', element: <Authors /> },
            { element: <Navigate to='authors/:name/:authorId' replace />, index: true },
            { path: ':name/:authorId', element: <Author /> },
          ],
        },
        { path: 'permission-denied', element: <PermissionDenied /> },
      ],
    },

    { path: '*', element: <Navigate to='/404' replace /> },
  ]);
}

// Books
const Books = Loadable(lazy(() => import('../pages/Books')));
const Book = Loadable(lazy(() => import('../pages/Book')));
// const CreateBook = Loadable(lazy(() => import('../pages/BookCreate')));

// Authors
const Authors = Loadable(lazy(() => import('../pages/Authors')));
const Author = Loadable(lazy(() => import('../pages/Author')));

// TEST RENDER PAGE BY ROLE
const PermissionDenied = Loadable(lazy(() => import('../pages/PermissionDenied')));

const Page404 = Loadable(lazy(() => import('../pages/Page404')));
