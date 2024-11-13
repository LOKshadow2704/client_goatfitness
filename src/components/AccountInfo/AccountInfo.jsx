import React, { useEffect, useState } from "react";
import axios from "axios";
import style from './style.module.css';
import { useAnnouncement } from '../../contexts/Announcement';

function AccountInfo({ userData, setUpdate }) {
    const [name, setName] = useState(userData.HoTen);
    const [email, setEmail] = useState(userData.Email);
    const [address, setAddress] = useState(userData.DiaChi);
    const [phoneNum, setPhoneNum] = useState(userData.SDT);
    const [dataChanged, setDataChanged] = useState(false);
    const [rerender, setRerender] = useState(false);
    const { setSuccess, setError, setMessage, setWarning } = useAnnouncement();

    useEffect(() => {
        setDataChanged(
            name !== userData.HoTen ||
            email !== userData.Email ||
            address !== userData.DiaChi ||
            phoneNum !== userData.SDT
        );
    }, [rerender, name, email, address, phoneNum, userData]);

    useEffect(() => {
        setName(userData.HoTen);
        setEmail(userData.Email);
        setAddress(userData.DiaChi);
        setPhoneNum(userData.SDT);
    }, [userData]);

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

    const updateUser = () => {
        if (!dataChanged) return false;
        const jwt = findCookie('jwt');
        const data = {
            name: name,
            email: email,
            address: address,
            phoneNum: phoneNum
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt,
            'PHPSESSID': findCookie("PHPSESSID")
        };
        axios.put('http://localhost:8080/Backend/user/update', data, { headers: headers
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                setUpdate(true);
                setRerender(!rerender);
                setSuccess(true);
                setMessage('Cập nhật thông tin thành công');
            }
        }).catch(error => {
            setError(true);
            setMessage("Cập nhật thông tin thất bại");
        });
    };

    const checkDataChanged = () => {
        return (
            name !== userData.HoTen ||
            email !== userData.Email ||
            address !== userData.DiaChi ||
            phoneNum !== userData.SDT
        );
    };

    const checkFieldsNotEmpty = () => {
        return name.trim() !== '' && email.trim() !== '' && address.trim() !== '' && phoneNum.trim() !== '';
    };

    const handleUpdateClick = () => {
        if (!checkFieldsNotEmpty()) {
            setWarning(true);
            setMessage('Vui lòng điền đầy đủ thông tin vào tất cả các trường.');
            return;
        }

        if (checkDataChanged()) {
            setDataChanged(true);
            updateUser();
        } else {
            setWarning(true);
            setMessage('Không có thay đổi nào để cập nhật.');
        }
    };

    const resetData = () => {
        setName(userData.HoTen);
        setEmail(userData.Email);
        setAddress(userData.DiaChi);
        setPhoneNum(userData.SDT);
        setDataChanged(false);
    };

    return (
        <div className={style['container']}>
            <div className={style['group']}>
                <label htmlFor="name">Họ tên</label>
                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={style['group']}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={style['group']}>
                <label htmlFor="address">Địa chỉ</label>
                <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className={style['group']}>
                <label htmlFor="phoneNum">Số điện thoại</label>
                <input id="phoneNum" type="text" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
            </div>
            <div className={style['action']}>
                <div className={style['submit']}>
                    <button onClick={handleUpdateClick}>
                        Cập nhật thay đổi
                    </button>
                </div>
                <div className={style['reset']}>
                    <button onClick={resetData}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AccountInfo;
