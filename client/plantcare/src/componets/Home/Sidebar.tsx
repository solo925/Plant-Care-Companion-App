import React from "react";
import { FaBell, FaCog, FaHeartbeat, FaHome, FaLeaf, FaSignOutAlt } from "react-icons/fa";
import '../../assets/styles/sudosidebar.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">Plant Database</h3>
      <nav>
        <ul>
          <li>
            <FaHome className="icon" />
            Home
          </li>
          <li>
            <FaBell className="icon" />
            Reminders
          </li>
          <li>
            <FaLeaf className="icon" />
            Community
          </li>
          <li>
            <FaHeartbeat className="icon" />
            Track Health
          </li>
          <div className="down">
          <li>
            <FaCog className="icon-down" />
            Settings
          </li>
          <li>
            <FaSignOutAlt className="icon-down" />
            Sign Out
            </li>
          </div>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
