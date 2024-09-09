import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Shop from "../pages/Shop";
import PT from "../pages/PT";
import Info from "../pages/Info";
import Employee from "../pages/Employee";
import Admin from "../pages/Admin";
import GymPack from "../pages/PackGym";
import ProductInfo from "../pages/ProductInfo";
import PTInfo from "../pages/PTinfo";
import Order from "../pages/Order";
import AccountSetting from "../pages/AccountSetting";
import PurchaseOrder from "../pages/PurchaseOrder";
import RegisterPT from "../pages/RegisterPT";
import Dashboard from "../components/Dashboard";
import MainLayout from "src/components/MainLayout";


// Route public cho nhóm người dùng
const PublicRoutes =[
    {path: '/', component: Home},
    {path: '/shop', component: Shop},
    {path: '/PT', component: PT},
    {path: '/login', component: Login},
    {path: '/signup', component: Signup},
    {path: '/info', component: Info},
    {path: '/GymPack', component: GymPack},
    {path: '/ProductInfo/:productID', component: ProductInfo},
    {path: '/PTInfo/:PTID', component: PTInfo},
];

// Route private cho nhóm người dùng
const PrivateRoutes =[
    {path: '/Order' , component: Order  ,isLogin : true},
    {path: '/account-setting' , component: AccountSetting ,isLogin : true},
    {path: '/PurchaseOrder' , component: PurchaseOrder ,isLogin : true},
    {path: '/RegisterPT' , component: RegisterPT ,isLogin : true},
]

// Route riêng tư cho admin
const AdminRoutes = [
    {path: '/admin', component: MainLayout , allowedRoles: ['admin'] ,isLogin : true},
    // {path: '/dashboard', component: Dashboard , allowedRoles: ['admin'] ,isLogin : true},
];

// Route riêng tư cho nhân viên
const EmployeeRoutes = [
    {path: '/employee', component: Employee , allowedRoles: ['employee'] ,isLogin : true},
];

export {PublicRoutes , AdminRoutes ,  EmployeeRoutes , PrivateRoutes};