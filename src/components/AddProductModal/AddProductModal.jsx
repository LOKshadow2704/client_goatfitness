import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";

function AddProductModal({ setShowModal }) {
  const [soLuong, setSoLuong] = useState("");
  const [formData, setFormData] = useState({
    IDLoaiSanPham: "",
    TenSP: "",
    Mota: "",
    DonGia: "",
    IMG: "",
  });
  const [selectedFileName, setSelectedFileName] = useState(""); // Thêm state để lưu tên file
  const { setSuccess, setError, setMessage, setWarning } = useAnnouncement();
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/Backend/product/get_All_Category")
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          setCategory(response.data);
        } else {
          throw new Error("Lấy thông tin thất bại");
        }
      })
      .catch((error) => {
        setError(true);
        setMessage(error.response.data.error);
      });
  }, [setError, setMessage]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "SoLuong") {
      setSoLuong(value);
    } else if (name === "IMG") {
      if (files.length > 0) {
        setSelectedFileName(files[0].name); // Cập nhật tên file
        setFormData({ ...formData, [name]: files[0] }); // Lưu file vào formData
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

  // const uploadImage = (file) => {
  //     return new Promise((resolve, reject) => {
  //         const isImageValid = (file) => {
  //             return new Promise((resolve, reject) => {
  //                 const img = new Image();
  //                 img.onload = () => resolve(true);
  //                 img.onerror = () => reject(false);
  //                 img.src = URL.createObjectURL(file);
  //             });
  //         };

  //         const formData = new FormData();
  //         formData.append('image', file);

  //         const validExtensions = ['jpg', 'jpeg', 'png'];
  //         const fileExtension = file.name.split('.').pop().toLowerCase();
  //         if (!validExtensions.includes(fileExtension)) {
  //             setError(true);
  //             setMessage('File được chấp nhận JPG, JPEG, PNG.');
  //             reject('Invalid file extension');
  //             return;
  //         }

  //         const maxFileSize = 10 * 1024 * 1024; // 10 MB
  //         if (file.size > maxFileSize) {
  //             setError(true);
  //             setMessage('Kích thước phải nhỏ hơn 10MB');
  //             reject('File size too large');
  //             return;
  //         }

  //         isImageValid(file)
  //             .then(() => {
  //                 axios.post('https://api.imgbb.com/1/upload?key=3cce2ac9aa57bb924332afd210600b24', formData)
  //                     .then(response => {
  //                         const newlink = response.data.data.image.url;
  //                         resolve(newlink);
  //                     })
  //                     .catch(error => {
  //                         console.error('Upload không thành công: ', error);
  //                         reject(error);
  //                     });
  //             }).catch(() => {
  //                 console.error('Hình ảnh không hợp lệ');
  //                 reject('Invalid image');
  //             });
  //     });
  // };

  //Long Vỹ đổi lại cái api lưu hình ảnh. Tại cái imgbb không xài được nên đổi qua xài cloudiary
  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const isImageValid = (file) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => reject(false);
          img.src = URL.createObjectURL(file);
        });
      };

      const validExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        setError(true);
        setMessage("File được chấp nhận JPG, JPEG, PNG.");
        reject("Invalid file extension");
        return;
      }

      const maxFileSize = 10 * 1024 * 1024; // 10 MB
      if (file.size > maxFileSize) {
        setError(true);
        setMessage("Kích thước phải nhỏ hơn 10MB");
        reject("File size too large");
        return;
      }

      isImageValid(file)
        .then(() => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "my_preset");

          // Sử dụng API của Cloudinary
          axios
            .post(
              `https://api.cloudinary.com/v1_1/dzh4pimvj/image/upload`,
              formData
            )
            .then((response) => {
              const newlink = response.data.secure_url;
              resolve(newlink);
            })
            .catch((error) => {
              console.error("Upload không thành công: ", error);
              reject(error);
            });
        })
        .catch(() => {
          console.error("Hình ảnh không hợp lệ");
          reject("Invalid image");
        });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (formData[key] === "" && key !== "IMG") {
        setWarning(true);
        setMessage("Vui lòng điền đầy đủ thông tin");
        return;
      }
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

      const file = formData.IMG;
      let newlink = "";
      if (file) {
        newlink = await uploadImage(file);
      }
      if (newlink) {
        formData.IMG = newlink;
      }

      axios
        .post(
          "http://localhost:8080/Backend/product/add",
          { data: formData, SoLuong: soLuong },
          { headers: headers }
        )
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            setSuccess(true);
            setMessage("Thêm sản phẩm thành công");
            setShowModal(false);
          } else {
            throw new Error("Thêm sản phẩm thất bại");
          }
        })
        .catch((error) => {
          setError(true);
          setMessage(error.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Dialog open onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", fontSize: "22px" }}
      >
        Thêm sản phẩm mới
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
              label="Tên sản phẩm"
              id="TenSP"
              name="TenSP"
              value={formData.TenSP}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="IDLoaiSanPham-label">Loại sản phẩm</InputLabel>
            <Select
              labelId="IDLoaiSanPham-label"
              id="IDLoaiSanPham"
              name="IDLoaiSanPham"
              value={formData.IDLoaiSanPham}
              onChange={handleChange}
              label="Loại sản phẩm"
            >
              <MenuItem value="">
                <em>Chọn loại sản phẩm</em>
              </MenuItem>
              {category.map((value) => (
                <MenuItem key={value.IDLoaiSanPham} value={value.IDLoaiSanPham}>
                  {value.TenLoaiSanPham}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Mô tả"
              id="Mota"
              name="Mota"
              value={formData.Mota}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Đơn giá"
              type="number"
              id="DonGia"
              name="DonGia"
              value={formData.DonGia}
              onChange={handleChange}
              fullWidth
            />
          </FormControl>
          <FormControl sx={{ width: "120px" }} margin="normal">
            <Button variant="contained" component="label">
              Tải ảnh lên
              <input
                type="file"
                id="IMG"
                name="IMG"
                hidden
                onChange={handleChange}
              />
            </Button>
            {selectedFileName && (
              <Typography variant="body2" color="textSecondary" mt={1}>
                {selectedFileName}
              </Typography>
            )}
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Số lượng tồn kho"
              type="number"
              id="SoLuong"
              name="SoLuong"
              value={soLuong}
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

export default AddProductModal;
