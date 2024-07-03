import React, { useState } from 'react';
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './walletConfig';  // Changed from 'config' to 'wagmiConfig'
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import './App.css';

// Create a client
const queryClient = new QueryClient()

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome! I'm your AI teacher.", sender: 'ai' },
    { id: 2, text: 'What are you going to learn today? Let me customize a course outline according to your profile to you.', sender: 'ai' },
  ]);
  const [activeComponent, setActiveComponent] = useState('Home');
  const [currentOutline, setCurrentOutline] = useState('');

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

  const handleStartLearning = (course, outline) => {
    setCurrentOutline(outline);
    setActiveComponent('ChatWindow');
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="app">
          <Sidebar 
            onHomeClick={handleHomeClick} 
            onNewCourseClick={handleNewCourseClick} 
            onUserProfileClick={handleUserProfileClick}
            activeComponent={activeComponent}
          />
          <div className="main-content">
            {activeComponent === 'Home' && <Home onStartLearning={handleStartLearning} />}
            {activeComponent === 'ChatWindow' && (
              <div className="chat-container">
                <ChatWindow messages={messages} />
                <MessageInput onSendMessage={handleSendMessage} initialText={currentOutline} />
              </div>
            )}
            {activeComponent === 'UserProfile' && <UserProfile />}
          </div>
        </div>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;