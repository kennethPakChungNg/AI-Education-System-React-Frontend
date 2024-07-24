import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useAccount, useDisconnect } from 'wagmi';
import { Button, Box } from '@mui/material';
import axios from 'axios';
import learnHistoryIcon from '../assets/icons/icons8-history-64.png';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import aiIcon from '../assets/images/Full-Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import suggestedCourseIcon from '../assets/icons/course.png'; 
import NewCourseWindow from './NewCourseWindow';
import { backendBaseUrl } from '../serverConfig';

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
      const response = await axios.post(`${backendBaseUrl}/courseOutline/queryCourseOutline`, {
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
    fetchCourseHistory,
    updateCourseHistory: (newCourse) => {
      setCourseHistory(prevHistory => [...prevHistory, newCourse]);
    }
  }));

  return (
    <Sidebar
      width="340px"
      backgroundColor="#1a2f26"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
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
                  active={activeComponent === 'NewCourseWindow'}
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
                  <Box 
                    sx={{ 
                      maxHeight: 'calc(80vh - 510px)',
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#2a3f36',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#4a5f56',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#5a6f66',
                      },
                    }}
                  >
                    {courseHistory.map((course, index) => (
                      <MenuItem 
                        key={index} 
                        className="course-history-item"
                        sx={{
                          padding: '8px 16px',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          },
                        }}
                      >
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
                  </Box>
                </SubMenu>
              </>
            )}
          </Menu>
        </Box>
        <Box sx={{ 
          padding: '10px', 
          backgroundColor: '#435334',
          marginTop: 'auto' // This pushes the user section to the bottom
        }}>
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
        </Box>
      </Box>
    </Sidebar>
  );
});

export default SidebarComponent;