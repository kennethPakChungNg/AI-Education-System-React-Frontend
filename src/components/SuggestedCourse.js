import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button, TextField, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel 
} from '@mui/material';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';

function SuggestedCourse({ courseTitle, initialCourseOutline = {}, initialMessages = [], walletAddress, courseId }) {
    const [messages, setMessages] = useState(initialMessages.length > 0 ? initialMessages : [
        { id: 1, text: `Welcome to ${courseTitle} course!`, sender: 'ai' },
        { id: 2, text: "I'll be your AI teacher for this course. Let's begin with the course outline.", sender: 'ai' },
        { id: 3, text: 'I will personalize the teaching style according to your saved user profile. Do you want to start?', sender: 'ai' },
    ]);
    const [started, setStarted] = useState(initialMessages.length > 0);
    const [outline, setOutline] = useState({});
    const [progress, setProgress] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubtopic, setSelectedSubtopic] = useState({ topic: '', subtopic: '' });
    const [quizData, setQuizData] = useState(null);
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);

    const formatCourseOutline = (rawOutline) => {
        if (!rawOutline) return {};
        return rawOutline; 
    };

    // Formatting the AI response
    const formatAIResponse = (text) => {
        // Replace asterisks with HTML bold tags
        text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      
        // Remove dashes at the beginning of lines
        text = text.replace(/^-\s*/gm, '');
      
        // Split the text into sections
        const sections = text.split('###').filter(section => section.trim() !== '');
        
        // Format each section
        const formattedSections = sections.map(section => {
          const lines = section.split('\n').filter(line => line.trim() !== '');
          const title = lines[0].trim();
          const content = lines.slice(1).join('\n');
          
          // Add line breaks for numbered points
          const formattedContent = content.replace(/(\d+\.\s)/g, '<br><br>$1');
          
          return `<h3 class="ai-response-title">${title}</h3>\n${formattedContent}`;
        });
        
        // Join the formatted sections
        return formattedSections.join('\n\n');
    };

    //start conversation with AI
    const handleStartLearning = async () => {
        try {
          let currentOutline;    
          if (courseId) {
            currentOutline = await loadExistingCourse(courseId);
          } else {
            const formattedOutline = formatCourseOutline(initialCourseOutline);
            console.log('Formatted outline:', formattedOutline);
            const response = await axios.post('http://localhost:5000/courseOutline/saveCourseOutline', {
              WalletAddress: walletAddress,
              courseName: courseTitle,
              courseOutline: formattedOutline
            });
      
            console.log('Save course outline response:', response.data);
      
            if (response.data && response.data.data && response.data.data.courseId) {
              currentOutline = response.data.data;
            }
          }
      
          console.log('Current outline:', currentOutline);
      
          if (currentOutline && currentOutline.courseOutline) {
            setOutline(currentOutline);
            setStarted(true);
      
            const initialMessage = `Welcome to ${courseTitle} course! I'll be your AI teacher for this course. Let's begin with the course outline. I will personalize the teaching style according to your saved user profile. Do you want to start?`;
            await saveConversation('system', initialMessage, currentOutline.courseId, 'A', 'A.1');
      
            const topics = Object.keys(currentOutline.courseOutline);
            if (topics.length > 0) {
              const firstTopic = topics[0];
              const firstSubtopic = currentOutline.courseOutline[firstTopic].details[0];
              const firstSubtopicKey = Object.keys(firstSubtopic)[0];
              
              console.log('Outline before sending message:', currentOutline);
              await handleSendMessage(`Let's start learning about "${currentOutline.courseOutline[firstTopic].topic}: ${firstSubtopic[firstSubtopicKey]}"`, currentOutline);
            } else {
              console.error('No topics found in the course outline');
            }
          } else {
            console.error('Failed to load or create course outline');
          }
        } catch (error) {
          console.error('Error starting course:', error);
        }
    };

      
    const loadExistingCourse = useCallback(async (courseId) => {
        try {
            const response = await axios.post('http://localhost:5000/courseOutline/queryCourseOutline', {
                WalletAddress: walletAddress,
                courseId: courseId
            });
            if (response.data && response.data.data && response.data.data[0]) {
                const savedOutline = response.data.data[0];
                setOutline(savedOutline);
                setStarted(true);
                return savedOutline;
            }
        } catch (error) {
            console.error('Error loading existing course:', error);
        }
    }, [walletAddress]);


    useEffect(() => {
        if (courseId) {
            loadExistingCourse(courseId);
        } else {
            // Reset the state for a new course
            setOutline({});
            setStarted(false);
            setMessages([
                { id: 1, text: `Welcome to ${courseTitle} course!`, sender: 'ai' },
                { id: 2, text: "I'll be your AI teacher for this course. Let's begin with the course outline.", sender: 'ai' },
                { id: 3, text: 'I will personalize the teaching style according to your saved user profile. Do you want to start?', sender: 'ai' },
            ]);
        }
    }, [courseId, loadExistingCourse, courseTitle]);


    //Handle message between user and chatgpt api
    const handleSendMessage = async (text, outlineParam = null) => {
        console.log('handleSendMessage called with text:', text);
        const currentOutline = outlineParam || outline;
        console.log('Current outline:', currentOutline);
      
        const newMessage = {
          id: messages.length + 1,
          text: text,
          sender: 'user',
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
      
        try {
          if (!currentOutline || !currentOutline.courseOutline) {
            console.error('Course outline is not properly loaded', currentOutline);
            return;
          }
      
          let topicId, subTopicId;
          const match = text.match(/"([^:]+): ([^"]+)"/);
          if (match) {
            const [, topic, subtopic] = match;
            topicId = Object.keys(currentOutline.courseOutline).find(key => currentOutline.courseOutline[key].topic.trim() === topic.trim());
            subTopicId = currentOutline.courseOutline[topicId].details.findIndex(detail => Object.values(detail)[0].trim() === subtopic.trim());
            subTopicId = `${topicId}.${subTopicId + 1}`;
          } else {
            topicId = Object.keys(currentOutline.courseOutline)[0];
            subTopicId = 'A.1';
          }
      
          console.log('Resolved topicId:', topicId, 'subTopicId:', subTopicId);
      
          const requestData = {
            WalletAddress: walletAddress,
            CourseId: currentOutline.courseId,
            TopicId: topicId,
            SubTopicId: subTopicId,
            Message: text
          };
      
          console.log('Sending request to AI:', requestData);
      
          await saveConversation('user', text, currentOutline.courseId, topicId, subTopicId);
      
          const response = await axios.post('http://localhost:5000/aiGen/answerUserQuestion', requestData);
      
          console.log('AI response:', response.data);
      
          const aiMessage = {
            id: messages.length + 2,
            text: formatAIResponse(response.data.data),
            sender: 'ai'
          };
          setMessages(prev => [...prev, aiMessage]);
      
          await saveConversation('system', response.data.data, currentOutline.courseId, topicId, subTopicId);
        } catch (error) {
          console.error('Error in conversation:', error);
        }
    };


    const handleQuizSubmit = async () => {
        try {
          console.log("Trigger handleQuizSubmit method.");
          console.log("Current quizData:", quizData);
      
          const payload = {
            WalletAddress: walletAddress,
            CourseId: outline.courseId,
            TopicId: quizData.TopicId,
            SubTopicId: quizData.SubTopicId,
            QuizId: quizData.QuizId,
            SubmittedAnswer: Object.entries(quizAnswers).map(([index, answer]) => ({
              questionIndex: parseInt(index),
              answer
            }))
          };
      
          console.log("Payload being sent to server:", payload);
      
          const response = await axios.post('http://localhost:5000/quiz/calQuizResult', payload);
      
          console.log('Full response from server:', response);
      
          if (response.data && response.data.data) {
            console.log('Quiz results:', response.data.data);
            setQuizResults(response.data.data);
            if (response.data.data.CorrectPercentage >= 70) {
              handleCheckboxChange(quizData.TopicId, quizData.SubTopicId);
            }
          }
        } catch (error) {
          console.error('Error submitting quiz:', error);
          if (error.response) {
            console.error('Error response from server:', error.response.data);
          }
        }
    };

    //Handle user click any subtitle to learn
    const handleSubtitleClick = (topicKey, subtopicKey) => {
        setSelectedSubtopic({ topic: topicKey, subtopic: subtopicKey });
        setOpenDialog(true);
    };
    
    //Handle user confirm to start learning
    const handleDialogConfirm = () => {
        setOpenDialog(false);
        handleSendMessage(`Let's start learning about "${selectedSubtopic.topic}: ${selectedSubtopic.subtopic}"`);
    };

    //Handle user checkbox change
    const handleCheckboxChange = async (topicKey, subtopicKey) => {
        const updatedOutline = {...outline};
        const subtopicIndex = updatedOutline.courseOutline[topicKey].details.findIndex(detail => Object.keys(detail)[0] === subtopicKey);
        if (subtopicIndex !== -1) {
            updatedOutline.courseOutline[topicKey].details[subtopicIndex].completed = !updatedOutline.courseOutline[topicKey].details[subtopicIndex].completed;
        }
        setOutline(updatedOutline);
    
        const totalSubtopics = Object.values(outline.courseOutline).reduce((acc, topic) => acc + topic.details.length, 0);
        const completedSubtopics = Object.values(updatedOutline.courseOutline).reduce((acc, topic) => 
            acc + topic.details.filter(subtopic => subtopic.completed).length, 0);
        setProgress((completedSubtopics / totalSubtopics) * 100);
    
        try {
            await axios.post('http://localhost:5000/courseOutline/updateSubtopicCompletion', {
                WalletAddress: walletAddress,
                CourseId: outline.courseId,
                TopicId: topicKey,
                SubTopicId: subtopicKey,
                Completed: updatedOutline.courseOutline[topicKey].details[subtopicIndex].completed
            });
        } catch (error) {
            console.error('Error updating subtopic completion:', error);
        }
    };

    //conversation saving function
    const saveConversation = async (role, message, courseId, topicId, subTopicId) => {
        const payload = {
          WalletAddress: walletAddress,
          CourseId: courseId,
          TopicId: topicId,
          SubTopicId: subTopicId,
          Role: role,
          Message: message,
          ConversationTimestamp: Math.floor(Date.now() / 1000)
        };
        try {
          await axios.post('http://localhost:5000/conversation/saveSingleEduConversation', payload);
        } catch (error) {
          console.error('Error saving conversation:', error);
        }
    };

    //handle quiz click
    const handleQuizClick = async (topicKey, subtopicKey) => {
        setQuizAnswers({});
        try {
          const response = await axios.post('http://localhost:5000/aiGen/generateQuiz', {
            WalletAddress: walletAddress,
            CourseId: outline.courseId,
            TopicId: topicKey,
            SubTopicId: subtopicKey
          });
      
          if (response.data && response.data.data) {
            setQuizData({
              ...response.data.data,
              TopicId: topicKey,
              SubTopicId: subtopicKey
            });
            setQuizOpen(true);
          }
        } catch (error) {
          console.error('Error generating quiz:', error);
        }
    };

    //handle close quiz results
    const handleCloseQuizResults = () => {
        setQuizResults(null);
        setQuizOpen(false);
      };
    
    //handle quiz results
    const filteredOutline = Object.entries(outline?.courseOutline || {}).filter(([topicKey, topicValue]) => 
        topicKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topicValue.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (topicValue.details && topicValue.details.some(subtopic => 
            Object.keys(subtopic)[0].toLowerCase().includes(searchTerm.toLowerCase()) ||
            Object.values(subtopic)[0].toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    const renderQuizDialog = () => {
        if (!quizData) return null;
        return (
            <Dialog 
                open={quizOpen} 
                onClose={() => setQuizOpen(false)} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    style: {
                    backgroundColor: '#3A4D39',
                    color: 'white'
                    }
                }}
            >
                <DialogTitle>Quiz</DialogTitle>
                <DialogContent>
                    {quizData.Quiz.map((question, index) => (
                        <Box key={index} mb={3}>
                            <Typography variant="h6">{index + 1}. {question.question}</Typography>
                            <RadioGroup
                                value={quizAnswers[index] || ''}
                                onChange={(e) => setQuizAnswers({ ...quizAnswers, [index]: e.target.value })}
                            >
                                {Object.entries(question.choices).map(([key, value]) => (
                                    <FormControlLabel key={key} value={key} control={<Radio />} label={value} />
                                ))}
                            </RadioGroup>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button 
                    onClick={() => setQuizOpen(false)}
                    style={{
                        backgroundColor: '#6B8A7A',
                        color: 'white'
                    }}
                    >
                    Cancel
                    </Button>
                    <Button 
                    onClick={handleQuizSubmit} 
                    style={{
                        backgroundColor: '#6B8A7A',
                        color: 'white'
                    }}
                    >
                    Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    const renderQuizResults = () => {
        if (!quizResults) return null;
        return (
          <Dialog 
            open={!!quizResults} 
            onClose={() => setQuizResults(null)} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
              style: {
                backgroundColor: '#3A4D39',
                color: 'white'
              }
            }}
          >
            <DialogTitle>Quiz Results</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Score: {quizResults.CorrectPercentage.toFixed(2)}%</Typography>
              <Typography variant="body1">Correct Answers: {quizResults.correctCount} out of {quizResults.totalQuestions}</Typography>
              {quizResults.explanation.map((item, index) => (
                <Box key={index} mt={2}>
                  <Typography variant="subtitle1">Question {item.questionNo}: {item.question}</Typography>
                  <Typography color={item.isCorrect ? '#4CAF50' : '#F44336'}>
                    Your answer: {item.userAnswer}
                  </Typography>
                  <Typography>{item.explanation}</Typography>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleCloseQuizResults}
                    style={{
                        backgroundColor: '#6B8A7A',
                        color: 'white'
                    }}
                    >
                    Close
                </Button>
            </DialogActions>
          </Dialog>
        );
    };


    return (
        <Box display="flex" height="100vh">
            <Box flex={1} overflow="auto" display="flex" flexDirection="column">
                <ChatWindow messages={messages} />
                {started ? (
                <MessageInput onSendMessage={(text) => handleSendMessage(text)} />
                ) : (
                <Button 
                    onClick={handleStartLearning}
                    variant="contained"
                    sx={{ alignSelf: 'center', mt: 2, mb: 2 }}
                >
                    Start to learn
                </Button>
                )}
            </Box>
            <Box width={400} bgcolor="#1a2f26" color="#ffffff" p={2} overflow="auto">
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    placeholder="Search topics..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#ffffff',
                        },
                        '&:hover fieldset': {
                            borderColor: '#ffffff',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#ffffff',
                        },
                        },
                        '& .MuiInputBase-input': {
                        color: '#ffffff',
                        },
                        '& .MuiInputLabel-root': {
                        color: '#ffffff',
                        },
                    }}
                />
                <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
                <Typography variant="subtitle1" gutterBottom color="#EBE3D5" fontSize={"28px"} >Course Outline</Typography>
                <List>
                    {filteredOutline && filteredOutline.length > 0 ? (
                        filteredOutline.map(([topicKey, topicValue]) => (
                            <React.Fragment key={topicKey}>
                                <ListItem>
                                    <ListItemText primary={topicValue.topic} />
                                </ListItem>
                                <List component="div" disablePadding>
                                    {topicValue.details && topicValue.details.map((subtopic, index) => {
                                        const subtopicKey = Object.keys(subtopic)[0];
                                        const subtopicContent = subtopic[subtopicKey];
                                        return (
                                            <ListItem key={subtopicKey} sx={{ pl: 4 }}>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={subtopic.completed || false}
                                                        onChange={() => handleCheckboxChange(topicKey, subtopicKey)}
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
                                                    onClick={() => handleSubtitleClick(topicKey, subtopicKey)}
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
                                                    onClick={() => handleQuizClick(topicKey, subtopicKey)}
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
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText 
                                primary="No course outline available or no matches found." 
                                sx={{ 
                                    color: '#ffffff',
                                }}
                            />
                        </ListItem>
                    )}
                </List>
            </Box>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Start this subtopic?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you going to learn "{selectedSubtopic.topic}: {selectedSubtopic.subtopic}" now?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>No</Button>
                    <Button onClick={handleDialogConfirm}>Yes</Button>
                </DialogActions>
            </Dialog>
            {renderQuizDialog()}
            {renderQuizResults()}
        </Box>
    );
    
}

export default SuggestedCourse;
