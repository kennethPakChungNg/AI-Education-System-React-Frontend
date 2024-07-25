import React from 'react';
import { Paper, Box } from '@mui/material';

function Message({ text, sender, image, style }) {
  const backgroundColor = sender === 'user' ? '#3AA6B9' : '#6B8A7A';
  const fontColor = sender === 'user' ? '#FFD0D0' : '#ffffff';
  const fontFamily = 'Libre Baskerville';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          padding: 2,
          maxWidth: '70%',
          backgroundColor: backgroundColor,
          borderRadius: sender === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0',
          textAlign: sender === 'user' ? 'right' : 'left',
          color: fontColor,
        }}
      >
        <div 
          className={`message-content ${sender}`}
          style={{
            ...style, 
            fontFamily: fontFamily, 
            fontSize: '16px',
            color: sender === 'ai' ? '#1a2f26' : fontColor
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
        {image && (
          <Box mt={2} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={`data:image/png;base64,${image}`} 
              alt="Generated" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                maxHeight: '512px',
                objectFit: 'contain',
                borderRadius: '10px'
              }} 
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Message;