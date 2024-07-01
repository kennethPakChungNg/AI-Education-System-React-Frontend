import React, { useState } from 'react';
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
} from '@mui/material';


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
  const [formData, setFormData] = useState({
    name: '',
    educationLevel: '',
    otherEducation: '',
    subject: '',
    workingExperience: '',
    workingIndustry: '',
    learningStyle: '',
    teachingStyle: '',
    interests: '',
    remarks: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Here you would typically send this data to your backend
  };

  return (
    <ThemeProvider theme={theme}>
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
                            sx={{
                            '& .MuiSelect-select': {
                                padding: '16.5px 14px',
                                lineHeight: '1.4375em',
                            },
                            }}
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
                                name="otherEducation"
                                value={formData.otherEducation}
                                onChange={handleChange}
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
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="filled" fullWidth>
                            <InputLabel>Working Experience</InputLabel>
                            <Select
                                name="workingExperience"
                                value={formData.workingExperience}
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
                        name="workingIndustry"
                        value={formData.workingIndustry}
                        onChange={handleChange}
                        variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl variant="filled" fullWidth>
                            <InputLabel>Learning Style</InputLabel>
                            <Select
                                name="learningStyle"
                                value={formData.learningStyle}
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
                                name="teachingStyle"
                                value={formData.teachingStyle}
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
                        name="interests"
                        value={formData.interests}
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
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        variant="filled"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save Profile
                        </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </ThemeProvider>
  );
}

export default UserProfile;