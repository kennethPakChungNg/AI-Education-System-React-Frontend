import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Box, Typography, List, ListItem, ListItemIcon, ListItemText, Checkbox, Button, TextField, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel, CircularProgress 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import { backendBaseUrl } from '../serverConfig';
import { styled } from '@mui/material/styles';

const ScrollableOutline = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
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

const LoadingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: '#ffffff',
  backgroundColor: '#1a2f26',
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#3A4D39',
    color: '#ffffff',
  },
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3),
}));

const StyledCircularProgress = styled(CircularProgress)({
  color: '#6B8A7A',
});

function SuggestedCourse({ courseTitle, initialCourseOutline = {}, walletAddress, courseId }) {
    const defaultMessages = useMemo(() => [
      { id: 1, text: `Welcome to ${courseTitle} course!`, sender: 'ai' },
      { id: 2, text: "I'll be your AI teacher for this course. Let's begin with the course outline.", sender: 'ai' },
      { id: 3, text: 'I will personalize the teaching style according to your saved user profile. Do you want to start?', sender: 'ai' },
    ], [courseTitle]);
    
    const [messages, setMessages] = useState(defaultMessages);
    const [started, setStarted] = useState(false);
    const [courseLoaded, setCourseLoaded] = useState(false);
    const [outline, setOutline] = useState({});
    const [progress, setProgress] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubtopic, setSelectedSubtopic] = useState({ topic: '', subtopic: '' });
    const [quizData, setQuizData] = useState(null);
    const [quizOpen, setQuizOpen] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);
    const [isAIResponding, setIsAIResponding] = useState(false);
    const [isQuizGenerating, setIsQuizGenerating] = useState(false);
    const [isCalculatingResults, setIsCalculatingResults] = useState(false);
    

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

    const loadExistingCourse = useCallback(async (courseId) => {
        try {
            const [outlineResponse, conversationResponse] = await Promise.all([
                axios.post(`${ backendBaseUrl }/courseOutline/queryCourseOutline`, {
                    WalletAddress: walletAddress,
                    courseId: courseId
                }),
                axios.post(`${backendBaseUrl}/conversation/queryEduConversation`, {
                    WalletAddress: walletAddress,
                    CourseId: courseId,
                    TopicId: 'A',
                    SubTopicId: 'A.1'
                })
            ]);

            if (outlineResponse.data && outlineResponse.data.data && outlineResponse.data.data[0]) {
                const savedOutline = outlineResponse.data.data[0];
                setOutline(savedOutline);
                setCourseLoaded(true);

                if (conversationResponse.data && conversationResponse.data.data) {
                    const formattedMessages = conversationResponse.data.data.map(conv => ({
                        id: conv._id,
                        text: conv.Role === 'system' ? formatAIResponse(conv.Message) : conv.Message,
                        sender: conv.Role === 'system' ? 'ai' : 'user'
                    }));
                    setMessages(formattedMessages);
                } else {
                    setMessages(defaultMessages);
                }

                return savedOutline;
            }
        } catch (error) {
            console.error('Error loading existing course:', error);
        }
    }, [walletAddress, defaultMessages]);


    useEffect(() => {
      if (courseId) {
          loadExistingCourse(courseId);
      } else {
          setOutline(initialCourseOutline);
          setCourseLoaded(true);
          setMessages(defaultMessages);
      }
    }, [courseId, loadExistingCourse, initialCourseOutline, defaultMessages]);


    //start conversation with AI
    const handleStartLearning = async () => {
        setStarted(true);
        try {
            console.log('Starting course:', courseTitle);
            let currentOutline = outline;

            if (!courseId) {
                const response = await axios.post(`${backendBaseUrl}/courseOutline/saveCourseOutline`, {
                    WalletAddress: walletAddress,
                    courseName: courseTitle,
                    courseOutline: currentOutline
                });

                console.log('Save course outline response:', response.data);

                if (response.data && response.data.data && response.data.data.courseId) {
                    currentOutline = response.data.data;
                    setOutline(currentOutline);
                }
            }

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
        } catch (error) {
            console.error('Error starting course:', error);
        }
    };


    //Handle message between user and chatgpt api
    const handleSendMessage = async (text, withImage = false) => {
      console.log('handleSendMessage called with text:', text);
      const currentOutline = outline;
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
    
        setIsAIResponding(true);
        const response = await axios.post(`${backendBaseUrl}/aiGen/answerUserQuestion`, requestData);
    
        let imageData = null;
        if (withImage) {
          try {
            const imageResponse = await axios.post(`${backendBaseUrl}/aiGen/genEducateImage`, requestData);
            imageData = imageResponse.data.data.images[0];
            console.log('AI image response:', imageData);
          } catch (imageError) {
            console.error('Error generating image:', imageError);
          }
        }
    
        setIsAIResponding(false);
    
        console.log('AI response:', response.data);
    
        const aiMessage = {
          id: messages.length + 2,
          text: formatAIResponse(response.data.data),
          sender: 'ai',
          image: imageData
        };
        setMessages(prev => [...prev, aiMessage]);
    
        await saveConversation('system', response.data.data, currentOutline.courseId, topicId, subTopicId);
      } catch (error) {
        console.error('Error in conversation:', error);
        setIsAIResponding(false);
      }
    };


    const handleQuizSubmit = async () => {
        setIsCalculatingResults(true);
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
      
          const response = await axios.post(`${backendBaseUrl}/quiz/calQuizResult`, payload);
      
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
        } finally {
          setIsCalculatingResults(false);
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
      try {
        console.log("trigger handleCheckboxChange method.");
        const updatedOutline = {...outline};
        const subtopicIndex = updatedOutline.courseOutline[topicKey].details.findIndex(detail => Object.keys(detail)[0] === subtopicKey);
        if (subtopicIndex !== -1) {
          const newCompletionStatus = !updatedOutline.courseOutline[topicKey].details[subtopicIndex].isCompleted;
          updatedOutline.courseOutline[topicKey].details[subtopicIndex].isCompleted = newCompletionStatus;
          setOutline(updatedOutline);

          const totalSubtopics = Object.values(updatedOutline.courseOutline).reduce((acc, topic) => acc + topic.details.length, 0);
          const completedSubtopics = Object.values(updatedOutline.courseOutline).reduce((acc, topic) => 
            acc + topic.details.filter(subtopic => subtopic.isCompleted).length, 0);
          setProgress((completedSubtopics / totalSubtopics) * 100);

          console.log('Updated outline for isCompleted:', updatedOutline);

          await axios.post(`${backendBaseUrl}/courseOutline/updateLearningStatus`, {
            WalletAddress: walletAddress,
            CourseId: outline.courseId,
            TopicId: topicKey,
            SubTopicId: subtopicKey,
            isCompleted: newCompletionStatus
          });
        }
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
          await axios.post(`${backendBaseUrl}conversation/saveSingleEduConversation`, payload);
        } catch (error) {
          console.error('Error saving conversation:', error);
        }
    };

    //handle quiz click
    const handleQuizClick = async (topicKey, subtopicKey) => {
        setQuizAnswers({});
        setIsQuizGenerating(true);
        try {
          const response = await axios.post(`${backendBaseUrl}/aiGen/generateQuiz`, {
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
        } finally {
          setIsQuizGenerating(false);
        }
    };

    //handle close quiz results
    const handleCloseQuizResults = () => {
        setQuizResults(null);
        setQuizOpen(false);
      };
    
    //handle search function in course outline
    const filteredOutline = Object.entries(outline?.courseOutline || {}).filter(([topicKey, topicValue]) => {
      const topicMatches = topicValue.topic.toLowerCase().includes(searchTerm.toLowerCase());
      const subtopicMatches = topicValue.details.some(subtopic => {
        const subtopicKey = Object.keys(subtopic)[0];
        const subtopicContent = subtopic[subtopicKey];
        return subtopicKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subtopicContent.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return topicMatches || subtopicMatches;
    }).map(([topicKey, topicValue]) => {
      if (searchTerm === '' || topicValue.topic.toLowerCase().includes(searchTerm.toLowerCase())) {
        // If search term is empty or the topic matches, return all subtopics
        return [topicKey, topicValue];
      } else {
        // If topic doesn't match, filter subtopics
        return [
          topicKey,
          {
            ...topicValue,
            details: topicValue.details.filter(subtopic => {
              const subtopicKey = Object.keys(subtopic)[0];
              const subtopicContent = subtopic[subtopicKey];
              return subtopicKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     subtopicContent.toLowerCase().includes(searchTerm.toLowerCase());
            })
          }
        ];
      }
    });

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
          <Box flex={1} sx={{ backgroundColor: '#f1f8e8' }} overflow="auto" display="flex" flexDirection="column">
              <ChatWindow messages={messages} />
              {isAIResponding && (
                  <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                      <LoadingIndicator 
                      sx={{
                          backgroundColor: '#6b8a7a',
                          color: '#ffffff',
                      }}
                      >
                          <StyledCircularProgress 
                          sx={{
                              backgroundColor: '#6b8a7a',
                              color: '#ffffff',
                          }}
                          size={20} 
                          />
                          <Typography ml={2}>AI is thinking...</Typography>
                      </LoadingIndicator>
                  </Box>
              )}
              {courseLoaded && !started ? (
                  <Button 
                      onClick={handleStartLearning}
                      variant="contained"
                      sx={{ 
                        alignSelf: 'center', 
                        mt: 2, 
                        mb: 2,
                        backgroundColor: '#6b8a7a',
                      }}
                  >
                      Start to learn
                  </Button>
              ) : started ? (
                  <MessageInput onSendMessage={(text) => handleSendMessage(text)} />
              ) : null}
          </Box>
          {started && (
            <Box width={400} bgcolor="#1a2f26" color="#ffffff" display="flex" flexDirection="column" height="100%">
              <Box p={2}>
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
                <hr/>
              </Box>
              <ScrollableOutline>
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
                                    checked={subtopic.isCompleted || false}
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
              </ScrollableOutline>
            </Box>
          )}
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
          <StyledDialog open={isQuizGenerating}>
              <StyledDialogContent>
                  <StyledCircularProgress size={20} />
                  <Typography ml={2}>Generating quiz...</Typography>
              </StyledDialogContent>
          </StyledDialog>
          <StyledDialog open={isCalculatingResults}>
              <StyledDialogContent>
                  <StyledCircularProgress size={20} />
                  <Typography ml={2}>Calculating results...</Typography>
              </StyledDialogContent>
          </StyledDialog>
          {renderQuizDialog()}
          {renderQuizResults()}
      </Box>
    );
    
}

export default SuggestedCourse;
