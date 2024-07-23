import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button } from '@mui/material';

function CourseOutlineDisplay({ outline, onCheckboxChange, onQuizClick }) {
  return (
    <Box width={400} bgcolor="#1a2f26" color="#ffffff" p={2} overflow="auto">
      <Typography variant="subtitle1" gutterBottom color="#EBE3D5" fontSize={"28px"}>Course Outline</Typography>
      <List>
        {Object.entries(outline).map(([topicKey, topicValue]) => (
          <React.Fragment key={topicKey}>
            <ListItem>
              <ListItemText primary={topicValue.topic} />
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
                            color: '#ffffff',
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
                          color: '#ffffff',
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
    </Box>
  );
}

export default CourseOutlineDisplay;