import { useState } from "react";
import { useForm } from "react-hook-form";
import {TextField, Button, Box, Typography,} from "@mui/material";
import { useAuthStore } from "../src/store/useAuthStore.js";

const AuthForm = ({ closeAuth, openForgotPassword }) => {
    const [isRegister, setIsRegister] = useState(false);
    const { register, login } = useAuthStore();
    const { handleSubmit, register: formRegister, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        if (isRegister) {
            await register({ email: data.email, password: data.password });
        } else {
            await login(data.email, data.password);
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
            {/* Forgot Password Link */}
            {!isRegister && (
                <Typography
                  variant="body2"
                  onClick={openForgotPassword}
                  sx={{ mt: 1, textDecoration: "underline", cursor: "pointer" }}
                >
                  Forgot Password?
                </Typography>
            )}
        </Box>
    );
};

export default AuthForm;
