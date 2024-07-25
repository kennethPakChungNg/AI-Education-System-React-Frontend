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
    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f8e8'}}>
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        marginLeft: 1, 
        marginRight: 1, 
        height: '100%'
      }}>
        <RadioGroup
          row
          value={withImage ? 'with' : 'without'}
          onChange={(e) => setWithImage(e.target.value === 'with')}
          sx={{
            '& .MuiFormControlLabel-root': {
              color: '#776B5D',
              marginRight: 0,
            },
            '& .MuiRadio-root': {
              color: '#776B5D',
            },
            '& .MuiRadio-root.Mui-checked': {
              color: '#776B5D',
            },
          }}
        >
          <FormControlLabel
            value="with"
            control={<Radio sx={{ color: '#776B5D', '&.Mui-checked': { color: '#776B5D' } }} />}
            label="With Image"
          />
          <FormControlLabel
            value="without"
            control={<Radio sx={{ color: '#776B5D', '&.Mui-checked': { color: '#776B5D' } }} />}
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