import React from "react";
import { FaBell, FaCog, FaHome, FaSignOutAlt, FaUser, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../../assets/styles/sudosidebar.css';

const Sidebar: React.FC = () => {

 
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Plant Database</h3>

      <nav>
        <ul>
          <li>
            <FaHome className="icon" />
            <Link to="/home" className="s-link">Home</Link>
          </li>
          <li>
            <FaUser className="icon" />
            <Link to="/profile" className="s-link">Profile</Link>
          </li>
          <li>
            <FaBell className="icon" />
            <Link to="/reminders" className="s-link">Reminders</Link>
          </li>
          <li>
            <FaUsers className="icon" />
            <Link to="/community" className="s-link">Community</Link>
          </li>
        </ul>
      </nav>

      <div className="down">
        <ul>
          <li>
            <FaCog className="icon-down" />
            <Link to="/settings" className="s-link">Settings</Link>
          </li>
          <li>
            <FaSignOutAlt className="icon-down" />
            <Link to="/logout" className="s-link">Sign Out</Link>
          </li>
        </ul>
      </div>
    </aside>
  )
};

export default Sidebar;
