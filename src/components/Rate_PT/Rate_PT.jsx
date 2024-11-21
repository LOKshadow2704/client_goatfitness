import React, { useState } from "react";
import { Box, Typography, TextField, Button, Rating } from "@mui/material";

const ReviewSection = ({ onSubmit }) => {
  const [rating, setRating] = useState(0); 
  const [reviewText, setReviewText] = useState(""); 

  const handleSubmit = () => {
    if (rating === 0 || reviewText.trim() === "") {
      alert("Vui lòng nhập đầy đủ đánh giá và chọn số sao.");
      return;
    }
    onSubmit({ rating, reviewText }); 
    setRating(0); 
    setReviewText(""); 
  };

  return (
    <Box
      sx={{
        marginTop: 4,
        padding: 2,
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
        Mức độ hài lòng
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
        <Rating
          name="pt-rating"
          value={rating}
          size="large"
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </Box>
      <TextField
        fullWidth
        label="Viết đánh giá của bạn"
        variant="outlined"
        multiline
        rows={4}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      <Button
        variant="contained"
        color="primary"
        // fullWidth
        onClick={handleSubmit}
        sx={{
          padding: "10px 20px",
          fontWeight: "bold",
          fontSize: "16px",
          width:"200px",
        }}
      >
        Gửi đánh giá
      </Button>
    </Box>
  );
};

export default ReviewSection;
