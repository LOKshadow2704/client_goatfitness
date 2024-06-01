import React from "react";
import style from './style.module.css';
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login(){
    const { isLogin , login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    
    const handleSubmit = async  (e) => {
        e.preventDefault(); // Chặn gửi dữ liệu mặc định, hạn chế gửi yêu cầu không cần thiết

        const result = await login({ username, password });
        console.log(result)
        if (result.success) {
            alert('Đăng nhập thành công');
            if(result.role === "user"){
                navigate('/');
            }else if(result.role === "employee"){
                navigate('/employee');
            }else if(result.role === "admin"){
                navigate('/admin');
            }
        } else {
            alert(result.message);
        }
    };

    if(isLogin){
        // navigate('/');
        return null;
    }

    return (
        <div className={style['Wrap']}>
            <form className={style['login']} onSubmit={handleSubmit}>
                <h2 className={style['wrap-back']}><a href="/" className={style['back']}>Quay lại</a> </h2>
                <h1>Đăng nhập</h1>
                <div className={style["input-group"]}>
                    <label htmlFor="username">Tên đăng nhập</label> <br/>
                    <input type="text" value={username} id="username" onChange={(e)=>setUsername(e.target.value)} /> <br/>
                </div>
                
                <div className={style["input-group"]}>
                    <label htmlFor="password">Mật khẩu</label> <br/>
                    <input type="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)}/> <br/>
                </div>
                <h2 className={style['wrap-forgot-pw']}><a href="/ForgotPassword" className={style['forgot-pw']}>Quên mật khẩu?</a> </h2>
                <button type="submit" className={style['button']}>Đăng nhập</button>
                <p>Hoặc</p>
                <h3><a href="/signup">Đăng ký</a></h3>
            </form>
        </div>
    );
};

export default Login;