import React, { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';
import sendIcon from '../assets/icons/send-message.png';

function MessageInput({ onSendMessage, initialText = '' }) {
  const [inputText, setInputText] = useState(initialText);

  useEffect(() => {
    setInputText(initialText);
  }, [initialText]);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    if (inputText.trim() !== '') {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        variant="outlined"
        placeholder="Type a message"
        value={inputText}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        sx={{
          marginRight: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#254336', // Change this to your desired background color
            borderRadius: '15px',
            fontSize: '18px',
            fontFamily: 'Libre Baskerville, Arial, sans-serif',
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
          '& .MuiInputLabel-root': {
            color: '#666666', // Change this to your desired label color
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#111111', // Change this to your desired border color
          },
        }}
      />
      <Box
        component="button"
        onClick={handleSend}
        aria-label="send message"
        sx={{
          width: 48,
          height: 48,
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
          '&:active': {
            opacity: 0.6,
          },
        }}
      >
        <img src={sendIcon} alt="Send" style={{ width: '100%', height: '100%' }} />
      </Box>
    </Box>
  );
}

export default MessageInput;