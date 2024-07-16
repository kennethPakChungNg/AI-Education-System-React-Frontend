import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useAccount } from 'wagmi';
import axios from 'axios';
import learnHistoryIcon from '../assets/icons/icons8-history-64.png';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import aiIcon from '../assets/images/Full-Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import suggestedCourseIcon from '../assets/icons/course.png'; 

const SidebarComponent = forwardRef(({ onHomeClick, onNewCourseClick, onSuggestedCourseClick, onUserProfileClick, activeComponent, onCourseHistoryClick }, ref) => {
  const [courseHistory, setCourseHistory] = useState([]);
  const { address, isConnected } = useAccount();

  const fetchCourseHistory = useCallback(async () => {
    if (!address) return;
    console.log('Fetching course history for address:', address);
    try {
      const response = await axios.post('http://localhost:5000/courseOutline/queryCourseOutline', {
        WalletAddress: address,
        requiredField: ['courseId', 'courseName']
      });
      console.log('Course history response:', response.data);
      
      if (response.data && response.data.data) {
        setCourseHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching course history:', error);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected) {
      fetchCourseHistory();
    }
  }, [isConnected, fetchCourseHistory]);

  useImperativeHandle(ref, () => ({
    fetchCourseHistory
  }));

  return (
    <Sidebar
      width="320px"
      backgroundColor="#1a2f26"
    >
      <div className="system-name">
        <img src={aiIcon} alt="AI Logo" className="system-icon" />
      </div>
      <hr/>
      <Menu>
        <MenuItem 
          icon={<HomeIcon style={{ color: '#ffffff', marginLeft: '1px' }} />}
          onClick={onHomeClick}
          active={activeComponent === 'Home'}
        >
          Home
        </MenuItem>
        {isConnected && (
          <>
            <MenuItem 
              icon={<PersonIcon />}
              onClick={onUserProfileClick}
              active={activeComponent === 'UserProfile'}
            >
              User Profile
            </MenuItem>
            <MenuItem 
              icon={<img src={suggestedCourseIcon} alt="Suggested Course" className="home-icon" />}
              onClick={onSuggestedCourseClick}
              active={activeComponent === 'SuggestedCourse'}
            >
              Suggested Course
            </MenuItem>
            <MenuItem 
              icon={<AddIcon style={{ color: '#ffffff' }} />}
              onClick={onNewCourseClick}
              active={activeComponent === 'ChatWindow'}
            >
              New Course
            </MenuItem>
            <hr/>
            <MenuItem className="search-menu-item">
              <input type="text" placeholder="Search or ⌘ /..." className="search-input" />
            </MenuItem>
            <SubMenu 
              label="Course History"
              icon={<img src={learnHistoryIcon} alt="History" className="favorite-icon" />}
            >
              {courseHistory.map((course, index) => (
                <MenuItem 
                  key={index} 
                  icon={<LocalLibraryIcon alt="Lesson" className="lesson-icon" />}
                  onClick={() => {
                    console.log('Course clicked:', course.courseId);
                    onCourseHistoryClick(course.courseId);
                  }}
                >
                  {course.courseName}
                </MenuItem>
              ))}
            </SubMenu>
          </>
        )}
      </Menu>
      <div className="user-section">
        {isConnected ? (
          <div className="user">
            <PersonIcon style={{ fontSize: 40, marginRight: 10 }} />
            <span className="user-name">{address.slice(0, 6)}...{address.slice(-4)}</span>
          </div>
        ) : (
          <w3m-button />
        )}
      </div>
    </Sidebar>
  );
});

export default SidebarComponent;