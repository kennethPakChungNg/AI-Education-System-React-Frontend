import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { ButtonGroup, Button, Container} from '@mui/material';
import { styled } from '@mui/material/styles';
import blockchainIcon from '../assets/icons/blockchain_logo.png';
import nftIcon from '../assets/icons/nft.png';
import walletIcon from '../assets/icons/crypto-wallet.png';
import bitcoinIcon from '../assets/icons/bitcoin.png';
import defiIcon from '../assets/icons/defi2.png';
import smartContractIcon from '../assets/icons/smart-contracts.png';
import newCourseIcon from '../assets/icons/icons8-add-64.png';
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

  const getOutlineContent = (tab) => {
    switch (tab) {
      case 'Blockchain 101':
        return `
              Blockchain 101 Course Outline:
                1. Introduction to Blockchain
                  i. What is blockchain?
                  ii. Brief history and origins
                  iii. Key features: decentralization, transparency, immutability
                2. How Blockchain Works
                  i. Blocks and chains explained
                  ii. Cryptographic hash functions
                  iii. Consensus mechanisms (e.g., Proof of Work, Proof of Stake)
                3. Blockchain vs. Traditional Databases
                  i. Centralized vs. decentralized systems
                  ii. Advantages and disadvantages
                  iii. Use cases for blockchain
                4. Cryptocurrencies
                  i. What are cryptocurrencies?
                  ii. Bitcoin: The first blockchain application
                  iii Other popular cryptocurrencies (e.g., Ethereum, Litecoin)
                5. Smart Contracts
                  i. Definition and purpose</li>
                  ii. How smart contracts work</li>
                  iii. Real-world applications</li>
                6. Blockchain Platforms
                  i. Ethereum</li>
                  ii. Hyperledger</li>
                  iii. Other notable platforms</li>
                7. Blockchain Applications Beyond Cryptocurrency
                  i. Supply chain management</li>
                  ii. Healthcare</li>
                  iii. Voting systems</li>
                  iv. Identity management</li>
                8. Blockchain Security
                  i. Scalability challenges</li>
                  ii. Interoperability between blockchains</li>
                  iii. Potential impact on various industries</li>
                9. The Future of Blockchain
                  i. Scalability challenges</li>
                  ii. Interoperability between blockchains</li>
                  iii. Potential impact on various industries</li>
                10. Getting Started with Blockchain
                  i. Setting up a wallet</li>
                  ii. Participating in a blockchain network</li>
                  iii. Resources for further learning</li>
                `;
      case 'NFT':
        return 'NFT Course Outline: [Add detailed outline here]';
      case 'Wallet':
        return 'Crypto Wallet Course Outline: [Add detailed outline here]';
      case 'Cryptocurrency':
        return 'Cryptocurrency 101 Course Outline: [Add detailed outline here]';
      case 'DeFi':
        return 'DeFi Course Outline: [Add detailed outline here]';
      case 'Smart Contract Dev':
        return 'Smart Contract Development Course Outline: [Add detailed outline here]';
      default:
        return '';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Blockchain 101':
        return (
          <Card sx={{ maxWidth: '100%', marginTop: 4 }} style={{backgroundColor: '#F1F8E8'}}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
                Blockchain 101 Course Outline
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
                Blockchain 101 covers the fundamental concepts of blockchain technology, starting from the basics and progressing to more advanced topics. It provides a well-rounded introduction for beginners, touching on both technical aspects and real-world applications.
              </Typography>
              <Typography variant="body1" component="div" style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '0 20px' }}>
                <ol>
                  <li>
                    Introduction to Blockchain
                    <ul>
                      <li style={{padding: '10px 0'}}>What is blockchain?</li>
                      <li style={{padding: '10px 0'}}>Brief history and origins</li>
                      <li style={{padding: '10px 0'}}>Key features: decentralization, transparency, immutability</li>
                    </ul>
                  </li>
                  <li>
                    How Blockchain Works
                    <ul>
                      <li style={{padding: '10px 0'}}>Blocks and chains explained</li>
                      <li style={{padding: '10px 0'}}>Cryptographic hash functions</li>
                      <li style={{padding: '10px 0'}}>Consensus mechanisms (e.g., Proof of Work, Proof of Stake)</li>
                    </ul>
                  </li>
                  <li>
                    Blockchain vs. Traditional Databases
                    <ul>
                      <li style={{padding: '10px 0'}}>Centralized vs. decentralized systems</li>
                      <li style={{padding: '10px 0'}}>Advantages and disadvantages</li>
                      <li style={{paddingTop: '10px'}}>Use cases for blockchain</li>
                    </ul>
                  </li>
                  {/* Add other list items here */}
                </ol>
              </Typography>
            </CardContent>
            <CardActions style={{ width: '100%',margin: '20px 920px' }}>
              <Button 
                className="start-learning-btn"
                onClick={() => onStartLearning(activeTab, getOutlineContent(activeTab))}
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
      case 'NFT':
        return (
          <Card sx={{ maxWidth: '100%', marginTop: 4 }} style={{backgroundColor: '#F1F8E8'}}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
                NFT Course Outline
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
                This course provides a comprehensive introduction to Non-Fungible Tokens (NFTs), exploring their creation, use cases, and impact on digital ownership and art.
              </Typography>
              {/* Add more NFT course content here */}
            </CardContent>
            <CardActions style={{ margin: '20px 45px' }}>
              <Button 
                className="start-learning-btn"
                onClick={() => onStartLearning(activeTab, getOutlineContent(activeTab))}
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
      case 'Wallet':
        return (
          <Card sx={{ maxWidth: '100%', marginTop: 4 }} style={{backgroundColor: '#F1F8E8'}}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
                Crypto Wallet Course Outline
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
                Learn about cryptocurrency wallets, their types, security features, and best practices for managing your digital assets.
              </Typography>
              {/* Add more Wallet course content here */}
            </CardContent>
            <CardActions style={{ margin: '20px 45px' }}>
              <Button 
                className="start-learning-btn"
                onClick={() => onStartLearning(activeTab, getOutlineContent(activeTab))}
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
      case 'Cryptocurrency':
        return (
          <Card sx={{ maxWidth: '100%', marginTop: 4 }} style={{backgroundColor: '#F1F8E8'}}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
                Cryptocurrency 101 Course Outline
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
                Dive into the world of cryptocurrencies, understanding their underlying technology, market dynamics, and potential future impacts.
              </Typography>
              {/* Add more Cryptocurrency course content here */}
            </CardContent>
            <CardActions style={{ margin: '20px 45px' }}>
              <Button 
                className="start-learning-btn"
                onClick={() => onStartLearning(activeTab, getOutlineContent(activeTab))}
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
      case 'DeFi':
        return (
          <Card sx={{ maxWidth: '100%', marginTop: 4 }} style={{backgroundColor: '#F1F8E8'}}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
                DeFi Course Outline
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
                Explore Decentralized Finance (DeFi), its protocols, applications, and how it's reshaping traditional financial systems.
              </Typography>
              {/* Add more DeFi course content here */}
            </CardContent>
            <CardActions style={{ margin: '20px 45px' }}>
              <Button 
                className="start-learning-btn"
                onClick={() => onStartLearning(activeTab, getOutlineContent(activeTab))}
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
      case 'Smart Contract Dev':
        return (
          <Card sx={{ maxWidth: '100%', marginTop: 4 }} style={{backgroundColor: '#F1F8E8'}}>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom style={{ textAlign: 'center', fontFamily: 'Libre Baskerville Bold, sans-serif' }}>
                Smart Contract Development Course Outline
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph style={{ fontFamily: 'Libre Baskerville Bold, sans-serif', padding: '5px 40px' }}>
                Learn to develop, deploy, and interact with smart contracts on blockchain platforms, with a focus on Ethereum and Solidity.
              </Typography>
              {/* Add more Smart Contract Development course content here */}
            </CardContent>
            <CardActions style={{ margin: '20px 45px' }}>
              <Button 
                className="start-learning-btn"
                onClick={() => onStartLearning(activeTab, getOutlineContent(activeTab))}
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
      default:
        return null;
    }
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
          height="400"  // Adjust this value as needed
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
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginTop: 2 , fontFamily: 'Libre Baskerville, sans-serif', paddingTop: '30px'}}>
            Choose the pre-defined course below to begin OR
          </Typography>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginTop: 2 , fontFamily: 'Libre Baskerville, sans-serif', paddingTop: '30px'}}>
            Press 
            <img src={newCourseIcon} alt="New Course" className="instruction-icon" style={{ marginLeft: '5px', marginRight: '5px' }} />
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