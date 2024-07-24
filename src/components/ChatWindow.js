import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Message from './Message';
import { styled } from '@mui/material/styles';

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

function ChatWindow({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <ScrollableBox 
      sx={{ 
        flexGrow: 1,
        overflowY: 'auto', 
        padding: 2,
        backgroundColor: '#254336',
        height: 'calc(100vh - 100px)', // Adjust this value based on your MessageInput height
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {messages.map(msg => (
          <Message 
            key={msg.id} 
            text={msg.text} 
            sender={msg.sender} 
            style={msg.text.startsWith('Blockchain 101 Course Outline:') || 
                  msg.text.startsWith('NFT Course Outline:') ||
                  msg.text.startsWith('Crypto Wallet Course Outline:') ||
                  msg.text.startsWith('Cryptocurrency 101 Course Outline:') ||
                  msg.text.startsWith('DeFi Course Outline:') ||
                  msg.text.startsWith('Smart Contract Development Course Outline:')
              ? { whiteSpace: 'pre-wrap' } 
              : {}
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </Box>
    </ScrollableBox>
  );
}

export default ChatWindow;