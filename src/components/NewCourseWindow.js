import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Message from './Message';
import MessageInput from './MessageInput';
import axios from 'axios';

function NewCourseWindow({ messages, setMessages, newCourseState, setNewCourseState, onGenerateCourseOutline, onModifyCourseOutline, onStartWithCourseOutline, address }) {
  const [topic, setTopic] = useState('');
  const [modification, setModification] = useState('');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const messagesEndRef = useRef(null);
  const [courseId, setCourseId] = useState(null);
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [currentSubTopicId, setCurrentSubTopicId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Formatting the AI response
  const formatAIResponse = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    text = text.replace(/^-\s*/gm, '');
    const sections = text.split('###').filter(section => section.trim() !== '');
    
    const formattedSections = sections.map(section => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n');
      
      const formattedContent = content
        .replace(/(\d+\.\s)/g, '<br><br>$1')
        .replace(/([A-Z][^.!?]+[.!?])\s/g, '$1<br><br>')
        .replace(/(-\s)/g, '<br>• ');
      
      return `<h3 class="ai-response-title">${title}</h3>\n${formattedContent}`;
    });
    
    return formattedSections.join('\n\n');
  };

  const handleSendMessage = async (text, withImage) => {
    console.log('Sending message:', text);
    if (newCourseState === 'learning') {
      try {
        const textResponse = await axios.post('http://localhost:5000/aiGen/answerUserQuestion', {
          WalletAddress: address,
          CourseId: courseId,
          TopicId: currentTopicId,
          SubTopicId: currentSubTopicId,
          Message: text
        });
  
        console.log('AI response:', textResponse.data.data);
  
        let imageResponse = null;
        if (withImage) {
          try {
            imageResponse = await axios.post('http://localhost:5000/aiGen/genEducateImage', {
              WalletAddress: address,
              CourseId: courseId,
              TopicId: currentTopicId,
              SubTopicId: currentSubTopicId,
              Message: text
            });
          } catch (imageError) {
            console.error('Error generating image:', imageError);
          }
        }
  
        // Update messages state with formatted AI response
        setMessages(prev => [
          ...prev,
          { id: prev.length + 1, text: text, sender: 'user' },
          { 
            id: prev.length + 2, 
            text: formatAIResponse(textResponse.data.data), // Format the AI response
            sender: 'ai',
            image: imageResponse && imageResponse.data ? imageResponse.data.data : null
          }
        ]);
  
        // Save conversation (use original unformatted response for saving)
        await axios.post('http://localhost:5000/conversation/saveSingleEduConversation', {
          WalletAddress: address,
          CourseId: courseId,
          TopicId: currentTopicId,
          SubTopicId: currentSubTopicId,
          Role: 'user',
          Message: text,
          ConversationTimestamp: Math.floor(Date.now() / 1000)
        });
  
        await axios.post('http://localhost:5000/conversation/saveSingleEduConversation', {
          WalletAddress: address,
          CourseId: courseId,
          TopicId: currentTopicId,
          SubTopicId: currentSubTopicId,
          Role: 'system',
          Message: textResponse.data.data, // Save original unformatted response
          ConversationTimestamp: Math.floor(Date.now() / 1000)
        });
  
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
        </Box>
      </Paper>
      <Box sx={{ p: 2, backgroundColor: '#1a2f26' }}>
        {newCourseState === 'initial' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter the topic you want to learn"
              sx={{ 
                backgroundColor: '#254336',
                input: { color: 'white' }
              }}
            />
            <Button variant="contained" onClick={() => {
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
            <Button variant="contained" onClick={() => {
              onModifyCourseOutline(modification);
              setModification('');
            }}>
              Modify Course Outline
            </Button>
            <Button variant="contained" onClick={() => setSaveDialogOpen(true)}>
              Start With Course Outline
            </Button>
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
            onStartWithCourseOutline(courseName, (newCourseId, firstTopic, firstSubtopic) => {
              setCourseId(newCourseId);
              setCurrentTopicId(firstTopic);
              setCurrentSubTopicId(firstSubtopic);
              setNewCourseState('learning');
            });
            setSaveDialogOpen(false);
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default NewCourseWindow;