// material-ui
import { useTheme } from '@mui/material/styles';
import logo from 'src/assets/img/logo_ver1.jpg';

const Logo = () => {
  const theme = useTheme();

  return (
    <img src={logo} alt="GOAT GYM" width="150" height="auto" />
  );
};

export default Logo;
