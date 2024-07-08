import React, { useState } from 'react';
import { WagmiConfig, useAccount } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './walletConfig';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import SuggestedCourse from './components/SuggestedCourse';
import './App.css';

const queryClient = new QueryClient()

function AppContent() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome! I'm your AI teacher.", sender: 'ai' },
    { id: 2, text: 'What are you going to learn today? Let me customize a course outline according to your profile to you.', sender: 'ai' },
  ]);
  const [activeComponent, setActiveComponent] = useState('Home');
  const [suggestedCourseInfo, setSuggestedCourseInfo] = useState(null);
  const { address } = useAccount();

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

  const handleStartLearning = (course, outline) => {
    setSuggestedCourseInfo({ title: course, outline: JSON.parse(outline) });
    setActiveComponent('SuggestedCourse');
  };

  return (
    <div className="app">
      <Sidebar 
        onHomeClick={handleHomeClick} 
        onNewCourseClick={handleNewCourseClick} 
        onSuggestedCourseClick={handleSuggestedCourseClick}
        onUserProfileClick={handleUserProfileClick}
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
            walletAddress={address}
          />
        )}
        {activeComponent === 'UserProfile' && <UserProfile />}
      </div>
    </div>
  );
}

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;