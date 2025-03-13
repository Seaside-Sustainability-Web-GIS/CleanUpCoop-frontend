// src/Components/ResetPassword.jsx
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const getCSRFToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];
};

const API_BASE_URL = "https://webgis-django.onrender.com/api";

const ResetPassword = () => {
    useEffect(() => {
    // GET request to set the csrftoken cookie
    const fetchCSRF = async () => {
      try {
        await axios.get(`${API_BASE_URL}/set-csrf-token`, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Failed to set CSRF cookie", error);
      }
    };

    fetchCSRF();
  }, []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [serverMessage, setServerMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
      const csrfToken = getCSRFToken();
      const response = await axios.post(
        `${API_BASE_URL}/reset-password`,
        {
          uid,
          token,
          new_password: data.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setServerMessage(
        response.data?.message || "Password reset successfully."
      );

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      if (error.response?.data?.error) {
        setServerMessage(error.response.data.error);
      } else {
        setServerMessage("Reset failed. Please try again.");
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: 300, margin: "auto", mt: 4 }}
    >
      <Typography variant="h6" gutterBottom>
        Reset Password
      </Typography>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        margin="normal"
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Minimum 6 characters" },
        })}
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
          validate: (value) =>
            value === watch("password") || "Passwords do not match",
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
