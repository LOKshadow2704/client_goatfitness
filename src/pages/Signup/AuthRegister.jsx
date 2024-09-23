import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AnimateButton from 'src/components/ui-component/extended/AnimateButton';
import { useAnnouncement } from 'src/contexts/Announcement';

const AuthRegister = ({ ...others }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { setError, setSuccess, setMessage, setLocation, setLink } = useAnnouncement();

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    re_password: '', 
    email: '',
    phone: '',
    address: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = '';

    switch (name) {
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
      case 're_password': // Đổi tên từ confirmPassword thành re_password
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
      [name]: errorMsg
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    // Validate all fields
    ['username', 'password', 're_password', 'email', 'phone', 'fullname', 'address'].forEach(field => {
      const value = formData[field];
      validateField(field, value); 
      if (!value || errors[field]) {
        newErrors[field] = errors[field] || "Vui lòng điền thông tin vào trường này.";
        isValid = false;
      }
    });
  
    if (!formData.terms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản & điều kiện';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8080/Backend/signup', formData);
  
      if (response.status === 200) {
        setSuccess(true);
        setMessage(response.data.success || "Đăng ký thành công");
        setLocation(true);
        setLink("http://localhost:3000/login");
        navigate('/login');
      } else {
        throw new Error(response.data.error || 'Unknown error');
      }
    } catch (error) {
      if (error.response?.data?.error === "Tên đăng nhập đã tồn tại") {
        setErrors((prevState) => ({
          ...prevState,
          username: "Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác."
        }));
      } else {
        setError(true);
        setMessage(error.response?.data?.error || 'Đã xảy ra lỗi khi đăng ký');
      }
    }
  };
  
  

  return (
    <form noValidate onSubmit={handleSubmit} {...others}>
      <TextField
        fullWidth
        label="Họ và tên"
        margin="normal"
        name="fullname"
        value={formData.fullname}
        onChange={handleChange}
        error={Boolean(errors.fullname)}
        helperText={errors.fullname}
      />
      <TextField
  fullWidth
  label="Tên đăng nhập"
  margin="normal"
  name="username"
  value={formData.username}
  onChange={handleChange}
  error={Boolean(errors.username)}
  helperText={errors.username}
/>
      <FormControl fullWidth error={Boolean(errors.password)} sx={{ marginTop: '10px' }}>
        <InputLabel htmlFor="outlined-adornment-password-register">Mật khẩu</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-register"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          name="password"
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Mật khẩu"
        />
        {errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth error={Boolean(errors.re_password)} sx={{ marginTop: '10px' }}>
        <InputLabel htmlFor="outlined-adornment-confirm-password-register">Nhập lại mật khẩu</InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password-register"
          type="password"
          value={formData.re_password}
          name="re_password" 
          onChange={handleChange}
          label="Nhập lại mật khẩu"
        />
        {errors.re_password && <FormHelperText error>{errors.re_password}</FormHelperText>}
      </FormControl>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
      />

      <TextField
        fullWidth
        label="Số điện thoại"
        margin="normal"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={Boolean(errors.phone)}
        helperText={errors.phone}
      />

      <TextField
        fullWidth
        label="Địa chỉ"
        margin="normal"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={Boolean(errors.address)}
        helperText={errors.address}
      />

      <Grid container alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
        <Grid item>
          <FormControlLabel
            control={<Checkbox checked={formData.terms} onChange={handleChange} name="terms" />}
            label={<Typography variant="caption">Tôi đồng ý với điều khoản và điều kiện</Typography>}
          />
          {errors.terms && <FormHelperText error>{errors.terms}</FormHelperText>}
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button disableElevation fullWidth size="large" type="submit" variant="contained">
            Đăng ký
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
};

export default AuthRegister;
