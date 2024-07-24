import React, { useState, useEffect } from 'react';
import { TextField, Box, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import sendIcon from '../assets/icons/send-message.png';

function MessageInput({ onSendMessage, initialText = '' }) {
  const [inputText, setInputText] = useState(initialText);
  const [withImage, setWithImage] = useState(false);

  useEffect(() => {
    setInputText(initialText);
  }, [initialText]);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    if (inputText.trim() !== '') {
      onSendMessage(inputText, withImage);
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
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, backgroundColor: '#9EB384'}}>
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
          flexGrow: 1,
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#254336',
            borderRadius: '15px',
            fontSize: '18px',
            fontFamily: 'Libre Baskerville, Arial, sans-serif',
          },
          '& .MuiOutlinedInput-input': {
            color: '#ffffff',
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#111111',
          },
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 1 }}>
        <RadioGroup
          row
          value={withImage ? 'with' : 'without'}
          onChange={(e) => setWithImage(e.target.value === 'with')}
          sx={{
            '& .MuiFormControlLabel-root': {
              color: '#ffffff',
              marginRight: 0,
            },
            '& .MuiRadio-root': {
              color: '#ffffff',
            },
            '& .MuiRadio-root.Mui-checked': {
              color: '#ffffff',
            },
          }}
        >
          <FormControlLabel
            value="with"
            control={<Radio sx={{ color: '#ffffff', '&.Mui-checked': { color: '#ffffff' } }} />}
            label="With Image"
          />
          <FormControlLabel
            value="without"
            control={<Radio sx={{ color: '#ffffff', '&.Mui-checked': { color: '#ffffff' } }} />}
            label="Without Image"
          />
        </RadioGroup>
      </Box>
      <Box
        component="button"
        onClick={handleSend}
        aria-label="send message"
        sx={{
          width: 48,
          height: '50%',
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          marginLeft: 0,
          display: 'flex',
          alignItems: 'center',
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