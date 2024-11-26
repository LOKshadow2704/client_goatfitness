import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddSalaryEmp = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    salary: "",
    bonus: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (formData.name && formData.position && formData.salary) {
      const newEmployee = {
        id: Date.now(), // Tạo ID duy nhất
        ...formData,
        salary: parseFloat(formData.salary),
        bonus: parseFloat(formData.bonus || 0),
      };
      onSave(newEmployee);
      onClose();
    } else {
      alert("Vui lòng nhập đầy đủ thông tin!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "20px",borderBottom:"1px solid #ddd" }}>
        Thêm lương mới
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Họ và tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Vị trí"
          name="position"
          value={formData.position}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Lương tháng"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Thưởng thêm"
          name="bonus"
          value={formData.bonus}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="number"
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" ,marginBottom:"15px"}}>
        <Button onClick={handleSave} color="primary" variant="contained" sx={{ width: "150px" }}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSalaryEmp;
