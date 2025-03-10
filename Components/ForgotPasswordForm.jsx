// src/Components/ForgotPasswordForm.jsx
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useAuthStore, getCSRFToken } from "../src/store/useAuthStore";

const API_BASE_URL = "https://webgis-django.onrender.com/api";

const ForgotPasswordForm = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverMessage, setServerMessage] = useState("");

  // Access your Zustand store methods
  const setCsrfToken = useAuthStore(state => state.setCsrfToken);
  const storedCsrfToken = useAuthStore(state => state.csrfToken);

  const onSubmit = async (data) => {
    // 1) Ensure we have a fresh CSRF token
    await setCsrfToken(); // This presumably does an axios GET /set-csrf-token, etc.

    // 2) Fallback to any existing cookie if the store token isn't set
    const csrftoken = storedCsrfToken || getCSRFToken();
    if (!csrftoken) {
      console.error("CSRF token is missing. Cannot proceed.");
      setServerMessage("CSRF token missing.");
      return;
    }

    try {
      // 3) Make the POST request with the CSRF header and cross-site cookies
      const response = await axios.post(
        `${API_BASE_URL}/forgot-password`,
        { email: data.email },
        {
          withCredentials: true, // crucial if your Django & React are on different domains
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        }
      );

      setServerMessage(
        response.data?.message || "Check your email for reset instructions."
      );
    } catch (error) {
      console.error("ForgotPassword error:", error);
      setServerMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: 300 }}>
      <Typography variant="h6" gutterBottom>
        Forgot Password
      </Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/,
            message: "Invalid email format",
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Send Reset Link
      </Button>
      {serverMessage && (
        <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
          {serverMessage}
        </Typography>
      )}
      <Button fullWidth sx={{ mt: 1 }} onClick={onClose}>
        Close
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm;
