import Home from "../pages/Home/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup/Signup";
import Shop from "../pages/Shop/Shop";
import PT from "../pages/PT/PT";
import Info from "../pages/Info/Info";
import Employee from "../pages/Employee/Employee";
import Admin from "../pages/Admin/Admin";
import GymPack from "../pages/PackGym/PackGym";
import ProductInfo from "../pages/ProductInfo/ProductInfo";
import PTInfo from "../pages/PTinfo/PTinfo";
import Order from "../pages/Order/Order";
import AccountSetting from "../pages/AccountSetting/AccountSetting";
import PurchaseOrder from "../pages/PurchaseOrder/PurchaseOrder";
import RegisterPT from "../pages/RegisterPT/Register";
import CartPage from "../pages/Cart/Cart"
import PaymentSuccess from "../pages/Payment_Success/PaymentSuccess"
import PaymentError from "../pages/Payment_Error/PaymentError"
// import Dashboard from "../components/Dashboard/Dashboard";
// import MainLayout from "src/components/MainLayout";


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
    { path: '/cart', component: CartPage },
    {path: '/PaymentSuccess' , component: PaymentSuccess},
    {path: '/PaymentError' , component: PaymentError},
];

// Route private cho nhóm người dùng
const PrivateRoutes =[
    {path: '/Order' , component: Order  ,isLogin : true},
    {path: '/account-setting' , component: AccountSetting ,isLogin : true},
    {path: '/PurchaseOrder' , component: PurchaseOrder ,isLogin : true},
    {path: '/RegisterPT' , component: RegisterPT ,isLogin : true},
    // {path: '/OrderSuccess' , component: OrderSuccess ,isLogin : true},
]

// Route riêng tư cho admin
const AdminRoutes = [
    // {path: '/admin', component: MainLayout , allowedRoles: ['admin'] ,isLogin : true},
        {path: '/admin', component: Admin , allowedRoles: ['admin'] ,isLogin : true},
    
];

// Route riêng tư cho nhân viên
const EmployeeRoutes = [
    {path: '/employee', component: Employee , allowedRoles: ['employee'] ,isLogin : true},
];

export {PublicRoutes , AdminRoutes ,  EmployeeRoutes , PrivateRoutes};