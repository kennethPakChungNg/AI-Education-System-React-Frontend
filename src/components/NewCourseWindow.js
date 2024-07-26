import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress } from '@mui/material';
import Message from './Message';
import MessageInput from './MessageInput';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const LoadingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: '#ffffff',
  backgroundColor: '#1a2f26',
}));

const StyledCircularProgress = styled(CircularProgress)({
  color: '#6B8A7A',
});

const ScrollableBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#B7B597',
    borderRadius: '4px',
    '&:hover': {
      background: '#A5A384',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#B7B597 transparent',
}));

function NewCourseWindow({ messages, setMessages, newCourseState, setNewCourseState, onGenerateCourseOutline, onModifyCourseOutline, onStartWithCourseOutline, address }) {
  const [topic, setTopic] = useState('');
  const [modification, setModification] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const messagesEndRef = useRef(null);
  const [courseId, setCourseId] = useState(null);
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [currentSubTopicId, setCurrentSubTopicId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    console.log('Current newCourseState:', newCourseState);
  }, [newCourseState]);


  const saveConversation = async (role, message, courseId, topicId, subTopicId) => {
    const payload = {
      WalletAddress: address,
      CourseId: courseId,
      TopicId: topicId,
      SubTopicId: subTopicId,
      Role: role,
      Message: message,
      ConversationTimestamp: Math.floor(Date.now() / 1000)
    };
    try {
      await axios.post(`${backendBaseUrl}/conversation/saveSingleEduConversation`, payload);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  // Formatting the AI response
  const formatAIResponse = (text) => {
    // Remove asterisks
    text = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Split into sections
    const sections = text.split('###').filter(section => section.trim() !== '');
    
    const formattedSections = sections.map(section => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n');
      
      const formattedContent = content
        .replace(/(\d+\.\s)/g, '<br><br>$1')
        .replace(/([A-Z][^.!?]+[.!?])\s/g, '$1<br><br>')
        .replace(/(-\s)/g, '<br>• ');
      
      return `<h3 style="color: #FFD700; margin-bottom: 10px;">${title}</h3>\n${formattedContent}`;
    });
    
    return formattedSections.join('<br><br>');
  };

  const handleSendMessage = async (text, withImage) => {
    setIsLoading(true);
    try {
      console.log('handle send message in NewCourseWindow.js');
      const newMessage = { id: messages.length + 1, text, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      console.log('Sending message:', text);
  
      // Save user message
      await saveConversation('user', text, courseId, currentTopicId, currentSubTopicId);
  
      const textResponse = await axios.post(`${backendBaseUrl}/aiGen/answerUserQuestion`, {
        WalletAddress: address,
        CourseId: courseId,
        TopicId: currentTopicId,
        SubTopicId: currentSubTopicId,
        Message: text
      });
  
      console.log('AI response:', textResponse.data.data);
  
      let imageData = null;
      if (withImage) {
        try {
          const imageResponse = await axios.post(`${backendBaseUrl}/aiGen/genEducateImage`, {
            WalletAddress: address,
            CourseId: courseId,
            TopicId: currentTopicId,
            SubTopicId: currentSubTopicId,
            Message: text
          });
          imageData = imageResponse.data.data.images[0];  // Assuming the image is in this format
          console.log('AI image response:', imageData);
        } catch (imageError) {
          console.error('Error generating image:', imageError);
        }
      }
  
      const aiMessage = {
        id: messages.length + 2,
        text: formatAIResponse(textResponse.data.data),
        sender: 'ai',
        image: imageData
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
  
      // Save AI response
      await saveConversation('system', textResponse.data.data, courseId, currentTopicId, currentSubTopicId);
  
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Paper 
        elevation={3} 
        sx={{ 
          flexGrow: 1,
          overflowY: 'auto', 
          padding: 2,
          backgroundColor: '#254336',
        }}
      >
        <ScrollableBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {messages.map(msg => (
            <Message 
              key={msg.id} 
              text={msg.text} 
              sender={msg.sender} 
              image={msg.image}
              style={msg.sender === 'ai' && msg.text.includes('course outline') ? { whiteSpace: 'pre-wrap' } : {}}
            />
          ))}
          <div ref={messagesEndRef} />
        </ScrollableBox>
      </Paper>
      <Box sx={{ p: 2, backgroundColor: '#f1f8e8' }}>
        {newCourseState === 'initial' && (
          <Box sx={{ display: 'flex', gap: 2, height: '55px'}}>
            <TextField
              fullWidth
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the topic you want to learn"
              sx={{ 
                backgroundColor: '#254336',
                input: { color: 'white' }, 
                borderRadius: '5px'
              }}
            />
            <Button variant="contained" 
              size="small" 
              sx={{
                backgroundColor: '#6b8a7a',
              }}  
              onClick={() => {
                onGenerateCourseOutline(topic);
                setTopic('');
              }}>
              Generate Course Outline
            </Button>
          </Box>
        )}
        {newCourseState === 'outline-generated' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={modification}
              onChange={(e) => setModification(e.target.value)}
              placeholder="Describe how you want to modify the outline"
              sx={{ 
                backgroundColor: '#254336',
                input: { color: 'white' }
              }}
            />
            <Button variant="contained" size="small" 
              sx={{
                backgroundColor: '#6b8a7a',
              }} 
              onClick={() => {
                onModifyCourseOutline(modification);
                setModification('');
              }}>
              Modify Course Outline
            </Button>
            <Button variant="contained" size="small" 
              sx={{
                backgroundColor: '#6b8a7a',
              }} 
              onClick={() => setSaveDialogOpen(true)}
            >
              Start With Course Outline
            </Button>
          </Box>
        )}
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <LoadingIndicator sx={{ backgroundColor: '#6b8a7a', color: '#ffffff' }}>
              <StyledCircularProgress sx={{ backgroundColor: '#6b8a7a', color: '#ffffff' }} size={20} />
              <Typography ml={2}>AI is thinking...</Typography>
            </LoadingIndicator>
          </Box>
        )}
        {newCourseState === 'learning' && (
          <MessageInput onSendMessage={handleSendMessage} />
        )}
      </Box>
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Course Outline</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Course Name"
            type="text"
            fullWidth
            variant="standard"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            onStartWithCourseOutline(courseName, async (newCourseId, firstTopic, firstSubtopic) => {
              setCourseId(newCourseId);
              setCurrentTopicId(firstTopic);
              setCurrentSubTopicId(firstSubtopic);
              setNewCourseState('learning');

              // Save initial AI message
              const initialMessage = `Welcome to ${courseName} course! I'll be your AI teacher for this course. Let's begin with the course outline.`;
              await saveConversation('system', initialMessage, newCourseId, firstTopic, firstSubtopic);

              // Add initial AI message to the messages state
              setMessages(prevMessages => [...prevMessages, {
                id: prevMessages.length + 1,
                text: initialMessage,
                sender: 'ai'
              }]);
            });
            setSaveDialogOpen(false);
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NewCourseWindow;