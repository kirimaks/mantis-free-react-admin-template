import PropTypes from 'prop-types';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { useMutation } from '@tanstack/react-query';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import AnimateButton from 'components/@extended/AnimateButton';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import FirebaseSocial from './FirebaseSocial';

import { AuthContext } from 'contexts/auth/AuthContext';

import { signIn } from 'auth/transport/user';
import { getGQLError } from 'errors/transport';

import { AUTH_INFO_KEY } from 'config';

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const authContext = React.useContext(AuthContext);
  const [isFormSubmitted, setFormIsSubmitted] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // TODO:
  const mutation = useMutation({
    mutationFn: signIn
  });

  const submitForm = (values, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    mutation.mutate(
        values,
        {
            onSuccess: (values) => {
                console.log(`Values: ${JSON.stringify(values)}`);
                const authInfo = {
                    authKey: values['signIn']['jwt_token'],
                    authEnds: Date.now() + (60000 * 5), // TODO: return from api
                };
                window.localStorage.setItem(AUTH_INFO_KEY, JSON.stringify(authInfo));

                authContext.setIsAuthenticated(true);
                setFormIsSubmitted(true);  // TODO: should be not required
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

  if (isFormSubmitted) {
    return <Navigate to="/" replace />;

  } else {
      return (
        <>
          <Formik
            initialValues={{
              email: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={ submitForm }
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-login">Email Address</InputLabel>
                      <OutlinedInput
                        id="email-login"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        fullWidth
                        error={Boolean(touched.email && errors.email)}
                      />
                    </Stack>
                    {touched.email && errors.email && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-login">Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="-password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        placeholder="Enter password"
                      />
                    </Stack>
                    {touched.password && errors.password && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.password}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sx={{ mt: -1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            onChange={(event) => setChecked(event.target.checked)}
                            name="checked"
                            color="primary"
                            size="small"
                          />
                        }
                        label={<Typography variant="h6">Keep me sign in</Typography>}
                      />
                      <Link variant="h6" component={RouterLink} color="text.primary">
                        Forgot Password?
                      </Link>
                    </Stack>
                  </Grid>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                        Login
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider>
                      <Typography variant="caption"> Login with</Typography>
                    </Divider>
                  </Grid>
                  <Grid item xs={12}>
                    <FirebaseSocial />
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </>
      );
    }
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };
