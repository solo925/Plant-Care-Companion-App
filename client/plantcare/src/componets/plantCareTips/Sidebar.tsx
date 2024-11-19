import React from "react";
import { FaCog, FaHeartbeat, FaHome, FaLeaf, FaSignOutAlt } from "react-icons/fa";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <FaHome className="icon" />
          </li>
          <li>
            <FaCog className="icon" />
          </li>
          <li>
            <FaLeaf className="icon" />
          </li>
          <li>
            <FaHeartbeat className="icon" />
          </li>
          <li>
            <FaSignOutAlt className="icon" />
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
