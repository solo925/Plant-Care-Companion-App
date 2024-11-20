import React from "react";

const PopularSearches: React.FC = () => {
  const searches = [
    "Indoor Plants",
    "Outdoor Plants",
    "Watering Schedule",
    "Sunlight Needs",
    "Fertilizing Guide",
    "Pest Control",
    "Pruning Tips",
  ];

  return (
    <section className="popular-searches">
      <h2>Popular Searches</h2>
      <div className="search-tags">
        {searches.map((search, index) => (
          <button key={index} className="tag">
            {search}
          </button>
        ))}
      </div>
    </section>
  );
};

export default PopularSearches;
