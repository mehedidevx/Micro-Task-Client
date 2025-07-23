import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { router } from './router/router.jsx';
import { RouterProvider } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext/AuthProvider.jsx';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <RouterProvider router={router} />
        <Toaster position="top-center"/>
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
