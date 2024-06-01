import React, { useEffect, useState } from "react";
import style from "./style.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Loading from "../Loading";

function AddProductModal({ setShowModal }) {
    const [soLuong, setSoLuong] = useState("");
    const [formData, setFormData] = useState({
        IDLoaiSanPham: "",
        TenSP: "",
        Mota: "",
        DonGia: "",
        IMG: "",
    });
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:88/Backend/product/get_All_Category')
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    setCategory(response.data);
                } else {
                    throw new Error("Lấy thông tin thất bại");
                }
            }).catch(error => {
                alert(error.response.data.error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "SoLuong") {
            setSoLuong(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

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

    const uploadImage = (file) => {
        return new Promise((resolve, reject) => {
            // Kiểm tra hợp lệ
            const isImageValid = (file) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        resolve(true);
                    };
                    img.onerror = () => {
                        reject(false);
                    };
                    img.src = URL.createObjectURL(file);
                });
            };

            const formData = new FormData();
            formData.append('image', file);

            const validExtensions = ['jpg', 'jpeg', 'png'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!validExtensions.includes(fileExtension)) {
                alert('File được chấp nhận JPG, JPEG, PNG.');
                reject('Invalid file extension');
                return;
            }

            // Kiểm tra kích thước tệp
            const maxFileSize = 10 * 1024 * 1024; // 10 MB
            if (file.size > maxFileSize) {
                alert('Kích thước phải nhỏ hơn 10MB');
                reject('File size too large');
                return;
            }

            // Kiểm tra tính toàn vẹn của hình ảnh
            isImageValid(file)
                .then(() => {
                    axios.post('https://api.imgbb.com/1/upload?key=abbbfc4dd8180b09d029902de59a5241', formData)
                        .then(response => {
                            const newlink = response.data.data.image.url;
                            resolve(newlink);
                        })
                        .catch(error => {
                            console.error('Upload không thành công: ', error);
                            reject(error);
                        });
                }).catch(() => {
                    console.error('Hình ảnh không hợp lệ');
                    reject('Invalid image');
                });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const key in formData) {
            if (formData[key] === "") {
                alert("Vui lòng điền đầy đủ thông tin");
                return;
            }
        }
        const isLogin = findCookie("jwt");
        if (isLogin) {
            setLoading(true);
            const jwt = findCookie('jwt');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            };
            //Upload ảnh
            const file = document.getElementById("IMG").files[0];
            let newlink = '';
            if(file){
                newlink = await uploadImage(file);
            }
            if (newlink) {
                formData.IMG = newlink;
            }
            // Gửi đi
            axios.post('http://localhost:88/Backend/product/add', { data: formData , SoLuong: soLuong }, { headers: headers })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        alert("Thêm sản phẩm thành công");
                        setShowModal(false);
                    } else {
                        throw new Error("Thêm sản phẩm thất bại");
                    }
                }).catch(error => {
                    alert(error.response.data.error);
                }).finally(() => {
                    setLoading(false); // Kết thúc loading
                });;
        }
    }

    return (
        <div className={style.modal}>
            <div className={style.wrap_content}>
                {loading && (
                    <Loading/>
                )
                }
                <p><FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} /></p>
                <h1>Thêm sản phẩm mới</h1>
                <form className={style.updateForm} onSubmit={handleSubmit}>
                    <div className={style.formGroup}>
                        <label htmlFor="TenSP">Tên sản phẩm:</label>
                        <input
                            type="text"
                            id="TenSP"
                            name="TenSP"
                            value={formData.TenSP}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="IDLoaiSanPham">Loại sản phẩm:</label>
                        <select
                            id="IDLoaiSanPham"
                            name="IDLoaiSanPham"
                            value={formData.IDLoaiSanPham}
                            onChange={handleChange}
                        >
                            <option value="">Chọn loại sản phẩm</option>
                            {category.map((value) => (
                                <option
                                    key={value.IDLoaiSanPham}
                                    value={value.IDLoaiSanPham}
                                >
                                    {value.TenLoaiSanPham}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="Mota">Mô tả:</label>
                        <textarea
                            id="Mota"
                            name="Mota"
                            value={formData.Mota}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="DonGia">Đơn giá:</label>
                        <input
                            type="number"
                            id="DonGia"
                            name="DonGia"
                            value={formData.DonGia}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="IMG">Hình ảnh:</label>
                        <input
                            type="file"
                            id="IMG"
                            name="IMG"
                            onChange={handleChange}
                        />
                    </div>
                    <div className={style.formGroup}>
                        <label htmlFor="SoLuong">Số lượng tồn kho:</label>
                        <input
                            type="number"
                            id="SoLuong"
                            name="SoLuong"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Lưu</button>
                </form>
            </div>
        </div>

    );
};

export default AddProductModal;
