import React, { useState } from "react";
import {
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function AddCategoryModal({ setShowModal }) {
  const [formData, setFormData] = useState({
    TenLoaiSanPham: "", // Chỉ có trường này
  });
  const { setSuccess, setError, setMessage, setWarning } = useAnnouncement();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const findCookie = (name) => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.TenLoaiSanPham === "") {
      setWarning(true);
      setMessage("Vui lòng điền đầy đủ thông tin Tên loại sản phẩm");
      return;
    }

    const isLogin = findCookie("jwt");
    if (isLogin) {
      setLoading(true);
      const jwt = findCookie("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwt,
        PHPSESSID: findCookie("PHPSESSID"),
      };

      axios
        .post(
          "http://localhost:8080/Backend/category_product/add",
          { TenLoaiSanPham: formData.TenLoaiSanPham }, 
          { headers: headers }
        )
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Thêm loại sản phẩm thành công");
            setShowModal(false);
          } else {
            throw new Error("Thêm loại sản phẩm thất bại");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response?.data?.error || "Có lỗi xảy ra");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open onClose={() => setShowModal(false)}  maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}
      >
        Thêm loại sản phẩm mới
        <IconButton
          aria-label="close"
          onClick={() => setShowModal(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Tên loại sản phẩm"
              id="TenLoaiSanPham"
              name="TenLoaiSanPham"
              value={formData.TenLoaiSanPham}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>
          <Box mt={1} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ width: "120px" }}
            >
              Lưu
            </Button>
          </Box>
        </form>
      </DialogContent>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}

export default AddCategoryModal;
