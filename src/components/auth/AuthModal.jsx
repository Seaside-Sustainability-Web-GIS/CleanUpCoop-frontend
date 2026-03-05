import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import { signInWithEmail, signUpNewUser } from 'src/services/authService.js';
import SignUpForm from 'src/components/auth/SignUpForm.jsx';
import SignInForm from 'src/components/auth/SignInForm.jsx';

export default function AuthModal({
  isAuthOpen,
  setAuthOpen
}) {
  const [authMode, setAuthMode] = useState('signin');
  
  const handleSignin = async ({ email, password }) => {
    const { data, error } = await signInWithEmail({
      email,
      password
    })

    if (data) {
      console.log('Login successful!');
      setAuthOpen(false);
    }

    if (error) {
      console.error('Login failed', error);
    }

      // if (response.success) {
      //   console.log('User is logged in');
      // }
      
      // if (response.success) {
      //   showSnackbar(SNACKBAR_MESSAGES.LOGIN_SUCCESS, SNACKBAR_SEVERITIES.SUCCESS);
      //   setAuthOpen(false);
      // } else {
      //   const errorMessage =
      //     response?.errors?.[0]?.message ||
      //     `${SNACKBAR_MESSAGES.LOGIN_FAILURE}${response.message ? `: ${response.message}` : ''}`;
      //     showSnackbar(errorMessage, SNACKBAR_SEVERITIES.ERROR);
      //   }
      // } catch (err) {
      //   console.error("Login failed:", err);
        // showSnackbar("Unexpected error during login. Please try again.", SNACKBAR_SEVERITIES.ERROR);
      // }
  };

  const handleSignup = async ({ first_name, last_name, email, password }) => {
    const { data, error } = await signUpNewUser({
      first_name,
      last_name,
      email,
      password
    });

    if (data) {
      console.log('Sign up successful', data);
      setAuthOpen(false);
    }

    if (error) {
      console.error('Sign up failed', error);
    }
  }

  return (
    <Dialog open={isAuthOpen} maxWidth="xs" onClose={() => setAuthOpen(false)}>
      <DialogActions>
        <Button onClick={() => setAuthOpen(false)} color="primary" sx={{justifyContent: 'flex-end', p: 0}}>
            <CloseIcon />
        </Button>
      </DialogActions>
      <DialogTitle variant="h4" sx={{px: 3, pt: 0}}>
          {authMode === 'signin' ? 'Sign In' : 'Sign Up'}
      </DialogTitle>
      <DialogContent>
        {
          authMode === 'signin' ? (
            <SignInForm 
              onSignin={handleSignin}
              setAuthMode={setAuthMode} 
            />
          ) : (
            <SignUpForm 
              onSignup={handleSignup}
              setAuthMode={setAuthMode} 
            />
          )
        }
        {/* <AuthForm
          closeAuth={() => setAuthOpen(false)}
          isSignin={isSignin}
          setIsSignin={setIsSignin}
          openForgotPassword={() => {
            setAuthOpen(false);
            setForgotPasswordOpen(true);
          }}
          onLogin={handleLogin}
          onSignup={handleSignup}
        /> */}
      </DialogContent>
    </Dialog>
  )
}