import React from "react";
import "../../assets/styles/plantcare.css";
import Sidebar from "../../componets/Home/Sidebar";
import HumidityLevels from "../../componets/plantCareTips/HumidityLevels";
import PlantHealth from "../../componets/plantCareTips/plantHealth";
import PlantTypes from "../../componets/plantCareTips/PlantTypes";
import PopularSearches from "../../componets/plantCareTips/PopularSearches";
import SearchBar from "../../componets/plantCareTips/Searchbar";
import TailoredForYou from "../../componets/plantCareTips/TailoredForYou";
const PlantCareTipsPage: React.FC = () => {
  return (
    <div className="plant-care-tips-page">
      <Sidebar />
      <div className="main-content">
        <SearchBar />
        <PopularSearches />
        <PlantTypes />
        <HumidityLevels />
        <PlantHealth />
        <TailoredForYou />
      </div>
    </div>
  );
};

export default PlantCareTipsPage;
