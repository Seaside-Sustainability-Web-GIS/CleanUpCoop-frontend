import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';

const VerifyEmail = ({ closeVerifyEmail }) => {
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  const handleResendEmail = async () => {
    setResending(true);
    setMessage('');
    try
      // TODO: Replace this simulated API call with your actual API call to resend the email.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('Verification email resent. Please check your inbox.');
    } catch (error) {
      console.error("Error resending verification email:", error);
      setMessage('Failed to resend verification email. Please try again later.');
    }
    setResending(false);
  };

  return (
    <Box textAlign="center" p={2}>
      <Typography variant="h6">Verify Your Email</Typography>
      <Typography variant="body1" style={{ marginTop: '1rem' }}>
        Thank you for signing up! A verification email has been sent to your email address.
        Please check your email and click the confirmation link to activate your account.
      </Typography>
      {message && (
        <Typography variant="body2" color="secondary" style={{ marginTop: '1rem' }}>
          {message}
        </Typography>
      )}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleResendEmail}
          disabled={resending}
        >
          {resending ? 'Resending...' : 'Resend Verification Email'}
        </Button>
      </Box>
      <Box mt={2}>
        <Button onClick={closeVerifyEmail} color="primary">
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyEmail;
