import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, CircularProgress, Divider } from '@mui/material';

export default function SignInForm({
  onSignin,
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
    await onSignin({
      email: data.email,
      password: data.password
    })
  }
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
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

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        sx={{mt: 3}} 
        // disabled={loading}
      >
        Login
      </Button>

      <Button 
        fullWidth 
        sx={{mt: 3, p: 0}}
        onClick={() => setAuthMode('signup')}
      >
        Don&lsquo;t have an account? Signup
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
        Sign in with Google
      </Button>
      <Button
        fullWidth
        variant="contained"
        sx={{my: 1}}
      >
        Sign in with Facebook
      </Button>

    </Box>
  )
}