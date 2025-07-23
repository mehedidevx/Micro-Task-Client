import React from 'react';
import useUserRole from '../../../hooks/useUserRole';

import BuyerDashboard from './BuyerDashboard';
import WorkerDashboard from './WorkerDashboard';
import AdminDashboard from './AdminDashboard';

import Loading from '../../../components/Loading/Loading';
import Forbidden from '../../../components/Forbidden/Forbidden';

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) return <Loading />;

  if (role === 'Buyer') return <BuyerDashboard />;
  if (role === 'Worker') return <WorkerDashboard />;
  if (role === 'Admin') return <AdminDashboard />;

  return <Forbidden />;
};

export default DashboardHome;
