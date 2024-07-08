import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useAccount } from 'wagmi';
import learnHistoryIcon from '../assets/icons/icons8-history-64.png';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import lessonIcon from '../assets/icons/lesson.png';
import aiIcon from '../assets/images/Full-Logo.png';
import PersonIcon from '@mui/icons-material/Person';
import suggestedCourseIcon from '../assets/icons/course.png'; 

function SidebarComponent({ onHomeClick, onNewCourseClick, onSuggestedCourseClick, onUserProfileClick, activeComponent }) {
  const { address, isConnected } = useAccount()

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
              <MenuItem icon={<img src={lessonIcon} alt="Lesson" className="lesson-icon" />}>
                Blockchain Foundation
              </MenuItem>
              <MenuItem icon={<img src={lessonIcon} alt="Lesson" className="lesson-icon" />}>
                Crypto Currency 101
              </MenuItem>
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
}

export default SidebarComponent;