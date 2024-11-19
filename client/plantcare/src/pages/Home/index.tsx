// pages/HomePage.tsx
import React from "react";
import "../../assets//styles/Homepage.css";
import Activities from "../../componets/Home/Activities";
import ForumFeed from "../../componets/Home/ForumFeeds";
import Header from "../../componets/Home/Header";
import PlantGallery from "../../componets/Home/PkantGallary";
import Sidebar from "../../componets/Home/Sidebar";
import TodayDiscussion from "../../componets/Home/TodayDiscussion";

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="dashboard">
          <div className="left-section">
            <PlantGallery />
            <TodayDiscussion />
          </div>
          <div className="right-section">
            <ForumFeed />
          </div>
        </div>
        <Activities />
      </div>
    </div>
  );
};

export default HomePage;
