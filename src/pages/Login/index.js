import React, { useState } from "react";
import style from './style.module.css';
import { useAuth } from "../../contexts/AuthContext";
import { useAnnouncement } from "../../contexts/Announcement";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBack from '@mui/icons-material/ArrowBack'; // Nhập biểu tượng quay lại
import Announcement from "../../components/Announcement";
import { Link } from 'react-router-dom'; // Sử dụng Link từ react-router-dom nếu bạn sử dụng React Router

function Login() {
    const { isLogin, login, user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { error, success, warning, setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();
    
    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn gửi dữ liệu mặc định, hạn chế gửi yêu cầu không cần thiết

        const result = await login({ username, password });
        console.log(result)
        if (result.success) {
            setSuccess(true);
            setMessage("Đăng nhập thành công");
            if (result.role === "user") {
                setLocation(true);
                setLink("http://localhost:3000/");
            } else if (result.role === "employee") {
                setLocation(true);
                setLink("http://localhost:3000/employee");
            } else if (result.role === "admin") {
                setLocation(true);
                setLink("http://localhost:3000/admin");
            }
        } else {
            setError(true);
            setMessage(result.message);
        }
    };

    if (isLogin) {
        if (user.role === "user") {
            setLocation(true);
            setLink("http://localhost:3000/");
        } else if (user.role === "employee") {
            setLocation(true);
            setLink("http://localhost:3000/employee");
        } else if (user.role === "admin") {
            setLocation(true);
            setLink("http://localhost:3000/admin");
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className={style['Wrap']}>
            {error || success || warning ? <Announcement /> : null}
            <form className={style['login']} onSubmit={handleSubmit}>
                <div className={style['wrap-back']}>
                    <IconButton 
                        component={Link} 
                        to="/" 
                        aria-label="quay lại" 
                        className={style['back-button']}
                    >
                        <ArrowBack />
                    </IconButton>
                </div>
                <h1>Đăng nhập</h1>
                <div className={style["input-group"]}>
                    <TextField
                        id="username"
                        label="Tên đăng nhập"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        fullWidth
                        sx={{
                            marginBottom: '20px',
                            width: '70%',
                            height:'30px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black', // Đường viền mặc định
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF', // Màu viền khi hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF', // Màu viền khi focus
                                },
                                '& .MuiInputBase-input': {
                                    borderBottom: 'none', // Xóa dấu gạch chân
                                }
                            }
                        }}
                    />
                </div>

                <div className={style["input-group"]}>
                    
                    <TextField
                        id="password"
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                '& .MuiInputBase-input': {
                                    textDecoration: 'none',
                                    borderBottom: 'none',
                                }
                            }
                        }}
                        sx={{
                            marginBottom: '20px',
                            width: '70%',
                            height:'30px',
                            marginTop:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF', // màu hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF', // màu khi focus
                                },
                            }
                        }}
                    />
                    <h2 className={style['wrap-forgot-pw']}><a href="/ForgotPassword" className={style['forgot-pw']}>Quên mật khẩu?</a></h2>
                </div>
                <Button 
                    type="submit" 
                    sx={{
                        width: '70%',
                        marginLeft: '15%',
                        padding: '15px',
                        borderRadius: '10px',
                        backgroundColor: '#081158',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#003366',
                        }
                    }}
                >
                    Đăng nhập
                </Button>
                <p className={style["or"]}>Hoặc</p>
                <Button 
                    component={Link}
                    to="/signup"
                    sx={{
                        width: '40%',
                        marginBottom: '5%',
                        marginLeft: '30%',
                        marginTop:'3px',
                        padding: '15px',
                        borderRadius: '10px',
                        backgroundColor: '#2596be',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#0056b3',
                        }
                    }}
                >
                    Đăng ký
                </Button>
            </form>
        </div>
    );
};

export default Login;
