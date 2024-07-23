import React, { useState, useRef } from 'react';
import axios from 'axios';
import { WagmiProvider , useAccount } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './walletConfig';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import SuggestedCourse from './components/SuggestedCourse';
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

  const handleStartLearning = async (courseName, courseOutline) => {
    try {
      const response = await axios.post(`${backendBaseUrl}/courseOutline/saveCourseOutline`, {
        WalletAddress: address,
        courseName: courseName,
        courseOutline: courseOutline
      });
  
      if (response.data && response.data.data && response.data.data.courseId) {
        setSuggestedCourseInfo({ 
          title: courseName, 
          outline: courseOutline,
          courseId: response.data.data.courseId
        });
        setActiveComponent('SuggestedCourse');
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
          <div className="chat-container">
            <ChatWindow messages={messages} />
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
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