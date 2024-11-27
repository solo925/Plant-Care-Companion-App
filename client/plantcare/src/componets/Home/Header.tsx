import React from "react";
import plant2 from '../../assets/pla2.jpg';
import '../../assets/styles/Homepage.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="head">
        <img src={plant2} alt="header-plantcare" className="header-img start" />
        <h1 className="header-text">Welcome to Plant Care</h1>
        <img src={plant2} alt="header-plantcare" className="header-img end" />
      </div>
      <p>Customize Care</p>
    </header>
  );
};

export default Header;
