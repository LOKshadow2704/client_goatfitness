import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Shop from "../pages/Shop";
import PT from "../pages/PT";
import Info from "../pages/Info";
import Employee from "../pages/Employee";
import GymPack from "../pages/PackGym";
import ProductInfo from "../pages/ProductInfo";
import PTInfo from "../pages/PTinfo";
import Order from "../pages/Order";
import AccountSetting from "../pages/AccountSetting";
import PurchaseOrder from "../pages/PurchaseOrder";
import RegisterPT from "../pages/RegisterPT";
import Dashboard from "../components/Dashboard";
import MainLayout from "../components/MainLayout";

// Route public cho nhóm người dùng
const PublicRoutes = [
    { path: '/', element: <Home /> },
    { path: '/shop', element: <Shop /> },
    { path: '/PT', element: <PT /> },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/info', element: <Info /> },
    { path: '/GymPack', element: <GymPack /> },
    { path: '/ProductInfo/:productID', element: <ProductInfo /> },
    { path: '/PTInfo/:PTID', element: <PTInfo /> },
];

// Route private cho nhóm người dùng
const PrivateRoutes = [
    { path: '/Order', element: <Order />, isLogin: true },
    { path: '/account-setting', element: <AccountSetting />, isLogin: true },
    { path: '/PurchaseOrder', element: <PurchaseOrder />, isLogin: true },
    { path: '/RegisterPT', element: <RegisterPT />, isLogin: true },
];

// Route riêng tư cho admin
const AdminRoutes = [
    {
        path: '/admin',
        element: <MainLayout />, // sửa thành JSX
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />, // sửa thành JSX
                isLogin: true,
                allowedRoles: ['admin']
            },
            // Các routes khác cho admin
        ]
    }
];

// Route riêng tư cho nhân viên
const EmployeeRoutes = [
    { path: '/employee', element: <Employee />, allowedRoles: ['employee'], isLogin: true },
];

export { PublicRoutes, AdminRoutes, EmployeeRoutes, PrivateRoutes };
