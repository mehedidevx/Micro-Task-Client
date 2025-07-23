import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Register from "../pages/Authentication/Register/Register";
import Login from "../pages/Authentication/Login/Login";
import DashboardLayout from "../layouts/DashboardLayout";

import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import AddTask from "../pages/Dashboard/BuyerPage/AddTask/AddTask";
import MyTasks from "../pages/Dashboard/BuyerPage/MyTask/MyTasks";
import PurchaseCard from "../pages/Dashboard/BuyerPage/PurchaseCoins/PurchaseCard";
import PaymentHistory from "../pages/Dashboard/BuyerPage/PaymentHistory/PaymentHistory";
import TaskList from "../pages/Dashboard/WorkerPage/TaskList/TaskList";
import TaskDetails from "../pages/Dashboard/WorkerPage/TaskDetails/TaskDetails";
import MySubmission from "../pages/Dashboard/WorkerPage/MySubmission/MySubmission";
import Withdrawals from "../pages/Dashboard/WorkerPage/WithDrawals/WithDrawals";
import ManageUsers from "../pages/Dashboard/AdminPage/ManageUsers/ManageUsers";
import ManageTasks from "../pages/Dashboard/AdminPage/ManageTasks/ManageTasks";
import BrowseTask from "../components/BrowseTasks/BrowseTask";
import About from "../components/About/About";
import MyProfileName from "../components/MyProfile/MyProfile";
import Forbidden from "../components/Forbidden/Forbidden";
import AdminDashboard from "../pages/Dashboard/DashboardHome/AdminDashboard";
import AdminRoute from "../routes/AdminRoute";
import BuyerRoute from "../routes/BuyerRoute";
import WorkerRoute from "../routes/WorkerRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <Forbidden></Forbidden>,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "tasks",
        Component: BrowseTask,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "profile",
        Component: MyProfileName,
      },
    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    errorElement: <Forbidden></Forbidden>,
    children: [
      {
        index: true,
        element: <DashboardHome></DashboardHome>,
      },
      {
        path: "addTask",
        element: <BuyerRoute><AddTask></AddTask></BuyerRoute>,
      },
      {
        path: "myTasks",
       element: <BuyerRoute><MyTasks></MyTasks></BuyerRoute>,
      },
      {
        path: "purchaseCoin",
        element: <BuyerRoute><PurchaseCard></PurchaseCard></BuyerRoute>,
      },
      {
        path: "paymentHistory",
        element: <BuyerRoute><PaymentHistory></PaymentHistory></BuyerRoute>,
      },
      // Worker Route
      {
        path: "taskList",
        element: <WorkerRoute><TaskList></TaskList></WorkerRoute>,
      },
      {
        path: "task-details/:id",
        element: <WorkerRoute><TaskDetails></TaskDetails></WorkerRoute>,
      },
      {
        path: "mySubmissions",
        element: <WorkerRoute><MySubmission></MySubmission></WorkerRoute>,
      },
      {
        path: "withdrawals",
        element: <WorkerRoute><Withdrawals></Withdrawals></WorkerRoute>,
      },
      // Admin
      {
        path: "manageUsers",
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>,
      },
      {
        path: "manageTasks",
        element: <AdminRoute><ManageTasks></ManageTasks></AdminRoute>,
      },
      {
        path: "myProfile",
        Component: MyProfileName,
      },
    ],
  },
]);
