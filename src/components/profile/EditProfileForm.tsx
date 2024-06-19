import React, { useState, useContext, useEffect } from 'react';
import {
  Button,
  TextField,
  Grid,
  Container,
  Box,
  Typography,
  Avatar,
  CssBaseline,
} from '@mui/material';
import { LockOutlined } from '@ant-design/icons';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';

import { getProfileInfo, updateProfileInfo } from 'profile/transport';
import { AuthContext, resetAuthContext } from 'contexts/auth/AuthContext';
import { UnauthorizedError } from 'errors/transport';


const PROFILE_INFO_CACHE_KEY = 'profileInfo';
const theme = createTheme();
const queryClient = new QueryClient();


const ProfileEditForm = () => {
  const authContext = useContext(AuthContext);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const profileInfoQuery = useQuery({ 
    queryKey: [PROFILE_INFO_CACHE_KEY], 
    queryFn: () => getProfileInfo(authContext.authInfo.authKey),
  });

  if (profileInfoQuery.isError) {
    if (profileInfoQuery.error instanceof UnauthorizedError) {
        resetAuthContext(authContext);
    }
  }

  const profileInfoMutation = useMutation({
    mutationFn: (vars) => updateProfileInfo(authContext.authInfo.authKey, vars)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValues = {
        ...formValues,
        [name]: value,
    };

    setFormValues(newValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    profileInfoMutation.mutate(
        formValues,
        {
            onSuccess: (values) => {
                queryClient.invalidateQueries({ queryKey: [ PROFILE_INFO_CACHE_KEY ] })

                const { firstName, lastName, email } = values.updateProfile.user;
                const authInfo = authContext.authInfo;

                authInfo.firstName = firstName;
                authInfo.lastName = lastName;

                authContext.setAuthInfo(authInfo);

            },
            onError: (error) => {
                if (error instanceof UnauthorizedError) {
                    resetAuthContext(authContext);
                }
            }
        }
    );
  };

  useEffect(() => {
    if (profileInfoQuery.isSuccess) {
        const { firstName, lastName, email } = profileInfoQuery.data.profile.user;

        if (JSON.stringify(formValues) !== JSON.stringify({ firstName, lastName, email })) {
            setFormValues({ firstName, lastName, email });
        }
    }
  }, [profileInfoQuery.data]);

  if (profileInfoQuery.isLoading) {
    return <span>Loading...</span>

  } else if (profileInfoQuery.isError) {
    return <span>Error: {profileInfoQuery.error.message}</span>

  } 

  if (profileInfoMutation.isLoading) {
    return <span>Loading...</span>

  } else if (profileInfoMutation.isError) {
    return <span>Error: {profileInfoMutation.error.message}</span>

  } 

  return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Edit Profile
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formValues.firstName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formValues.lastName}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    disabled
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
  );

};

export default ProfileEditForm;
