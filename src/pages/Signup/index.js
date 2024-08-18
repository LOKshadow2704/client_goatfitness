import React, { useState } from "react";
import axios from "axios";
import style from './style.module.css';
import { useAnnouncement } from "../../contexts/Announcement";
import Announcement from "../../components/Announcement";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, TextField, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signup() {
    const { error, success, warning, setError, setMessage, setSuccess, setLocation, setLink } = useAnnouncement();
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        password: '',
        re_password: '',
        email: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
        validateField(id, value);
    };

    const validateField = (id, value) => {
        let errorMsg = '';

        switch (id) {
            case 'username':
                if (!/^[a-zA-Z0-9]{10,30}$/.test(value)) {
                    errorMsg = "Tên đăng nhập phải từ 10 đến 30 ký tự và chỉ chứa chữ cái và số.";
                }
                break;
            case 'password':
                if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,18}$/.test(value)) {
                    errorMsg = "Mật khẩu phải từ 6 đến 18 ký tự, gồm chữ thường, chữ in, số và ký tự đặc biệt.";
                }
                break;
            case 're_password':
                if (value !== formData.password) {
                    errorMsg = "Mật khẩu không khớp!";
                }
                break;
            case 'email':
                if (!/^[\w.%+-]+@gmail\.com$/.test(value)) {
                    errorMsg = "Email phải có đuôi @gmail.com.";
                }
                break;
            case 'phone':
                if (!/^0\d{9}$/.test(value)) {
                    errorMsg = "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.";
                }
                break;
            case 'address':
                if (value.trim() === '') {
                    errorMsg = "Vui lòng nhập địa chỉ của bạn.";
                }
                break;
            case 'fullname':
                if (value.trim() === '') {
                    errorMsg = "Vui lòng nhập họ và tên của bạn.";
                }
                break;
            default:
                break;
        }

        setErrors(prevState => ({
            ...prevState,
            [id]: errorMsg
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validate all fields
        ['username', 'password', 're_password', 'email', 'phone', 'fullname', 'address'].forEach(field => {
            const value = formData[field];
            validateField(field, value);
            if (errors[field]) {
                newErrors[field] = errors[field];
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)
        const { re_password, ...formDataToSend } = formData;
        if (!validateForm()) {
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/Backend/signup', formDataToSend);
            if (!response.error) {
                setSuccess(true);
                setMessage("Đăng ký thành công");
                setLocation(true);
                setLink("http://localhost:3000/login");
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            setError(true);
            setMessage(error.response.data.error);
            // handle error
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowRePassword = () => {
        setShowRePassword(!showRePassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className={style['Wrap']}>
            {error || success || warning ? <Announcement /> : null}
            <form className={`${style['login']} ${style['scrollable']}`} onSubmit={handleSubmit}>
                <IconButton className={style['wrap-back']} href="/">
                    <ArrowBackIcon />
                </IconButton>
                <h1>Đăng ký</h1>

                {/* Họ và tên */}
                <div className={style["input-group"]}>
                    <TextField
                        id="fullname"
                        label="Họ và tên"
                        type="text"
                        value={formData.fullname}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        error={!!errors.fullname}
                        helperText={errors.fullname}
                        sx={{
                            marginTop:'15px',
                            marginLeft:'20px',
                            marginBottom: '10px',
                            width: '300%',
                            height:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '& .MuiInputBase-input': {
                                    borderBottom: 'none',
                                }
                            }
                        }}
                    />
                </div>

                {/* Tên đăng nhập */}
                <div className={style["input-group"]}>
                    <TextField
                        id="username"
                        label="Tên đăng nhập"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        error={!!errors.username}
                        helperText={errors.username}
                        sx={{
                            marginTop:'15px',
                            marginLeft:'20px',
                            marginBottom: '10px',
                            width: '300%',
                            height:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '& .MuiInputBase-input': {
                                    borderBottom: 'none',
                                }
                            }
                        }}
                    />
                </div>

                {/* Mật khẩu */}
                <div className={style["input-group"]}>
                    <TextField
                        id="password"
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password}
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
                            marginTop:'15px',
                            marginLeft:'20px',
                            marginBottom: '10px',
                            width: '300%',
                            height:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF',
                                },
                            }
                        }}
                    />
                </div>

                {/* Nhập lại mật khẩu */}
                <div className={style["input-group"]}>
                    <TextField
                        id="re_password"
                        label="Nhập lại mật khẩu"
                        type={showRePassword ? 'text' : 'password'}
                        value={formData.re_password}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        error={!!errors.re_password}
                        helperText={errors.re_password}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowRePassword}
                                        onMouseDown={handleMouseDownPassword}
                                    >
                                        {showRePassword ? <VisibilityOff /> : <Visibility />}
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
                            marginTop:'15px',
                            marginLeft:'20px',
                            marginBottom: '10px',
                            width: '300%',
                            height:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF',
                                },
                            }
                        }}
                    />
                </div>

                {/* Email */}
                <div className={style["input-group"]}>
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={{
                            marginTop:'15px',
                            marginLeft:'20px',
                            marginBottom: '10px',
                            width: '300%',
                            height:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '& .MuiInputBase-input': {
                                    borderBottom: 'none',
                                }
                            }
                        }}
                    />
                </div>

                {/* Số điện thoại */}
                <div className={style["input-group"]}>
                    <TextField
                        id="phone"
                        label="Số điện thoại"
                        type="text"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={{
                            marginTop:'15px',
                            marginLeft:'20px',
                            marginBottom: '10px',
                            width: '300%',
                            height:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '& .MuiInputBase-input': {
                                    borderBottom: 'none',
                                }
                            }
                        }}
                    />
                </div>

                {/* Địa chỉ */}
                <div className={style["input-group"]}>
                    <TextField
                        id="address"
                        label="Địa chỉ"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address}
                        sx={{
                            marginTop:'15px',
                            marginLeft:'20px',
                            marginBottom: '10px',
                            width: '300%',
                            height:'20px',
                            '& .MuiInputLabel-root': {
                                color: 'inherit'
                            },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '& fieldset': {
                                    borderColor: 'black',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#007FFF',
                                },
                                '& .MuiInputBase-input': {
                                    borderBottom: 'none',
                                }
                            }
                        }}
                    />
                </div>
                
                <button type="submit" className={style['button']}>Đăng ký</button>
                <p className={style['or']}>Hoặc</p>
                <h3 className={style['dangnhap']}><a href="/login">Đăng nhập</a></h3>
            </form>
        </div>
    );
}

export default Signup;
