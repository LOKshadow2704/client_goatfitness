import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faCircle, faClipboard, faDumbbell, faFolderOpen, faGears, faList, faPeopleRoof, faUserGear,faAddressCard, faMoneyBill} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import ManagePurchaseOrder from "../../components/ManagePurchaseOrder/ManagePurchaseOrder";
import ManagePackGym from "../../components/ManagePackGym/ManagePackGym";
import Dashboard from "../../components/Dashboard/Dashboard";
import ManageProduct from "../../components/ManegeProduct/ManegeProduct";
import AccountSetting from "../AccountSetting/AccountSetting";
import ManageAccount from "../../components/ManageAccount/ManageAccount";
import Announcement from "../../components/Announcement/Announcement";
import { useAnnouncement } from "../../contexts/Announcement";
import ManaPackGymCustomer from "../../components/PackGymCustomer/ManaPackGymCustomer"
import ManageCategoryProduct from "../../components/ManageCategoryProduct/Manage_category_product";
import ManageEmployee from "../../components/Manage_Employee/Manage_employee";
import ManageWorkEmployee from "../../components/Manage_Work_Employee/Manage_work_employee"

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
                    {/* <li onClick={()=>setCurrentPage('Dashboard')}> <FontAwesomeIcon icon={faDumbbell} /> &nbsp; Dashboard</li> */}
                    <li onClick={()=>setCurrentPage('Quản lý sản phẩm')}><FontAwesomeIcon icon={faList} />  &nbsp; Quản lý sản phẩm</li>
                    <li onClick={()=>setCurrentPage('Quản lý danh mục sản phẩm')}><FontAwesomeIcon icon={faList} />  &nbsp; Quản lý loại sản phẩm</li>
                    <li onClick={()=>setCurrentPage('Quản lý gói tập')}><FontAwesomeIcon icon={faFolderOpen}  /> &nbsp; Quản lý gói tập</li>
                    <li onClick={()=>setCurrentPage('Gói tập của khách hàng')}><FontAwesomeIcon icon={faAddressCard}  /> &nbsp; Gói tập của khách hàng</li>
                    <li onClick={()=>setCurrentPage('Lịch dạy của HLV')}><FontAwesomeIcon icon={faAddressCard}  /> &nbsp; Lịch dạy của HLV</li>
                    <li onClick={()=>setCurrentPage('Đơn hàng')} ><FontAwesomeIcon icon={faClipboard} /> &nbsp; Đơn hàng</li>
                    <li onClick={()=>setCurrentPage('Quản lý tài khoản')} ><FontAwesomeIcon icon={faPeopleRoof} /> &nbsp; Quản lý tài khoản</li>
                    <li onClick={()=>setCurrentPage('Quản lý nhân viên')} ><FontAwesomeIcon icon={faPeopleRoof} /> &nbsp; Quản lý nhân viên</li>
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
                {/* {currentPage==='Dashboard' && (<Dashboard/>)} */}
                {currentPage==='Quản lý sản phẩm' && (<ManageProduct/>)}
                {currentPage==='Quản lý danh mục sản phẩm' && (<ManageCategoryProduct/>)}
                {currentPage==='Quản lý gói tập' && (<ManagePackGym />)}
                {currentPage==='Đơn hàng' && (<ManagePurchaseOrder/>)}
                {currentPage==='Quản lý tài khoản' && (<ManageAccount />)}
                {currentPage==='Gói tập của khách hàng' && (<ManaPackGymCustomer />)}
                {currentPage==='Lịch dạy của HLV' && (<ManageWorkEmployee />)}
                {currentPage==='Quản lý nhân viên' && (<ManageEmployee/>)}
                {currentPage==='Lương nhân viên' && (<ManageAccount />)}
                {currentPage==='Tài khoản của bạn' && (<div className={style.AccountInfo}><AccountSetting changeForm={true} setRefresh={setUpdate}/></div>)}
            </div>

        </div>
    );
};

export default Admin;