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
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useAnnouncement } from "../../contexts/Announcement";
import { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    axios
      .get("http://localhost:8080/Backend/categories")
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
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: files[0], 
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
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
          "http://localhost:8080/Backend/employee/products/add",
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

  //Hàm chuyển đổi text sang HTML
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
    const plainText = newEditorState.getCurrentContent().getPlainText();
    setFormData((prevFormData) => ({
      ...prevFormData,
      Mota: plainText,
    }));
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const Toolbar = ({ toggleInlineStyle, toggleBlockType }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: 1,
          border: "1px solid #ddd",
          borderRadius: "4px",
          // padding: '5px',
          backgroundColor: "#f9f9f9",
          marginBottom: "15px",
          fontSize: "20px",
        }}
      >
        <IconButton onClick={() => toggleInlineStyle("BOLD")}>
          <FormatBoldIcon style={{ color: "#1972D5" }} />
        </IconButton>
        <IconButton onClick={() => toggleInlineStyle("ITALIC")}>
          <FormatItalicIcon style={{ color: "#1972D5" }} />
        </IconButton>
        <IconButton onClick={() => toggleInlineStyle("UNDERLINE")}>
          <FormatUnderlinedIcon style={{ color: "#1972D5" }} />
        </IconButton>
        <IconButton onClick={() => toggleBlockType("unordered-list-item")}>
          <FormatListBulletedIcon style={{ color: "#1972D5" }} />
        </IconButton>
        <IconButton onClick={() => toggleBlockType("ordered-list-item")}>
          <FormatListNumberedIcon style={{ color: "#1972D5" }} />
        </IconButton>
      </Box>
    );
  };

  return (
    <Dialog open onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ textAlign: "center", fontWeight: "bold", fontSize: "20px" }}
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
            <Box
              sx={{
                border: "1px solid #ddd",
                minHeight: "150px",
                padding: "10px",
                borderRadius: "4px",
                position: "relative",
              }}
            >
              <Toolbar
                toggleInlineStyle={toggleInlineStyle}
                toggleBlockType={toggleBlockType}
              />
              <Editor
                editorState={editorState}
                onChange={handleEditorChange}
                handleKeyCommand={handleKeyCommand}
                placeholder="Nhập mô tả sản phẩm..."
              />
            </Box>
            <input
              type="hidden"
              id="Mota"
              name="Mota"
              value={formData.Mota} 
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
          <FormControl fullWidth margin="normal">
            <TextField
              label="Hình ảnh"
              id="IMG"
              name="IMG"
              type="file"
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
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
              sx={{ width: "250px" }}
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
