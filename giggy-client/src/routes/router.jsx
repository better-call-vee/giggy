import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import HomeLayout from '../layouts/HomeLayout';
import Login from '../components/Login';
import AuthLayout from '../layouts/AuthLayout';

const router = createBrowserRouter([
    {
      path: '/',
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: 'profile', element: <PrivateRoute><Profile /></PrivateRoute> },
        { path: 'vid', element: <PrivateRoute><Wisdom /></PrivateRoute> },
        {
          path: 'plans/:planId',
          element: <PrivateRoute><ViewDetails /></PrivateRoute>,
          loader: async ({ params }) => {
            const res = await fetch('/plans.json');
            if (!res.ok) throw new Response('Failed to load', { status: 500 });
            const plans = await res.json();
            const plan = plans.find(p => String(p.id) === params.planId);
            if (!plan) throw new Response('Not Found', { status: 404 });
            return plan;
          },
        },
        { path: 'subs', element: <Subscriptions /> },
        { path: 'review/:planId', element: <Reviews /> },
      ],
    },
    {
      path: '/auth',
      element: <AuthLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'forgot', element: <ForgotPass /> },
      ],
    },
    { path: '*', element: <ErrorPage /> },
  ]);
  
  export default router;