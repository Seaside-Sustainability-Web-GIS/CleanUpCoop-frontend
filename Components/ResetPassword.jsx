// src/Components/ResetPassword.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";

const getCSRFToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
};

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [serverMessage, setServerMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract uid and token from the URL (e.g., ?uid=...&token=...)
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  if (!uid || !token) {
    return (
      <Box sx={{ width: 300, margin: "auto", mt: 4 }}>
        <Typography variant="h6" color="error">
          Invalid or missing reset link.
        </Typography>
      </Box>
    );
  }

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setServerMessage("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("https://webgis-django.onrender.com/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include CSRF token header if required:
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
          uid,
          token,
          new_password: data.password,
        }),
         credentials: "include",
      });
      const responseData = await res.json();
      if (res.ok) {
        setServerMessage(responseData.message || "Password reset successfully.");
        // Redirect after a brief delay
        setTimeout(() => navigate("/"), 2000);
      } else {
        setServerMessage(responseData.error || "Reset failed. Please try again");
      }
    } catch (error) {
      setServerMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: 300, margin: "auto", mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Reset Password
      </Typography>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        label="Confirm New Password"
        type="password"
        fullWidth
        margin="normal"
       {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === watch("password") || "Passwords do not match"
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Reset Password
      </Button>
      {serverMessage && (
        <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
          {serverMessage}
        </Typography>
      )}
    </Box>
  );
};

export default ResetPassword;
