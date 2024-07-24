import React, { useState, useRef } from 'react';
import axios from 'axios';
import { WagmiProvider , useAccount } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './walletConfig';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { Box } from '@mui/material';
import CourseOutlineDisplay from './components/CourseOutlineDisplay';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import SuggestedCourse from './components/SuggestedCourse';
import NewCourseWindow from './components/NewCourseWindow';
import './App.css';
import { backendBaseUrl } from './serverConfig';

const queryClient = new QueryClient()

function AppContent() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome! I'm your AI teacher.", sender: 'ai' },
    { id: 2, text: 'What are you going to learn today? Let me customize a course outline according to your profile to you.', sender: 'ai' },
  ]);
  const [activeComponent, setActiveComponent] = useState('Home');
  const [suggestedCourseInfo, setSuggestedCourseInfo] = useState(null);
  const { address } = useAccount();
  const sidebarRef = useRef();
  const [newCourseState, setNewCourseState] = useState('initial');
  const [newCourseOutline, setNewCourseOutline] = useState(null);
  const [showCourseOutline, setShowCourseOutline] = useState(false);
  const [isNewCourse, setIsNewCourse] = useState(false);

  const [newCourseMessages, setNewCourseMessages] = useState([
    { id: 1, text: "Welcome! I'm your AI teacher.", sender: 'ai' },
    { id: 2, text: "What topic would you like to learn about? I'll create a customized course outline for you.", sender: 'ai' },
  ]);


  ////////////////////////      New Course Feature      ///////////////////////////////////////
  const formatCourseOutline = (rawOutline) => {
    const formattedOutline = {};
    Object.entries(rawOutline).forEach(([key, value]) => {
      formattedOutline[key] = {
        topic: value.topic.replace(/\*\*/g, '').trim(), // Remove asterisks from topic
        details: value.details.map(detail => {
          const subKey = Object.keys(detail)[0];
          return {
            [subKey]: detail[subKey].replace(/\*\*/g, '').trim(), // Remove asterisks from subtopics
            isCompleted: false
          };
        })
      };
    });
    return formattedOutline;
  };

  const formatCourseOutlineForDisplay = (outline) => {
    return Object.entries(outline).map(([key, value]) => {
      const topicLine = `<strong>${key}: ${value.topic}</strong><br>`;
      const subtopics = value.details.map(detail => {
        const subKey = Object.keys(detail)[0];
        return `&nbsp;&nbsp;&nbsp;&nbsp;${subKey}: ${detail[subKey]}`;
      }).join('<br>');
      return `${topicLine}${subtopics}`;
    }).join('<br><br>');
  };


  const handleGenerateCourseOutline = async (topic) => {
    try {
      setNewCourseMessages(prev => [...prev, { id: prev.length + 1, text: topic, sender: 'user' }]);
  
      console.log('Generating course outline for topic in New Course:', topic);
      
      const response = await axios.post(`${backendBaseUrl}/aiGen/genCourseOutline`, {
        WalletAddress: address,
        TopicName: topic
      });
  
      console.log('Full response from genCourseOutline:', response);
  
      if (response.data && response.data.data) {
        const rawOutline = response.data.data;
        console.log('Raw outline:', rawOutline);  // Add this line
  
        const formattedOutline = formatCourseOutline(rawOutline);
        const displayOutline = formatCourseOutlineForDisplay(formattedOutline);
        
        setNewCourseMessages(prev => [...prev, 
          { id: prev.length + 1, text: 'Here is the generated course outline:', sender: 'ai' },
          { id: prev.length + 2, text: displayOutline, sender: 'ai', isOutline: true }
        ]);
        setNewCourseOutline(formattedOutline);
        setNewCourseState('outline-generated');
        setShowCourseOutline(false); // Hide the course outline initially
        console.log('New Course Formatted outline:', formattedOutline);
      } else {
        console.error('Received empty or invalid course outline data');
        setNewCourseMessages(prev => [...prev, { id: prev.length + 1, text: 'Error: Received empty or invalid course outline. Please try again.', sender: 'ai' }]);
      }
    } catch (error) {
      console.error('Error generating course outline:', error);
      setNewCourseMessages(prev => [...prev, { id: prev.length + 1, text: 'Error generating course outline. Please try again.', sender: 'ai' }]);
    }
  };

  const handleModifyCourseOutline = async (modification) => {
    try {

      setNewCourseMessages(prev => [...prev, { id: prev.length + 1, text: modification, sender: 'user' }]);

      const response = await axios.post(`${backendBaseUrl}/aiGen/genCourseOutline`, {
        WalletAddress: address,
        TopicName: Object.values(newCourseOutline)[0].topic, // Use the first topic as the main topic
        LastGeneratedCourseOutline: newCourseOutline,
        UserComment: modification
      });
  
      console.log('Full response from modifyCourseOutline:', response);
  
      if (response.data && response.data.data) {
        const rawOutline = response.data.data;
        console.log('Raw modified outline:', rawOutline);
  
        const formattedOutline = formatCourseOutline(rawOutline);
        const displayOutline = formatCourseOutlineForDisplay(formattedOutline);
        
        setNewCourseMessages(prev => [...prev, 
          { id: prev.length + 1, text: 'Here is the modified course outline:', sender: 'ai' },
          { id: prev.length + 2, text: displayOutline, sender: 'ai', isOutline: true }
        ]);
        setNewCourseOutline(formattedOutline);
      } else {
        console.error('Received empty or invalid modified course outline data');
        setNewCourseMessages(prev => [...prev, { id: prev.length + 1, text: 'Error: Received empty or invalid modified course outline. Please try again.', sender: 'ai' }]);
      }
    } catch (error) {
      console.error('Error modifying course outline:', error);
      setNewCourseMessages(prev => [...prev, { id: prev.length + 1, text: 'Error modifying course outline. Please try again.', sender: 'ai' }]);
    }
  };


  const handleStartWithCourseOutline = async (courseName, callback) => {
    try {
      const response = await axios.post(`${backendBaseUrl}/courseOutline/saveCourseOutline`, {
        WalletAddress: address,
        courseName: courseName,
        courseOutline: newCourseOutline
      });
  
      if (response.data && response.data.data && response.data.data.courseId) {
        const newCourseId = response.data.data.courseId;
        const firstTopic = Object.keys(newCourseOutline)[0];
        const firstSubtopic = Object.keys(newCourseOutline[firstTopic].details[0])[0];
        
        callback(newCourseId, firstTopic, firstSubtopic);
        setShowCourseOutline(true);
        
        // Start teaching the first subtopic
        const initialMessage = `Let's start with ${newCourseOutline[firstTopic].topic}: ${newCourseOutline[firstTopic].details[0][firstSubtopic]}`;
        setNewCourseMessages(prev => [...prev, 
          { id: prev.length + 1, text: initialMessage, sender: 'ai' }
        ]);
  
        // Trigger the AI response for the first subtopic
        const aiResponse = await axios.post(`${backendBaseUrl}/aiGen/answerUserQuestion`, {
          WalletAddress: address,
          CourseId: newCourseId,
          TopicId: firstTopic,
          SubTopicId: firstSubtopic,
          Message: initialMessage
        });
  
        if (aiResponse.data && aiResponse.data.data) {
          setNewCourseMessages(prev => [...prev, 
            { id: prev.length + 1, text: aiResponse.data.data, sender: 'ai' }
          ]);
        }
  
        // Update the sidebar
        if (sidebarRef.current && sidebarRef.current.fetchCourseHistory) {
          sidebarRef.current.fetchCourseHistory();
        }

        // Update the sidebar with the new course
        if (sidebarRef.current && sidebarRef.current.updateCourseHistory) {
          sidebarRef.current.updateCourseHistory({
            courseId: newCourseId,
            courseName: courseName
          });
        }

      }
    } catch (error) {
      console.error('Error saving course outline:', error);
    }
  };






  ////////////////////////////////////////////////////////////////////////////////////////////////

  const handleCheckboxChange = async (topicKey, subtopicKey) => {
    // Implement checkbox change logic here
    console.log('Checkbox changed:', topicKey, subtopicKey);
  };
  
  const handleQuizClick = async (topicKey, subtopicKey) => {
    // Implement quiz click logic here
    console.log('Quiz clicked:', topicKey, subtopicKey);
  };


  // Formatting the AI response
  const formatAIResponse = (text) => {
    // Replace asterisks with HTML bold tags
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  
    // Remove dashes at the beginning of lines
    text = text.replace(/^-\s*/gm, '');
  
    // Split the text into sections
    const sections = text.split('###').filter(section => section.trim() !== '');
    
    // Format each section
    const formattedSections = sections.map(section => {
      const lines = section.split('\n').filter(line => line.trim() !== '');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n');
      
      // Add line breaks for numbered points
      const formattedContent = content.replace(/(\d+\.\s)/g, '<br><br>$1');
      
      return `<h3 class="ai-response-title">${title}</h3>\n${formattedContent}`;
    });
    
    // Join the formatted sections
    return formattedSections.join('\n\n');
  };

  //handle renaming course in course outline collection (have wallet address)
  const handleCourseRename = async (courseId, newName) => {
    try {
      await axios.post(`${backendBaseUrl}/courseOutline/updateCourseName`, {
        WalletAddress: address,
        CourseId: courseId,
        CourseName: newName
      });
      if (sidebarRef.current && sidebarRef.current.fetchCourseHistory) {
        sidebarRef.current.fetchCourseHistory();
      }
      // If the renamed course is currently active, update its title
      if (suggestedCourseInfo && suggestedCourseInfo.courseId === courseId) {
        setSuggestedCourseInfo(prevInfo => ({
          ...prevInfo,
          title: newName
        }));
      }
    } catch (error) {
      console.error('Error renaming course:', error);
    }
  };


  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      text: text,
      sender: 'user',
    };
    setMessages([...messages, newMessage]);
    // Here you would also send the message to your backend and get the AI response
    // Then add the AI response to the messages array
  };

  const handleHomeClick = () => {
    setActiveComponent('Home');
  };

  const handleNewCourseClick = () => {
    setActiveComponent('ChatWindow');
  };

  const handleUserProfileClick = () => {
    setActiveComponent('UserProfile');
  };

  const handleSuggestedCourseClick = () => {
    setActiveComponent('SuggestedCourse');
  };

  const handleStartLearning = async (courseName, courseOutline, isNew = false) => {
    setIsNewCourse(isNew);
    try {
      const formattedOutline = Object.entries(courseOutline).reduce((acc, [topicKey, topicValue]) => {
        acc[topicKey] = {
          ...topicValue,
          details: topicValue.details.map(detail => {
            const subtopicKey = Object.keys(detail)[0];
            return {
              [subtopicKey]: detail[subtopicKey],
              isCompleted: detail.isCompleted !== undefined ? detail.isCompleted : false
            };
          })
        };
        return acc;
      }, {});
  
      const response = await axios.post('http://localhost:5000/courseOutline/saveCourseOutline', {
        WalletAddress: address,
        courseName: courseName,
        courseOutline: formattedOutline
      });
      console.log('response:', response);
      if (response.data && response.data.data && response.data.data.courseId) {
        setSuggestedCourseInfo({ 
          title: courseName, 
          outline: formattedOutline,
          courseId: response.data.data.courseId
        });
        
        setActiveComponent('SuggestedCourse');
        console.log('Setting active component to SuggestedCourse');
        if (sidebarRef.current && sidebarRef.current.fetchCourseHistory) {
          sidebarRef.current.fetchCourseHistory();
        }
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  /*const addCourseToHistory = async (course, outline) => {
    try {
      const response = await axios.post(`${backendBaseUrl}/courseOutline/saveCourseOutline`, {
        WalletAddress: address,
        courseName: course,
        courseOutline: outline
      });
      if (response.data && response.data.data && response.data.data.courseId) {
        console.log('Course added to history:', response.data.data);
        await axios.post(`${backendBaseUrl}/conversation/saveSingleEduConversation`, {
          WalletAddress: address,
          CourseId: response.data.data.courseId,
          TopicId: 'Introduction',
          SubTopicId: 'Introduction',
          Role: 'system',
          Message: `Welcome to ${course} course!`,
          ConversationTimestamp: Math.floor(Date.now() / 1000)
        });
        if (sidebarRef.current && sidebarRef.current.fetchCourseHistory) {
          sidebarRef.current.fetchCourseHistory();
        }
      }
    } catch (error) {
      console.error('Error adding course to history:', error);
    }
  };*/

  //handle course history click
  const handleCourseHistoryClick = async (courseId) => {
  console.log('handleCourseHistoryClick called with courseId:', courseId);
  try {
    const [outlineResponse, conversationResponse] = await Promise.all([
      axios.post(`${backendBaseUrl}/courseOutline/queryCourseOutline`, {
        WalletAddress: address,
        courseId: courseId
      }),
      axios.post(`${backendBaseUrl}/conversation/queryEduConversation`, {
        WalletAddress: address,
        CourseId: courseId,
        TopicId: 'A',
        SubTopicId: 'A.1'
      })
    ]);

    console.log('Outline response:', outlineResponse.data);
    console.log('Conversation response:', conversationResponse.data);

    if (outlineResponse.data && outlineResponse.data.data && outlineResponse.data.data[0]) {
      const courseOutline = outlineResponse.data.data[0];
      const conversationHistory = conversationResponse.data.data;

      setSuggestedCourseInfo({ 
        title: courseOutline.courseName,
        courseId: courseOutline.courseId,
        outline: courseOutline.courseOutline,
        messages: conversationHistory.map(conv => ({
          id: conv._id,
          text: conv.Role === 'system' ? formatAIResponse(conv.Message) : conv.Message,
          sender: conv.Role === 'system' ? 'ai' : 'user',
          topicId: conv.TopicId,
          subTopicId: conv.SubTopicId
        }))
      });
      console.log('Setting active component to SuggestedCourse');
      setActiveComponent('SuggestedCourse');
    } else {
      console.log('No course data found');
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
    }
  }
};

  return (
    <div className="app">
      <Sidebar 
        ref={sidebarRef}
        onHomeClick={handleHomeClick} 
        onNewCourseClick={handleNewCourseClick} 
        onSuggestedCourseClick={handleSuggestedCourseClick}
        onUserProfileClick={handleUserProfileClick}
        onCourseHistoryClick={handleCourseHistoryClick}
        onCourseRename={handleCourseRename}
        activeComponent={activeComponent}
      />
      <div className="main-content">
        {activeComponent === 'Home' && <Home onStartLearning={handleStartLearning} />}
        {activeComponent === 'ChatWindow' && (
          <Box display="flex" height="100vh">
            <Box flex={1} display="flex" flexDirection="column">
              {isNewCourse ? (
                <NewCourseWindow 
                  messages={newCourseMessages}
                  setMessages={setNewCourseMessages}
                  newCourseState={newCourseState}
                  setNewCourseState={setNewCourseState}
                  onGenerateCourseOutline={handleGenerateCourseOutline}
                  onModifyCourseOutline={handleModifyCourseOutline}
                  onStartWithCourseOutline={handleStartWithCourseOutline}
                  address={address}
                />
              ) : (
                <ChatWindow messages={messages} />
              )}
            </Box>
            {showCourseOutline && newCourseOutline && (
              <CourseOutlineDisplay 
                outline={newCourseOutline}
                onCheckboxChange={handleCheckboxChange}
                onQuizClick={handleQuizClick}
              />
            )}
          </Box>
        )}
        {activeComponent === 'SuggestedCourse' && suggestedCourseInfo && address && (
          <SuggestedCourse 
            courseTitle={suggestedCourseInfo.title} 
            initialCourseOutline={suggestedCourseInfo.outline}
            initialMessages={suggestedCourseInfo.messages}
            walletAddress={address}
            courseId={suggestedCourseInfo.courseId}
          />
        )}
        {activeComponent === 'UserProfile' && <UserProfile />}
      </div>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider  config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider >
  );
}

export default App;