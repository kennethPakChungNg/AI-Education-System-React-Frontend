import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@mui/material';
import axios from 'axios';
import learnHistoryIcon from '../assets/icons/icons8-history-64.png';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import aiIcon from '../assets/images/Full-Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import suggestedCourseIcon from '../assets/icons/course.png'; 

const SidebarComponent = forwardRef(({ onHomeClick, onNewCourseClick, onSuggestedCourseClick, onUserProfileClick, activeComponent, onCourseHistoryClick, onCourseRename }, ref) => {
  const [courseHistory, setCourseHistory] = useState([]);
  const { address, isConnected } = useAccount();
  const [renamingCourse, setRenamingCourse] = useState(null);
  const [newCourseName, setNewCourseName] = useState('');
  const { disconnect } = useDisconnect();

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


  const handleRename = async (courseId, newName) => {
    try {
      await onCourseRename(courseId, newName);
      setRenamingCourse(null);
      fetchCourseHistory();
    } catch (error) {
      console.error('Error renaming course:', error);
    }
  };

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
                <MenuItem key={index} className="course-history-item">
                  {renamingCourse === course.courseId ? (
                    <div className="renaming-course">
                      <input 
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        className="rename-input"
                      />
                      <div className="rename-buttons">
                        <Button onClick={() => handleRename(course.courseId, newCourseName)} className="rename-button">
                          Save
                        </Button>
                        <Button onClick={() => setRenamingCourse(null)} className="rename-button">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="course-item">
                      <div onClick={() => onCourseHistoryClick(course.courseId)} className="course-name">
                        <LocalLibraryIcon alt="Lesson" className="lesson-icon" />
                        <span>{course.courseName}</span>
                      </div>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingCourse(course.courseId);
                          setNewCourseName(course.courseName);
                        }}
                        className="rename-trigger"
                      >
                        ...
                      </Button>
                    </div>
                  )}
                </MenuItem>
              ))}
            </SubMenu>
          </>
        )}
      </Menu>
      <div className="user-section" style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {isConnected ? (
          <>
            <div className="user" style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <PersonIcon style={{ fontSize: 40, marginRight: 10 }} />
              <span className="user-name">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </div>
            <Button 
              onClick={() => disconnect()} 
              style={{ 
                backgroundColor: '#9EB384', 
                color: 'white', 
                width: '100%', 
                padding: '10px',
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: 'Comfortaa, sans-serif'
              }}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <w3m-button />
        )}
      </div>
    </Sidebar>
  );
});

export default SidebarComponent;