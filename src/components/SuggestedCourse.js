import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button, TextField, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';

function SuggestedCourse({ courseTitle, initialCourseOutline = {}, walletAddress }) {
    const [messages, setMessages] = useState([
        { id: 1, text: `Welcome to ${courseTitle} course!`, sender: 'ai' },
        { id: 2, text: "I'll be your AI teacher for this course. Let's begin with the course outline.", sender: 'ai' },
        { id: 3, text: 'I will personalize the teaching style according to your saved user profile. Do you want to start?', sender: 'ai' },
    ]);
    const [started, setStarted] = useState(false);
    const [outline, setOutline] = useState({});
    const [progress, setProgress] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubtopic, setSelectedSubtopic] = useState('');

    const formatCourseOutline = (rawOutline) => {
        if (!rawOutline) return {};
        
        const formattedOutline = {};
        for (const [topic, subtopics] of Object.entries(rawOutline)) {
        formattedOutline[topic] = {};
        for (const [subtopic, content] of Object.entries(subtopics)) {
            formattedOutline[topic][subtopic] = {
            content: content,
            completed: false
            };
        }
        }
        return formattedOutline;
    };

    const handleStartLearning = async () => {
        try {
          const outlineToUse = initialCourseOutline || {};
          console.log('Outline being used:', outlineToUse);
      
          const formattedOutline = formatCourseOutline(outlineToUse);
          const response = await axios.post('http://localhost:5000/courseOutline/saveCourseOutline', {
            WalletAddress: walletAddress,
            courseName: courseTitle,
            courseOutline: formattedOutline
          });
            
            if (response.data && response.data.data && response.data.data.courseId) {
                const savedOutline = await axios.post('http://localhost:5000/courseOutline/queryCourseOutline', {
                WalletAddress: walletAddress,
                courseId: response.data.data.courseId
                });
                setOutline(savedOutline.data.data[0].courseOutline);
            }
            
            setStarted(true);
        }   catch (error) {
            console.error('Error saving or querying course outline:', error);
        }
    };

    useEffect(() => {
        console.log('Props received:', { 
        courseTitle, 
        initialCourseOutline: initialCourseOutline ? 'Present' : 'Missing', 
        walletAddress 
        });
        if (initialCourseOutline) {
        console.log('Initial Course Outline:', initialCourseOutline);
        }
    }, [courseTitle, initialCourseOutline, walletAddress]);

    const handleSendMessage = async (text) => {
        const newMessage = {
        id: messages.length + 1,
        text: text,
        sender: 'user',
        };
        setMessages([...messages, newMessage]);

        try {
        const response = await axios.post('/api/chatResponse', {
            message: text,
            courseOutline: outline,
            walletAddress
        });
        setMessages(prev => [...prev, {
            id: prev.length + 1,
            text: response.data.message,
            sender: 'ai'
        }]);
        } catch (error) {
        console.error('Error getting AI response:', error);
        }
    };

    const handleSubtitleClick = (subtopic) => {
        setSelectedSubtopic(subtopic);
        setOpenDialog(true);
    };

    const handleCheckboxChange = (topicKey, subtopicKey) => {
        const updatedOutline = {...outline};
        updatedOutline[topicKey][subtopicKey].completed = !updatedOutline[topicKey][subtopicKey].completed;
        setOutline(updatedOutline);

        const totalSubtopics = Object.values(outline).reduce((acc, topic) => acc + Object.keys(topic).length, 0);
        const completedSubtopics = Object.values(updatedOutline).reduce((acc, topic) => 
        acc + Object.values(topic).filter(subtopic => subtopic.completed).length, 0);
        setProgress((completedSubtopics / totalSubtopics) * 100);
    };

    const handleQuizClick = async (topicKey, subtopicKey) => {
        // Placeholder for future quiz functionality
        console.log(`Quiz for ${topicKey} - ${subtopicKey}`);
    };

    const filteredOutline = Object.entries(outline).filter(([topicKey, topicValue]) => 
        topicKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.entries(topicValue).some(([subtopicKey, subtopicValue]) => 
        subtopicKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subtopicValue.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Box display="flex" height="100vh">
        <Box flex={1} overflow="auto" display="flex" flexDirection="column">
            <ChatWindow messages={messages} />
            {!started ? (
            <Button 
                onClick={handleStartLearning}
                variant="contained"
                sx={{ alignSelf: 'center', mt: 2, mb: 2 }}
            >
                Start to learn
            </Button>
            ) : (
            <MessageInput onSendMessage={handleSendMessage} />
            )}
        </Box>
        <Box width={300} bgcolor="#f5f5f5" p={2} overflow="auto">
            <TextField 
            fullWidth 
            variant="outlined" 
            placeholder="Search topics..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
            />
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
            <Typography variant="subtitle1" gutterBottom>Course Outline</Typography>
            <List>
            {filteredOutline.map(([topicKey, topicValue]) => (
                <React.Fragment key={topicKey}>
                <ListItem>
                    <ListItemText primary={topicKey} />
                </ListItem>
                <List component="div" disablePadding>
                    {Object.entries(topicValue).map(([subtopicKey, subtopicValue]) => (
                    <ListItem key={subtopicKey} sx={{ pl: 4 }}>
                        <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={subtopicValue.completed || false}
                            onChange={() => handleCheckboxChange(topicKey, subtopicKey)}
                        />
                        </ListItemIcon>
                        <ListItemText 
                        primary={subtopicKey} 
                        secondary={subtopicValue.content}
                        onClick={() => handleSubtitleClick(subtopicKey)}
                        />
                        <Button onClick={() => handleQuizClick(topicKey, subtopicKey)}>Quiz</Button>
                    </ListItem>
                    ))}
                </List>
                </React.Fragment>
            ))}
            </List>
        </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Start this subtopic?</DialogTitle>
                <DialogContent>
                <Typography>Are you going to learn "{selectedSubtopic}" now?</Typography>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>No</Button>
                <Button onClick={() => {
                    setOpenDialog(false);
                    handleSendMessage(`Let's start learning about "${selectedSubtopic}"`);
                }}>Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SuggestedCourse;