import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    const login = async (credentials) => {
        try {
            console.log(credentials)
            const response = await axios.post('http://localhost:88/Backend/login/', credentials, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = response.data;
            // if(user){
            //     user.TrangThai = user.TrangThai === 0 ? 'offline' : 'online';
            // }
            const { user } = data;
            setUser(user[0]);
            setIsLogin(true);
            return { success: true , role: user[0].TenVaiTro };
        } catch (error) {
            console.error('Error', error.message);
            return { success: false, message: 'Đăng nhập không thành công, kiểm tra lại thông tin' };
        }
    };

    const logout = () => {
        const jwt = findCookie('jwt');
        const option = {
            method : 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+jwt,
                'PHPSESSID': findCookie("PHPSESSID")
            }
        }
        fetch('http://localhost:88/Backend/logout/',option)
            .then(
                response=>{
                    if(response.ok){
                        document.cookie = 'jwt=; Max-Age=-1; path=/;';
                        document.cookie = 'PHPSESSID=; Max-Age=-1; path=/;';
                        return response.json();
                    }else{
                        throw new Error (response.error);
                    }
                }
            )
            .then(
                data =>{
                    alert(data.message);
                    window.location.href = 'http://localhost:3000/';
                }
            )
            .catch(
                error => {
                    console.error(error);
                }
            )
    };

    useEffect(() => {
        const jwt = findCookie('jwt');
        if (jwt) {
            setIsLogin(true);
            if(!user){
                fetchUserInfo();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUserInfo = () => {
        const jwt = findCookie('jwt');
        if (jwt) {
            const option = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt,
                    'PHPSESSID': findCookie("PHPSESSID")
                }
            }
            fetch('http://localhost:88/Backend/getAccountInfo', option)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(response.error);
                    }
                })
                .then(data => {
                    // data.TrangThai = data.TrangThai === 0 ? 'offline' : 'online';
                    setUser(data);
                })
                .catch(error => {
                    console.error(error);
                });
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

    return (
        <AuthContext.Provider value={{ user, login, logout, isLogin , fetchUserInfo}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
