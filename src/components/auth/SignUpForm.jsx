import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, CircularProgress, Divider } from '@mui/material';

export default function SignUpForm({
  onSignup,
  setAuthMode
}) {
  const {
    handleSubmit,
    register,
    watch,
    formState: {errors},
  } = useForm();

  const onSubmit = async (data) => {
    console.log('What is this data', data);
    await onSignup({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password
    })
  }
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {/* First Name */}
      <TextField
        label="First Name"
        fullWidth
        size="small"
        sx={{my: 1}}
        {...register("first_name", {required: "First name is required"})}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
      />

      {/* Last Name */}
      <TextField
        label="Last Name"
        fullWidth
        size="small"
        sx={{my: 1}}
        {...register("last_name", {required: "Last name is required"})}
        error={!!errors.last_name}
        helperText={errors.last_name?.message}
      />

      {/* Email */}
      <TextField
        label="Email"
        fullWidth
        size="small"
        sx={{my: 1}}
        {...register("email", {
          required: "Email is required",
          pattern: {value: /^\S+@\S+$/, message: "Invalid email format"}
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {/* Password */}
      <TextField
        label="Password"
        type="password"
        fullWidth
        size="small"
        sx={{my: 1}}
        {...register("password", {
          required: "Password is required",
          minLength: {value: 6, message: "Minimum 6 characters"}
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      {/* Confirm Password */}
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        size="small"
        sx={{my: 1}}
        {...register("confirm_password", {
          required: "Confirm your password",
          validate: (value) => value === watch("password") || "Passwords do not match"
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        sx={{mt: 3}} 
        // disabled={loading}
      >
        Signup
      </Button>

      <Button 
        fullWidth 
        sx={{mt: 3, p: 0}}
        onClick={() => setAuthMode('signin')}
      >
        Already have an account? Login
      </Button>
      
      {/* Forgot Password Link */}
      <Typography
        align="center"
        variant="body2"
        // onClick={openForgotPassword}
        sx={{mt: 1, textDecoration: "underline", cursor: "pointer"}}
      >
        Forgot Password?
      </Typography>

      <Divider sx={{color: 'grey.700', my: 2}}> <Typography>or</Typography> </Divider>
      
      <Button
        fullWidth
        variant="contained"
        sx={{my: 1}}
      >
        Sign up with Google
      </Button>
      <Button
        fullWidth
        variant="contained"
        sx={{my: 1}}
      >
        Sign up with Facebook
      </Button>

    </Box>
  )
}