import { useContext } from "react";
import { PlantCareContext } from "../../context";

const Header = () => {
  const context = useContext(PlantCareContext);
  const { user } = context || {};
  if (!user) {
      return (
    <div className="header">
      <h1>Plant Care Companion</h1>
      <p>Your green thumb in your pocket</p>
      <div>
      
        <a href="/login">Log In</a> <span style={{ margin: '0 10px' }}>|</span>
        <a href="/register">Register</a>
      </div>
    </div>
  );
  }
  return (
    <div className="header">
      <h1>Plant Care Companion</h1>
      <p>Your green thumb in your pocket</p>
    </div>
  );


};

export default Header;
