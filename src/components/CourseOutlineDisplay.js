import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const ScrollableBox = styled(Box)(({ theme }) => ({
  width: 400,
  backgroundColor: '#1a2f26',
  color: '#ffffff',
  padding: theme.spacing(2),
  overflowY: 'auto',
  height: '100vh', // Adjust this value as needed
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#6B8A7A',
    borderRadius: '4px',
    '&:hover': {
      background: '#5A7A6A',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#6B8A7A rgba(255, 255, 255, 0.1)',
}));

function CourseOutlineDisplay({ outline, onCheckboxChange, onQuizClick }) {
  return (
    <ScrollableBox>
      <Typography variant="subtitle1" gutterBottom color="#EBE3D5" fontSize={"28px"}>Course Outline</Typography>
      <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}/>
      <List>
        {Object.entries(outline).map(([topicKey, topicValue]) => (
          <React.Fragment key={topicKey}>
            <ListItem>
              <ListItemText primary={topicValue.topic} sx={{ color: '#EBE3D5' }} />
            </ListItem>
            <List component="div" disablePadding>
              {topicValue.details.map((subtopic, index) => {
                const subtopicKey = Object.keys(subtopic)[0];
                const subtopicContent = subtopic[subtopicKey];
                return (
                  <ListItem key={subtopicKey} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={subtopic.isCompleted || false}
                        onChange={() => onCheckboxChange(topicKey, subtopicKey)}
                        sx={{
                          color: '#ffffff',
                          '&.Mui-checked': {
                            color: '#6B8A7A',
                          }
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={subtopicKey} 
                      secondary={subtopicContent}
                      sx={{ 
                        cursor: 'pointer',
                        '& .MuiListItemText-primary': {
                          color: '#ffffff',
                        },
                        '& .MuiListItemText-secondary': {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                    />
                    <Button 
                      onClick={() => onQuizClick(topicKey, subtopicKey)}
                      sx={{
                        backgroundColor: '#6B8A7A',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#5A7A6A',
                        },
                      }}
                    >
                      Quiz
                    </Button>
                  </ListItem>
                );
              })}
            </List>
          </React.Fragment>
        ))}
      </List>
    </ScrollableBox>
  );
}

export default CourseOutlineDisplay;