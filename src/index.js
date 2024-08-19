import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import các thành phần cần thiết từ react-redux và Redux store
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import store from 'store'; // Đảm bảo đường dẫn này là chính xác

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Bao bọc toàn bộ ứng dụng với Provider */}
      <ThemeProvider theme={theme}>  {/* Bao bọc với ThemeProvider */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
