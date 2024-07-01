import React, { useEffect, useRef } from 'react';
import { Paper, Box } from '@mui/material';
import Message from './Message';

function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: 'calc(100vh - 100px)',
        overflowY: 'auto', 
        padding: 2,
        backgroundColor: '#254336',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {messages.map(msg => (
          <Message key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
        <div ref={messagesEndRef} />
      </Box>
    </Paper>
  );
}

export default ChatWindow;