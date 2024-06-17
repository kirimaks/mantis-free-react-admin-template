import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

import { createUser } from 'auth/transport/user';
import { getGQLError } from 'errors/transport';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // TODO:
  const mutation = useMutation({
        mutationFn: createUser,
  });

  const formSubmit = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);

    mutation.mutate(
        values, 
        {
            onSuccess: () => {
                setIsFormSubmitted(true);
            },
            onError: (error) => {
                const errorMessage = getGQLError(error);
                setErrors({ submit: errorMessage });
            },
            onSettled: () => {
                setSubmitting(false);
            }
        }
    );
  };
  // TODO:

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  if (isFormSubmitted) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          accountName: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().max(255).required('First Name is required'),
          lastName: Yup.string().max(255).required('Last Name is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required'),
          accountName: Yup.string().max(255).required('Account name is required'),
        })}
        onSubmit={ formSubmit }
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="firstName-signup">First Name*</InputLabel>
                  <OutlinedInput
                    id="firstName-login"
                    type="firstName"
                    value={values.firstName}
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="John"
                    fullWidth
                    error={Boolean(touched.firstName && errors.firstName)}
                  />
                </Stack>
                {touched.firstName && errors.firstName && (
                  <FormHelperText error id="helper-text-firstName-signup">
                    {errors.firstName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="lastName-signup">Last Name*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.lastName && errors.lastName)}
                    id="lastName-signup"
                    type="lastName"
                    value={values.lastName}
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Doe"
                    inputProps={{}}
                  />
                </Stack>
                {touched.lastName && errors.lastName && (
                  <FormHelperText error id="helper-text-lastName-signup">
                    {errors.lastName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="accountName-signup">Account name</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.accountName && errors.accountName)}
                    id="accountName-signup"
                    value={values.accountName}
                    name="accountName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Demo Inc."
                    inputProps={{}}
                  />
                </Stack>
                {touched.accountName && errors.accountName && (
                  <FormHelperText error id="helper-text-accountName-signup">
                    {errors.accountName}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="demo@company.com"
                    inputProps={{}}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-signup">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                    inputProps={{}}
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Create Account
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
