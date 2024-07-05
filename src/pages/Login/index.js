import React from "react";
import style from './style.module.css';
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useAnnouncement } from "../../contexts/Announcement";
import Announcement from "../../components/Announcement";

function Login(){
    const { isLogin , login, user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { error , success , warning , setError ,setMessage ,setSuccess , setLocation , setLink} = useAnnouncement();
    
    const handleSubmit = async  (e) => {
        e.preventDefault(); // Chặn gửi dữ liệu mặc định, hạn chế gửi yêu cầu không cần thiết

        const result = await login({ username, password });
        console.log(result)
        if (result.success) {
            setSuccess(true);
            setMessage("Đăng nhập thành công");
            if(result.role === "user"){
                setLocation(true);
                setLink("http://localhost:3000/");
            }else if(result.role === "employee"){
                setLocation(true);
                setLink("http://localhost:3000/employee");
            }else if(result.role === "admin"){
                setLocation(true);
                setLink("http://localhost:3000/admin");
            }
        } else {
            setError(true);
            setMessage(result.message);
        }
    };

    if(isLogin){
        if(user.role === "user"){
            setLocation(true);
            setLink("http://localhost:3000/");
        }else if(user.role === "employee"){
            setLocation(true);
            setLink("http://localhost:3000/employee");
        }else if(user.role === "admin"){
            setLocation(true);
            setLink("http://localhost:3000/admin");
        }
    }

    return (
        <div className={style['Wrap']}>
            {error || success || warning ? <Announcement /> : null}
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