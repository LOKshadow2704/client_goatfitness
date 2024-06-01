import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import CreateUserModal from "../CreateUserModal";
import UpdateRoleModal from "../UpdateRoleModal";

function ManageAccount({ data }) {
    const [accounts, setAccount] = useState([]);
    const [modalAdd , setModalAdd] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [modalUpdate , setModalUpdte] = useState(false);
    const [selectUser , setSelectedUser] = useState(null);
    useEffect(() => {
        const findCookie = (name) => {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
              }
            }
            return null;
        };
        const isLogin = findCookie("jwt");
        if(isLogin){
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            axios.post('http://localhost:88/Backend/admin/getAllAccount',null ,{headers:headers})
            .then(response => {
                if(response.status >= 200 && response.status < 300){
                    setAccount(response.data);
                    console.log(response.data);
                }else{
                    throw new Error("Lấy thông tin thất bại");
                }
            }).catch(error => {
                alert(error.response.data.error);
            });
    };
    }, [modalUpdate ,modalAdd]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const filteredAccounts = accounts.filter(account =>
        account.TenDangNhap.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "name") {
        filteredAccounts.sort((a, b) => a.TenDangNhap.localeCompare(b.TenDangNhap));
    } else if (sortBy === "name_desc") {
        filteredAccounts.sort((a, b) => b.TenDangNhap.localeCompare(a.TenDangNhap));
    }

    const handleClickUpdate = (user) =>{
        setSelectedUser(user);
        setModalUpdte(true);
    }
    return (
        <div className={style.wrap}>
            {
                modalAdd && <CreateUserModal setShowModal={setModalAdd} />
            }
            {
                modalUpdate && <UpdateRoleModal setShowModal={setModalUpdte}  data = {selectUser}/>
            }
            <div className={style.header}>
                {/* Input tìm kiếm */}
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                {/* Select sắp xếp */}
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="">Sắp xếp theo...</option>
                    <option value="name">Tên từ A-Z</option>
                    <option value="name_desc">Tên từ Z-A</option>
                </select>
                <button onClick={()=>setModalAdd(true)}>Tạo tài khoản <FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <table className={style['manage_product']}>
                <thead>
                    <tr>
                        <th>Tên đăng nhập</th>
                        <th>Loại tài khoản</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAccounts && filteredAccounts.map((value) => (
                            <tr key={value.IDSanPham}>
                                <td><p>{value.TenDangNhap}</p></td>
                                <td>{value.TenVaiTro}</td>
                                <td>
                                    <button onClick={()=>handleClickUpdate(value)}><FontAwesomeIcon icon={faPenToSquare} />Chỉnh sửa</button></td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageAccount;
