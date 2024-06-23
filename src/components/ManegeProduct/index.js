import React, { useEffect, useState } from "react";
import style from './style.module.css';
import { faPenToSquare, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateProductModal from "../../components/UpdateProductModal";
import AddProductModal from "../../components/AddProductModal";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function ManageProduct({ data }) {
    const [product, setProduct] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState(''); // Lưu kiểu sắp xếp hiện tại
    const [showUpdateProduct , setShowUpdateProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rerender, setRerender] = useState(false);
    const [addproductModal , setAddproductModal] = useState(false);
    const { setSuccess, setError, setMessage } = useAnnouncement();

    useEffect(() => {
        fetch('http://localhost:88/Backend/shop/manege/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể truy cập');
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
            })
            .catch(error => {
                console.log('Lỗi khi lấy dữ liệu:', error);
            });
    }, [showUpdateProduct , rerender , addproductModal ]);

    // Hàm xử lý sắp xếp dựa trên kiểu sắp xếp hiện tại
    const sortData = () => {
        let sortedProducts = [...product];
        if (sortBy === 'name') {
            sortedProducts.sort((a, b) => a.TenSP.localeCompare(b.TenSP));
        } else if (sortBy === 'name_desc') {
            sortedProducts.sort((a, b) => b.TenSP.localeCompare(a.TenSP));
        } else if (sortBy === 'price') {
            sortedProducts.sort((a, b) => a.DonGia - b.DonGia);
        } else if (sortBy === 'price_desc') {
            sortedProducts.sort((a, b) => b.DonGia - a.DonGia);
        }
        return sortedProducts;
    };

    // Hàm xử lý thay đổi kiểu sắp xếp
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };
    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowUpdateProduct(true);

    };

    const handleDelete = (id) => {
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
            axios.post('http://localhost:88/Backend/product/delete',  {IDSanPham:id}, { headers: headers 
            }).then(response => {
                if(response.status >= 200 && response.status < 300){
                    setSuccess(true);
                    setMessage("Xóa thành công");
                    setRerender(!rerender);
                }else{
                    throw new Error("Xóa thất bại");
                }
            }).catch(error => {
                setError(true);
                setMessage(error.response.data.error);
            });
    };
    };

    return (
        <div className={style.wrap}>
            <div className={style.header}>
                {/* Input tìm kiếm */}
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Select sắp xếp */}
                <select value={sortBy} onChange={handleSortChange}>
                    <option value="">Sắp xếp theo...</option>
                    <option value="name">Tên từ A-Z</option>
                    <option value="name_desc">Tên từ Z-A</option>
                    <option value="price">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                </select>
                <button onClick={() => setAddproductModal(true)}>Thêm sản phẩm mới <FontAwesomeIcon icon={faPlus} /></button>
            </div>

            {
                showUpdateProduct && <UpdateProductModal data={selectedProduct} setShowModal={setShowUpdateProduct}/>
            }
            {
                addproductModal && <AddProductModal setShowModal={setAddproductModal}/>
            }
            
            <table className={style['manage_product']}>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Loại sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng tồn kho</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {sortData()
                        .filter((item) => item.TenSP.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((value) => (
                            <tr key={value.IDSanPham}>
                                <td><p>{value.TenSP}</p><img src={value.IMG} alt={value.TenSP} width='100%' /></td>
                                <td>{value.TenLoaiSanPham}</td>
                                <td>{value.DonGia}</td>
                                <td>{value.SoLuong}</td>
                                <td>
                                    <button onClick={() => handleEdit(value)}><FontAwesomeIcon icon={faPenToSquare} />Chỉnh sửa</button>
                                    <button onClick={() => handleDelete(value.IDSanPham)}> <FontAwesomeIcon icon={faTrashCan} />Xóa</button></td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageProduct;
