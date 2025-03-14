import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { ButtonGroup, Button, Container, CircularProgress, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import blockchainIcon from '../assets/icons/blockchain_logo.png';
import nftIcon from '../assets/icons/nft.png';
import walletIcon from '../assets/icons/crypto-wallet.png';
import bitcoinIcon from '../assets/icons/bitcoin.png';
import defiIcon from '../assets/icons/defi2.png';
import smartContractIcon from '../assets/icons/smart-contracts.png';
import AddIcon from '@mui/icons-material/Add';
import startLearningIcon from '../assets/icons/start_to_learn.png';
import instructionBackground from '../assets/images/instruction_background.jpg';

const ScrollableContainer = styled('div')(({ theme }) => ({
  maxHeight: 'calc(100vh - 400px)', 
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


const ScrollableHome = styled('div')(({ theme }) => ({
  height: '100vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#1a2f26',
    borderRadius: '4px',
    '&:hover': {
      background: '#1a2f26',
    },
  },
  scrollbarWidth: 'thin',
  scrollbarColor: '#FFEECC transparent',
}));


const StyledButtonGroup = styled(ButtonGroup)({
  '& .MuiButtonGroup-grouped': {
    border: 'none',
    '&:not(:last-of-type)': {
      borderRadius: 0,
    },
    '&:last-of-type': {
      borderTopRightRadius: '5px',
      borderBottomRightRadius: '5px',
    },
    '&:first-of-type': {
      borderTopLeftRadius: '5px',
      borderBottomLeftRadius: '5px',
    },
  },
});

const StyledButton = styled(Button)({
  padding: '5px 28.5px',
  backgroundColor: '#B7B597',
  color: '#111011',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'Comfortaa',
  fontSize: '15px',
  '&:hover': {
    backgroundColor: '#A5A384',
  },
  '&.active': {
    backgroundColor: '#DAD3BE',
    color: '#254336',
    borderStyle: 'solid',
  },
});

const TabIcon = styled('img')({
  width: '40px',
  height: '40px',
  marginRight: '7px',
});

function Home({ onStartLearning }) {
  const [activeTab, setActiveTab] = useState('Blockchain 101');
  const [courseOutlines, setCourseOutlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseOutlines = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courseOutline/suggestedCourseOutlines');
        if (response.data && response.data.data) {
          setCourseOutlines(response.data.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setCourseOutlines([]);
        }
      } catch (error) {
        console.error('Error fetching course outlines:', error);
        setCourseOutlines([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourseOutlines();
  }, []);

  const renderTabContent = () => {
    if (loading) {
      return <CircularProgress />;
    }
  
    const course = courseOutlines.find(course => course.courseName === activeTab);
    if (!course || !course.courseOutline) {
      return <Typography>No course outline available for {activeTab}</Typography>;
    }
  
    const outlineContent = course.courseOutline;
  
    return (
      <Card sx={{ maxWidth: '100%', position: 'relative', pb: 8 }} style={{backgroundColor: '#F1F8E8'}}>
        <ScrollableContainer style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
            {activeTab} Course Outline
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
            This course provides a comprehensive introduction to {activeTab}, exploring its key concepts, applications, and impact on the blockchain and cryptocurrency ecosystem.
          </Typography>
          <Typography variant="body1" component="div" style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '0 20px' }}>
            {outlineContent && Object.entries(outlineContent).length > 0 ? (
              <ol>
                {Object.entries(outlineContent).map(([topicKey, topicValue]) => (
                  <li key={topicKey}>
                    {topicValue.topic}
                    {topicValue.details && topicValue.details.length > 0 && (
                      <ul>
                        {topicValue.details.map((detail, detailIndex) => {
                          const subtopicKey = Object.keys(detail)[0];
                          return (
                            <li key={`${topicKey}-${detailIndex}`} style={{padding: '10px 0'}}>
                              {subtopicKey}: {detail[subtopicKey]}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <Typography>No detailed outline available for this course.</Typography>
            )}
          </Typography>
        </CardContent>
        </ScrollableContainer>
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 1,
        }}>
          <Button 
            className="start-learning-btn"
            onClick={() => onStartLearning(activeTab, outlineContent, true)}
            startIcon={<img src={startLearningIcon} alt="Start to learn" style={{ width: 24, height: 24 }} />}
            variant="contained"
            color="primary"
            size="large"
            style={{backgroundColor: '#6B8A7A', fontFamily: 'Libre Baskerville Bold, sans-serif'}}
          >
            Start Learning
          </Button>
        </Box>
      </Card>
    );
  };

  const tabs = [
    { name: 'Blockchain 101', icon: blockchainIcon },
    { name: 'NFT', icon: nftIcon },
    { name: 'Wallet', icon: walletIcon },
    { name: 'Cryptocurrency', icon: bitcoinIcon },
    { name: 'DeFi', icon: defiIcon },
    { name: 'Smart Contract Dev', icon: smartContractIcon },
  ];

  return (
    <ScrollableHome>
      <div className="home">
        <Card sx={{ maxWidth: 1350, position: 'relative', margin: '20px 120px' }} className="home-instruction">
          <CardMedia
            component="img"
            height="400"
            image={instructionBackground}
            alt="Background Img"
          />
          <CardContent
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '45%',
              height: '100%',
              paddingLeft: '600px',
              color: '#152621',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h3" sx={{ fontFamily: 'Libre Baskerville Bold, sans-serif', fontSize: '42px' }}>
              Speed Your Learning By AI
            </Typography>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginTop: 2 , fontFamily: 'Libre Baskerville, sans-serif', paddingTop: '20px', marginLeft: '3px'}}>
              Traditional Education System Will Be Changed By AI.
            </Typography>
          </CardContent>
        </Card>
        <div className="course-suggestions-section">
          <Container maxWidth="lg">
            <Typography variant="h3" sx={{ fontFamily: 'Libre Baskerville Bold, sans-serif', fontSize: '45px', paddingBottom:'5px', color: '#111111' }}>
              Course Suggestions
            </Typography>
            <Typography variant="h6" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontFamily: 'Libre Baskerville, sans-serif', 
                paddingTop: '0px', 
                marginLeft: '5px',
                marginBottom: '10px',
                }}>
              Choose the pre-defined course below to begin OR Press 
              <AddIcon sx={{ marginLeft: '5px', marginRight: '5px', color: '#152621' }} />
              in sidebar to create your new course.
            </Typography>
            <StyledButtonGroup variant="contained" aria-label="course selection button group">
              {tabs.map((tab) => (
                <StyledButton
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={activeTab === tab.name ? 'active' : ''}
                >
                  <TabIcon src={tab.icon} alt={tab.name} />
                  {tab.name}
                </StyledButton>
              ))}
            </StyledButtonGroup>
          </Container>
          <Container maxWidth="lg" sx={{ height: 'calc(100vh - 300px)', mt: 4 }}>
            <div className="tab-content">{renderTabContent()}</div>
          </Container>
        </div>
      </div>
    </ScrollableHome>
  );
}

export default Home;