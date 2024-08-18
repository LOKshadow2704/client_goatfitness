import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    const login = async (credentials) => {
        try {
            console.log(credentials)
            const response = await axios.post('http://localhost:8080/Backend/login/', credentials, {
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
            return { success: false, message: 'Kiểm tra lại thông tin' };
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
        fetch('http://localhost:8080/Backend/logout/',option)
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
        if(!user){
            if (jwt) {
                setIsLogin(true);               
                fetchUserInfo();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchUserInfo = () => {
        const jwt = findCookie('jwt');
        if (jwt) {
            const option = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt,
                    'PHPSESSID': findCookie("PHPSESSID")
                }
            }
            fetch('http://localhost:8080/Backend/getAccountInfo', option)
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
        <AuthContext.Provider value={{ user, login, logout, isLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
