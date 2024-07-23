import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from 'wagmi';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
} from '@mui/material';

import { backendBaseUrl } from '../serverConfig';

const theme = createTheme({
    palette: {
      background: {
        paper: '#F1F8E8', 
        default: '#DAD3BE', 
      },
      text: {
        primary: '#254336', 
      },
    },
    typography: {
      fontFamily: 'Libre Baskerville Bold, Arial, sans-serif',
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#254336',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            backgroundColor: '#DAD3BE',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: '#6B8A7A',
            '&:hover': {
              backgroundColor: '#254336',
            },
          },
        },
      },
    },
});


function UserProfile() {
  const { address, isConnected } = useAccount();
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({
    WalletAddress: '',
    name: '',
    educationLevel: '',
    educationBackground: '',
    subject: '',
    workingIndustry: '',
    workingExperience: '',
    teachingStyle: '',
    learningStyle: '',
    LearningMaterialTextPercent: 33,
    LearningMaterialImagePercent: 33,
    LearningMaterialVideoPercent: 34,
    interests: '',
    remarks: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserProfile = async (walletAddress) => {
    try {
      const response = await axios.post(`${backendBaseUrl}/userInfo/queryUserBackgroundByAddress`, { WalletAddress: walletAddress });
      console.log('Fetched user data:', response.data);
      if (response.data && response.data.data && response.data.data.length > 0) {
        const userData = response.data.data[0];
        console.log('User data to set:', userData);
        const formattedData = {
          ...userData,
          WalletAddress: walletAddress,
          workingIndustry: userData.WorkIndustry || '',
          workingExperience: userData.WorkExperience || '',
          interests: userData.Interest || '',
          remarks: userData.Remarks || '',
          learningStyle: userData.LearningStyle || '',
          teachingStyle: userData.TeachingStyle || '',
          subject: userData.subject || '',
          educationBackground: userData.educationBackground || '',
        };
        setFormData(formattedData);
        setOriginalData(formattedData);
      } else {
        setFormData(prevState => ({ ...prevState, WalletAddress: walletAddress }));
        setOriginalData({});
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setErrorMessage('Failed to load user profile. Please try again.');
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchUserProfile(address);
    }
  }, [isConnected, address]);


  const fetchSubject = async (walletAddress) => {
    try {
      const response = await axios.post(`${backendBaseUrl}/userInfo/queryUserBackgroundByAddress`, { WalletAddress: walletAddress });
      if (response.data && response.data.data && response.data.data.length > 0) {
        const userData = response.data.data[0];
        if (userData.subject) {
          setFormData(prevState => ({
            ...prevState,
            subject: userData.subject
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching subject:', error);
    }
  };


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => {
      let newState = {
        ...prevState,
        [name]: value,
      };
  
      if (name === 'educationLevel') {
        if (value === 'highSchool') {
          newState.subject = '';
          newState.educationBackground = '';
        } else if (value === 'university' || value === 'college') {
          newState.subject = originalData.subject || '';
          newState.educationBackground = '';
        } else if (value === 'other') {
          newState.subject = '';
          newState.educationBackground = originalData.educationBackground || '';
        }
      }
  
      return newState;
    });
  };

  const saveUserBackground = async (data) => {
    try {
      const response = await axios.post(`${backendBaseUrl}/userInfo/storeUserBackground`, data);
      console.log('Profile saved:', response.data);
      setSuccessMessage('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrorMessage('Failed to save profile. Please try again.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataToSubmit = {
      ...formData,
      WorkIndustry: formData.WorkIndustry || formData.workingIndustry,
      WorkExperience: formData.WorkExperience || formData.workingExperience,
      Interest: formData.Interest || formData.interests,
      Remarks: formData.Remarks || formData.remarks,
      LearningStyle: formData.LearningStyle || formData.learningStyle,
      TeachingStyle: formData.TeachingStyle || formData.teachingStyle,
    };
  
    // Set irrelevant education fields to undefined
    if (dataToSubmit.educationLevel === 'highSchool') {
      dataToSubmit.subject = undefined;
      dataToSubmit.educationBackground = undefined;
    } else if (dataToSubmit.educationLevel === 'college' || dataToSubmit.educationLevel === 'university') {
      dataToSubmit.educationBackground = undefined;
    } else if (dataToSubmit.educationLevel === 'other') {
      dataToSubmit.subject = undefined;
    }
  
    console.log('Submitting data:', dataToSubmit);
    saveUserBackground(dataToSubmit).then(() => {
      setOriginalData(dataToSubmit); // Update originalData after successful save
    });
  };

  const resetForm = () => {
    setFormData(originalData);
  };

  const handleCloseSuccessMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage('');
  };

  const handleCloseErrorMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMessage('');
  };

  return (
    <ThemeProvider theme={theme}>
      {isConnected ? (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4}}>
            <Typography variant="h4" gutterBottom>
                User Profile
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl variant="filled" fullWidth>
                        <InputLabel id="education-level-label">Education Level</InputLabel>
                        <Select
                          labelId="education-level-label"
                          name="educationLevel"
                          value={formData.educationLevel}
                          onChange={handleChange}
                          required
                        >
                          <MenuItem value="highSchool">High School</MenuItem>
                          <MenuItem value="college">College</MenuItem>
                          <MenuItem value="university">University</MenuItem>
                          <MenuItem value="other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {formData.educationLevel === 'other' && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Specify Education"
                          name="educationBackground"
                          value={formData.educationBackground}
                          onChange={handleChange}
                          variant="filled"
                          required
                        />
                      </Grid>
                    )}
                    {(formData.educationLevel === 'university' || formData.educationLevel === 'college') && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Subject/Major"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          variant="filled"
                          required
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <FormControl variant="filled" fullWidth>
                        <InputLabel>Working Experience</InputLabel>
                        <Select
                          name="WorkExperience"
                          value={formData.WorkExperience || ''}
                          onChange={handleChange}
                          required
                        >
                          <MenuItem value="0-5">0 - 5 years</MenuItem>
                          <MenuItem value="5-10">5 - 10 years</MenuItem>
                          <MenuItem value="10+">Above 10 years</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Working Industry"
                        name="WorkIndustry"
                        value={formData.WorkIndustry || ''}
                        onChange={handleChange}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl variant="filled" fullWidth>
                        <InputLabel>Learning Style</InputLabel>
                        <Select
                          name="LearningStyle"
                          value={formData.LearningStyle || ''}
                          onChange={handleChange}
                          required
                        >
                          <MenuItem value="visual">Visual</MenuItem>
                          <MenuItem value="auditory">Auditory</MenuItem>
                          <MenuItem value="reading">Reading/Writing</MenuItem>
                          <MenuItem value="kinesthetic">Kinesthetic</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl variant="filled" fullWidth>
                        <InputLabel>Preferred Teaching Style</InputLabel>
                        <Select
                          name="TeachingStyle"
                          value={formData.TeachingStyle || ''}
                          onChange={handleChange}
                          required
                        >
                          <MenuItem value="structured">Structured</MenuItem>
                          <MenuItem value="interactive">Interactive</MenuItem>
                          <MenuItem value="explorative">Explorative</MenuItem>
                          <MenuItem value="practical">Practical</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Interests"
                        name="Interest"
                        value={formData.Interest || ''}
                        onChange={handleChange}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Remarks"
                        name="Remarks"
                        value={formData.Remarks || formData.remarks || ''}
                        onChange={handleChange}
                        variant="filled"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                          Save Profile
                        </Button>
                        <Button 
                          onClick={resetForm} 
                          variant="outlined" 
                          sx={{ 
                            color: '#ffffff', 
                            '&:hover': {
                              backgroundColor: '#FF2E63',
                              borderColor: '#FF2E63',
                              color: '#252A34',
                            }
                          }}
                        >
                          Cancel Changes
                        </Button>
                      </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4}}>
            <Typography variant="h6" align="center">
              Please connect your wallet to view and edit your profile.
            </Typography>
          </Paper>
        )}

        <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSuccessMessage}>
        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
        </Snackbar>

        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseErrorMessage}>
          <Alert onClose={handleCloseErrorMessage} severity="error" sx={{ width: '100%' }}>
            {errorMessage}
          </Alert>
        </Snackbar>
    </ThemeProvider>
  );
}

export default UserProfile;