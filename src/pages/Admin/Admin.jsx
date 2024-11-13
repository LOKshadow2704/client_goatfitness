import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faCircle, faGears,faUserGear, faMoneyBill} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
// import ManagePurchaseOrder from "../../components/ManagePurchaseOrder/ManagePurchaseOrder";
// import ManagePackGym from "../../components/ManagePackGym/ManagePackGym";
import Dashboard from "../../components/Dashboard/Dashboard";
// import ManageProduct from "../../components/ManegeProduct/ManegeProduct";
import AccountSetting from "../AccountSetting/AccountSetting";
import ManageAccount from "../../components/ManageAccount/ManageAccount";
import Announcement from "../../components/Announcement/Announcement";
import { useAnnouncement } from "../../contexts/Announcement";
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
// import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import CalendarTodayTwoToneIcon from '@mui/icons-material/CalendarTodayTwoTone';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import PermContactCalendarTwoToneIcon from '@mui/icons-material/PermContactCalendarTwoTone';
import ManageEmployee from "../../components/Manage_Employee/Manage_employee";
import ManageWorkEmployee from "../../components/Manage_Work_Employee/Manage_work_employee"
import ManageSalaryEmployee from "../../components/Manage_Salary_Employee/ManageSalaryEmployee"

function Admin(){
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const {user , logout } = useAuth();
    const [update , setUpdate] = useState(false);
    const {success , warning , error} = useAnnouncement();
    useEffect(()=>{
        setUpdate(false);
    },[success , warning , error ,update])
    return (
        <div className={style["container"]}>
            <div className={style["menu"]}>
                <div className={style.infoEmployee}>
                    <img src={user.avt} alt="none" />
                    <h4>{user.HoTen}</h4>
                    <span><FontAwesomeIcon icon={faCircle} />{user.TrangThai}</span>
                </div>
                <ul>
                    <li onClick={()=>setCurrentPage('Dashboard')}> <DashboardCustomizeRoundedIcon /> &nbsp; Dashboard</li>
                    <li onClick={()=>setCurrentPage('Lịch dạy của HLV')}><CalendarTodayTwoToneIcon/> &nbsp; Lịch dạy của HLV</li>
                    <li onClick={()=>setCurrentPage('Quản lý người dùng')} ><BadgeTwoToneIcon/> &nbsp; Quản lý người dùng</li>
                    <li onClick={()=>setCurrentPage('Quản lý nhân viên')} ><PermContactCalendarTwoToneIcon/> &nbsp; Quản lý nhân viên</li>
                    <li onClick={()=>setCurrentPage('Lương nhân viên')} ><FontAwesomeIcon icon={faMoneyBill} /> &nbsp; Lương nhân viên</li>
                    <li ><FontAwesomeIcon icon={faUserGear} /> &nbsp; Tài khoản của bạn
                        <ul className={style.dropdown}>
                            <li  onClick={()=>setCurrentPage('Tài khoản của bạn')}><FontAwesomeIcon icon={faGears} />&nbsp;Cài đặt tài khoản</li>
                            <li onClick={()=>logout()}><FontAwesomeIcon icon={faArrowRightFromBracket} />&nbsp;Đăng xuất</li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div className={style["content"]}>
                <h1>{currentPage} {error || success || warning ? <Announcement /> : null}</h1>
                {currentPage==='Dashboard' && (<Dashboard/>)}
                {currentPage==='Quản lý người dùng' && (<ManageAccount />)}
                {currentPage==='Lịch dạy của HLV' && (<ManageWorkEmployee />)}
                {currentPage==='Quản lý nhân viên' && (<ManageEmployee/>)}
                {currentPage==='Lương nhân viên' && (<ManageSalaryEmployee />)}
                {currentPage==='Tài khoản của bạn' && (<div className={style.AccountInfo}><AccountSetting changeForm={true} setRefresh={setUpdate}/></div>)}
            </div>

        </div>
    );
};

export default Admin;