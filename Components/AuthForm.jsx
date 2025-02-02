import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import useAuthStore from "../src/store/useAuthStore.js"
import useStore from "../src/store/useStore";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { register, login } = useAuthStore();
  const closeAuth = useStore((state) => state.closeAuth);
  const { handleSubmit, register: formRegister, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    if (isRegister) {
      register({ email: data.email, password: data.password });
    } else {
      login(data.email, data.password);
    }
    reset();
    closeAuth();
  };

  return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: 300 }}>
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                {...formRegister("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email format" } })}
                error={!!errors.email}
                helperText={errors.email?.message}
            />

            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                {...formRegister("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
                error={!!errors.password}
                helperText={errors.password?.message}
            />

            {isRegister && (
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    {...formRegister("confirmPassword", { required: "Confirm your password" })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                {isRegister ? "Register" : "Login"}
            </Button>

            <Button fullWidth sx={{ mt: 1 }} onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
            </Button>
        </Box>
    );
};

export default AuthForm;
