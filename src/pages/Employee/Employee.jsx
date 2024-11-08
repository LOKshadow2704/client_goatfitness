import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faCircle, faClipboard, faDumbbell, faFolderOpen, faGears, faList, faUserGear, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/AuthContext";
import ManagePurchaseOrder from "../../components/ManagePurchaseOrder/ManagePurchaseOrder";
import ManagePackGym from "../../components/ManagePackGym/ManagePackGym";
import ManaPackGymCustomer from "../../components/PackGymCustomer/ManaPackGymCustomer"
import Dashboard from "../../components/Dashboard/Dashboard";
import ManageProduct from "../../components/ManegeProduct/ManegeProduct";
import AccountSetting from "../AccountSetting/AccountSetting";
import { useAnnouncement } from "../../contexts/Announcement";
import Announcement from "../../components/Announcement/Announcement";
function Employee(){
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const {user , logout , fetchUserInfo} = useAuth();
    const [update , setUpdate] = useState(false);
    const {success , warning , error} = useAnnouncement();
    useEffect(()=>{
        fetchUserInfo();
        setUpdate(false);
    },[success , warning , error ,update,fetchUserInfo])
    return (
        <div className={style["container"]}>
            <div className={style["menu"]}>
                <div className={style.infoEmployee}>
                    <img src={user.avt} alt="none" />
                    <h4>{user.HoTen}</h4>
                    <span><FontAwesomeIcon icon={faCircle} />{user.TrangThai}</span>
                </div>
                <ul>
                    <li onClick={()=>setCurrentPage('Dashboard')}> <FontAwesomeIcon icon={faDumbbell} /> &nbsp; Dashboard</li>
                    <li onClick={()=>setCurrentPage('Quản lý sản phẩm')}><FontAwesomeIcon icon={faList} />  &nbsp; Quản lý sản phẩm</li>
                    <li onClick={()=>setCurrentPage('Quản lý gói tập')}><FontAwesomeIcon icon={faFolderOpen}  /> &nbsp; Quản lý gói tập</li>
                    <li onClick={()=>setCurrentPage('Gói tập của khách hàng')}><FontAwesomeIcon icon={faAddressCard}  /> &nbsp; Gói tập của khách hàng</li>
                    <li onClick={()=>setCurrentPage('Đơn hàng')} ><FontAwesomeIcon icon={faClipboard} /> &nbsp; Đơn hàng</li>
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
                {currentPage==='Quản lý sản phẩm' && (<ManageProduct/>)}
                {currentPage==='Quản lý gói tập' && (<ManagePackGym />)}
                {currentPage==='Gói tập của khách hàng' && (<ManaPackGymCustomer/>)}
                {currentPage==='Đơn hàng' && (<ManagePurchaseOrder/>)}
                {currentPage==='Tài khoản của bạn' && (<div className={style.AccountInfo}><AccountSetting changeForm={true}/></div>)}
            </div>

        </div>
    );
};

export default Employee;