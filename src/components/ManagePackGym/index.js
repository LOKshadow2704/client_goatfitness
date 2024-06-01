import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { faPenToSquare, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import RegisterPackModal from "../RegisterPackModal";
import UpdateGymPackModal from "../UpdateGymPackModal";

function ManagePackGym() {
    const [gympack, setGymPack] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortType, setSortType] = useState("");
    const [showModal , setShowModal] = useState(false);
    const [update ,setUpdate] = useState(false);
    const [selectedPack, setSelectedPack] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:88/Backend/gympack/')
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    setGymPack(response.data);
                } else {
                    throw new Error("Lấy thông tin thất bại");
                }
            })
            .catch(error => {
                alert(error.response.data.error);
            });
    }, [update]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (e) => {
        setSortType(e.target.value);
    };

    
    const handleEdit = (pack) => {
        setSelectedPack(pack);
        setUpdate(true);

    };

    const sortedGymPack = gympack
        .filter(pack => pack.TenGoiTap.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortType === "priceAsc") {
                return a.Gia - b.Gia;
            } else if (sortType === "priceDesc") {
                return b.Gia - a.Gia;
            } else if (sortType === "durationAsc") {
                return a.ThoiHan - b.ThoiHan;
            } else if (sortType === "durationDesc") {
                return b.ThoiHan - a.ThoiHan;
            }
            return 0;
        });

    return (
        <div className={style.wrap}>
            {
                showModal && <RegisterPackModal data={gympack} setShowModal={setShowModal}/>
            }
            {
                update && <UpdateGymPackModal data={selectedPack} setShowModal={setUpdate}/>
            }
            <div className={style.header}>
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <select value={sortType} onChange={handleSort}>
                    <option value="">Sắp xếp</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                    <option value="durationAsc">Thời hạn tăng dần</option>
                    <option value="durationDesc">Thời hạn giảm dần</option>
                </select>
                <button onClick={()=>setShowModal(true)}>Đăng ký mới <FontAwesomeIcon icon={faPlus} /></button>
            </div>
            <table className={style['manage_product']}>
                <thead>
                    <tr>
                        <th>ID Gói Tập</th>
                        <th>Tên gói tập</th>
                        <th>Thời hạn</th>
                        <th>Giá</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sortedGymPack.map((value) => (
                            <tr key={value.IDGoiTap}>
                                <td>{value.IDGoiTap}</td>
                                <td>{value.TenGoiTap}</td>
                                <td>{value.ThoiHan}</td>
                                <td>{value.Gia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                                <td>
                                    <button onClick={()=>handleEdit(value)}><FontAwesomeIcon icon={faPenToSquare} />Chỉnh sửa</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default ManagePackGym;
