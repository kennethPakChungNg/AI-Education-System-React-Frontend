import React from 'react';
import Avatar from 'react-avatar';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import learnHistoryIcon from '../assets/icons/icons8-history-64.png';
import homeIcon from '../assets/icons/icons8-home-128.png';
import newCourseIcon from '../assets/icons/icons8-add-64.png';
import lessonIcon from '../assets/icons/lesson.png';
import aiIcon from '../assets/icons/ai1.png';
import userSampleIcon from '../assets/icons/user_sample.png';
import PersonIcon from '@mui/icons-material/Person';

function SidebarComponent({ onHomeClick, onNewCourseClick, onUserProfileClick, activeComponent }) {
  return (
    <Sidebar
      width="320px"
      backgroundColor="#1a2f26"
    >
      <div className="system-name">
        <img src={aiIcon} alt="AI Logo" className="system-icon" />
        <h1 className="system-text">AI Education</h1>
      </div>
      <hr/>
      <Menu>
        <MenuItem 
          icon={<img src={homeIcon} alt="Home" className="home-icon" />}
          onClick={onHomeClick}
          active={activeComponent === 'Home'}
        >
          Home
        </MenuItem>
        <MenuItem 
          icon={<PersonIcon />}
          onClick={onUserProfileClick}
          active={activeComponent === 'UserProfile'}
        >
          User Profile
        </MenuItem>
        <MenuItem 
          icon={<img src={newCourseIcon} alt="New Course" className="home-icon" />}
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
      </Menu>
      <div className="user-section">
        <div className="user">
          <Avatar alt="User Profile Pic" size="50" src={userSampleIcon} className="user-avatar"/>
          <span className="user-name">Kenneth Ng</span>
        </div>
      </div>
    </Sidebar>
  );
}

export default SidebarComponent;