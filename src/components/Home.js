import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { ButtonGroup, Button, Container, CircularProgress } from '@mui/material';
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
  const [courseOutlines, setCourseOutlines] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseOutlines = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courseOutline/suggestedCourseOutlines');
        const outlines = response.data.data.reduce((acc, course) => {
          acc[course.courseName] = course.courseOutline;
          return acc;
        }, {});
        setCourseOutlines(outlines);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course outlines:', error);
        setLoading(false);
      }
    };

    fetchCourseOutlines();
  }, []);

  const renderTabContent = () => {
    if (loading) {
      return <CircularProgress />;
    }

    const outlineContent = courseOutlines[activeTab];
    if (!outlineContent) {
      return <Typography>No course outline available</Typography>;
    }

    return (
      <Card sx={{ maxWidth: '100%', marginTop: 4 }} style={{backgroundColor: '#F1F8E8'}}>
        <CardContent>
          <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
            {activeTab} Course Outline
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
            This course provides a comprehensive introduction to {activeTab}, exploring its key concepts, applications, and impact on the blockchain and cryptocurrency ecosystem.
          </Typography>
          <Typography variant="body1" component="div" style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '0 20px' }}>
            <ol>
              {Object.entries(outlineContent).map(([title, subtitles], index) => (
                <li key={index}>
                  {title}
                  <ul>
                    {Object.entries(subtitles).map(([subtitle, description], subIndex) => (
                      <li key={`${index}-${subIndex}`} style={{padding: '10px 0'}}>
                        {subtitle}: {description}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Typography>
        </CardContent>
        <CardActions style={{ width: '100%', margin: '20px 920px' }}>
          <Button 
            className="start-learning-btn"
            onClick={() => onStartLearning(activeTab, JSON.stringify(outlineContent))}
            startIcon={<img src={startLearningIcon} alt="Start to learn" style={{ width: 24, height: 24 }} />}
            variant="contained"
            color="primary"
            size="large"
            style={{backgroundColor: '#6B8A7A', fontFamily: 'Libre Baskerville Bold, sans-serif'}}
          >
            Start Learning
          </Button>
        </CardActions>
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
    <div className="home">
      <Card sx={{ maxWidth: 1350, position: 'relative', margin: '50px 120px' }} className="home-instruction">
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
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginTop: 2 , fontFamily: 'Libre Baskerville, sans-serif', paddingTop: '30px', marginLeft: '3px'}}>
            Choose the pre-defined course below to begin
          </Typography>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginTop: 2 , fontFamily: 'Libre Baskerville, sans-serif', fontWeight: 'bold', paddingTop: '10px', marginLeft: '200px'}}>
            OR
          </Typography>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginTop: 2, fontFamily: 'Libre Baskerville, sans-serif', paddingTop: '10px', marginLeft: '3px'}}>
            Press 
            <AddIcon sx={{ marginLeft: '5px', marginRight: '5px', color: '#152621' }} />
            in sidebar to create your new course.
          </Typography>
        </CardContent>
      </Card>
      <div className="course-suggestions-section">
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontFamily: 'Libre Baskerville Bold, sans-serif', fontSize: '45px', paddingBottom:'20px', color: '#111111' }}>
            Course Suggestions
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
        <Container maxWidth="lg">
          <div className="tab-content">{renderTabContent()}</div>
        </Container>
      </div>
    </div>
  );
}

export default Home;